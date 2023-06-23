const db = require("../db/models/index");
const { Configuration, OpenAIApi } = require("openai");
 
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration)
const { Replicate } =require("langchain/llms/replicate")
const { OpenAI } = require("langchain/llms/openai");
 
const  { SequentialChain, LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const {Story} =db;
 

// This is an LLMChain to write a synopsis given a title of a play and the era it is set in.
const llm = new OpenAI({ temperature: 0 });
const template = `You are a story teller. write a 100 words comedy about {title} set in {era}` ;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title", "era"],
});
const synopsisChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "synopsis",
});

// This is an LLMChain to write a review of a play given a synopsis.
const reviewLLM = new OpenAI({ temperature: 0 });
const reviewTemplate = ` I am going to tell you a story
story:
{synopsis}  

give me 3 prompts for image generation that  describe the story sequentially, and return it as a javascript  array of type string that is length 3.  `;
const reviewPromptTemplate = new PromptTemplate({
  template: reviewTemplate,
  inputVariables: ["synopsis"],
});
const reviewChain = new LLMChain({
  llm: reviewLLM,
  prompt: reviewPromptTemplate,
  outputKey: "review",
});

const createTest =  async (req, res) => {
  

    const overallChain = new SequentialChain({
        chains: [synopsisChain, reviewChain],
        inputVariables: ["era", "title"],
        // Here we return multiple variables
        outputVariables: ["synopsis", "review"],
        verbose: true,
      });
      const chainExecutionResult = await overallChain.call({
        title: "Tragedy at sunset on the beach",
        era: "Victorian England",
      });
      console.log(chainExecutionResult.synopsis);

      const imagePrompts = chainExecutionResult.review

      const story = await Story.create({        
        updated_at: new Date(),
        created_at: new Date(),  
        content:chainExecutionResult.synopsis,
         
      });

      res.json({imagePrompts,story})


      
}


module.exports = {
   
    createTest
    
   
};
     
