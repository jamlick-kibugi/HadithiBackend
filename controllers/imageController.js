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
const {Image} =db;
 
 
const getImages =  async (req, res) => {
  
    const images = await Image.findAll({where: {StoryId:1}});

    res.json(images)

      
}


module.exports = {
   
    getImages
    
   
};
     
