const db = require("../db/models/index");
const { Configuration, OpenAIApi } = require("openai");
const {Image} =db;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration)
const { Replicate } =require("langchain/llms/replicate")
const { OpenAI } = require("langchain/llms/openai");
 
const  { SimpleSequentialChain,SequentialChain, LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const {Story} =db;
 

// This is an LLMChain to write a synopsis given a title of a play.
 
const llm = new OpenAI({ temperature: 0 });
const template = `write a 100 word, 3 paragraph story about {character}`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["character"],
  outputKey:["story"]
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });


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
  outputKey:"imagePrompts"
  
});

 

// This is an LLM chain to generate images

const imageModel = new Replicate({
  model:
    "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
  apiKey: process.env.REPLICATE_API_KEY,
  input: { image_dimensions: "512x512" },
});

const imageTemplate = new PromptTemplate({
  template:
  "output an image for {pageDescription} in the style of a children's book illustration",
inputVariables: ["pageDescription"],
  
});

const imageChain = new LLMChain({
  prompt: imageTemplate,
  llm: imageModel,
   
});
 
 
 

const createStory = async (req, res) => {
    const {content,character,location,genre,age} = req.body
 
    const overallChain = new SequentialChain({
      chains: [synopsisChain, reviewChain],
      inputVariables: ["character", "synopsis"],
      verbose: true,
      outputVariables: ["story","imageUrl"],
    });
    const review = await overallChain.call(character);

    
    // res.json(review.story)
    console.log(review.story)

     
 
    
    // const prompt = "image of a dog"
    // const storyChain= writeStory()
    // const imageChain = createImage()
 
    // const overallChain = new SequentialChain({
    //     chains: [storyChain, imageChain],
         
    //   });

    //   const response = await overallChain.call()
    // try {
    //     const response = await openai.createImage({
    //       prompt,
    //       n: 2,
    //       size: "512x512"
    //     });
    //     const image_result = response.data.data;
    //     res.status(200).json({
    //       success: true,
    //       data: image_result
    //     });
    //   } catch(error) {
    //     console.log(error)
    //   }

   
  
 
}


const createImage = async (req, res) => { 
  const {imageDesc,storyId} = req.body
 
  const overallChain = new SimpleSequentialChain({
    chains: [imageChain],
    verbose: true,
    
     
  });
  const review = await overallChain.run(imageDesc);

  const image = await Image.create({        
    updated_at: new Date(),
    created_at: new Date(),  
    StoryId:storyId,
    imageUrl:review
     
  });

 console.log(image)


}
module.exports = {
   
    createStory,
    createImage
    
   
};
     
