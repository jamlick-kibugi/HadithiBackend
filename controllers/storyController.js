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
const {User} =db;
const {Likes} =db;
 
 
 
const getStory =  async (req, res) => {
  
    const story = await Story.findAll({include:[Likes],include:[User]});
    

    res.send(story)

      
}


module.exports = {
   
    getStory
    
   
};
     
