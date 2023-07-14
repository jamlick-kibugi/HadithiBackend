const db = require("../db/models/index");
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { formatData, formatPage } = require("../utils/utils");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration)
const { Replicate } =require("langchain/llms/replicate")
const { OpenAI } = require("langchain/llms/openai");
 
const  { SequentialChain, LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
 
 
 
const {Collab} =db;
const {Collabpage} =db;
const {User} =db;
const {Usercollab} =db;


const titleLLM = new OpenAI({ temperature: 1 });
const titleTemplate = ` Give me a random title of a children's storybook `;
const titlePromptTemplate = new PromptTemplate({
  template: titleTemplate,
  inputVariables: ["story"],
});
const titleChain = new LLMChain({
  llm: titleLLM,
  prompt: titlePromptTemplate,
  outputKey: "title",
});

const guideLLM = new OpenAI({ temperature: 0 });
const guideTemplate = ` Imagine you are high school teacher teaching a fictional narrative writing class. given the title of a story: {title}. give me 10 fun guiding questions to help students write a complete essay `;
const guidePromptTemplate = new PromptTemplate({
  template: guideTemplate,
  inputVariables: ["title"],
});
const guideChain = new LLMChain({
  llm: guideLLM,
  prompt: guidePromptTemplate,
  outputKey: "guide",
});

// image prompt Chain 
const imagePromptLLM = new OpenAI({ temperature: 0 });
const imagePromptTemplate = ` I'm going to give you a paragraph from a children's book.
 
paragraph:
{paragraph} 

give me an image prompt that best describes  the entire paragraph focus on details  such as the location, background, objects,character's appearance and expression, secondary characters and be as descriptive as possible. Do
not describe the character if there are no characters in paragraph.
  `;
const imagePromptPromptTemplate = new PromptTemplate({
  template: imagePromptTemplate,
  inputVariables: ["paragraph"],
});
const imagePromptChain = new LLMChain({
  llm: imagePromptLLM,
  prompt: imagePromptPromptTemplate,
  outputKey: "imagePrompt",
});

//image chain 

const imageModel = new Replicate({
  model:
    "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
  apiKey: process.env.REPLICATE_API_KEY,
  input: { image_dimensions: "512x512" },
 
});

const imageTemplate = new PromptTemplate({
  template:
  "output an image for {imagePrompt} make sure the image is like a cartoon and has warm earthy hues ",
inputVariables: ["imagePrompt"],
  
});

const imageChain = new LLMChain({
  prompt: imageTemplate,
  llm: imageModel,
  outputKey: "imageUrl",
   
});



const createCollab = async (req, res) => {
  
    const {currentUserId} = req.body
    const overallChain = new SequentialChain({
      chains: [titleChain,guideChain],    
      inputVariables: ["story"],        
      outputVariables: ["title","guide"],
      verbose: true,
    });
    const chainExecutionResult = await overallChain.call({
      story:'hi'
    });
    const title = formatData(chainExecutionResult.title)
    const guide = formatData(chainExecutionResult.guide)

    const newStory= await Collab.create({        
        updatedAt: new Date(),
        createdAt: new Date(),  
        userId:currentUserId,
        prompt:title,
        guide:guide,
        createdBy: currentUserId,     
        coverUrl: "https://th.bing.com/th/id/OIP.URwsnfs59IJEIPBcXiEpdgHaHa?pid=ImgDet&rs=1"  
      });


    res.json(newStory)
  
 
}

const getCollab = async (req, res) => {
   const {currentCollabId}=req.params
try {  
  
  const collab = await Collab.findAll({where: { id:currentCollabId}}); 
  res.json(collab)
} catch (err) {
   
  return res.status(400).json({ error: true, msg: err });    
} 
}

const getUserCollab = async (req,res)=>{
  const {currentUserId}=req.params
  try {  
    
    const collabs = await Collab.findAll({ where: {createdBy:currentUserId}
    }); 


      
    res.json(collabs)
  } catch (err) {
     
    return res.status(400).json({ error: true, msg: err });    
  
  }

}

const getUserCollabPages = async (req,res)=>{
  const {currentCollabId}=req.params
  try {  
    
    const collabpage = await Collabpage.findAll({where: { collabId:currentCollabId},order:["id"]}); 
    res.json(collabpage)
  } catch (err) {
     
    return res.status(400).json({ error: true, msg: err });    
  
  }

}

const createCollabPage =async(req,res)=>{
  const {currentCollabId}=req.body
  const newPage= await Collabpage.create({        
    updatedAt: new Date(),
    createdAt: new Date(),  
    collabId:currentCollabId,
    pageContent:"",
    pageNumber: 1,
    pageUrl:"https://images.pexels.com/photos/14569570/pexels-photo-14569570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"       
  });
  res.json(newPage)

}

const deleteCollabPage =async(req,res)=>{
  const {collabPageId}=req.params
  const newPage= await Collabpage.destroy({where:{id:collabPageId} })      
 res.send("deleted")

}

const editCollabContent =async(req,res)=>{
  const {pageContent,collabPageId}=req.body
  const newPage= await Collabpage.update({pageContent:pageContent},{where:{id:collabPageId} })      
 res.send(newPage)

}

const createPageImage =async(req,res)=>{
   
  const {prompt}=req.body

  const overallChain = new SequentialChain({
    chains: [imagePromptChain,imageChain],
    inputVariables: ["paragraph"],          
    outputVariables: ["imageUrl"],
    verbose: true,
  });
  const chainExecutionResult = await overallChain.call({
    paragraph:prompt  
           
  });

  

 


  // const newPage= await Collabpage.update({pageUrl:pageUrl},{where:{id:collabPageId} })      
 res.json(chainExecutionResult.imageUrl)

}

const editPageImage =async(req,res)=>{
  const {pageUrl,collabPageId}=req.body
  const newPage= await Collabpage.update({pageUrl:pageUrl},{where:{id:collabPageId}})  
  res.json("edit page image")
}


const createCoverImage =async(req,res)=>{
   
  const {prompt}=req.body

  const overallChain = new SequentialChain({
    chains: [imagePromptChain,imageChain],
    inputVariables: ["paragraph"],          
    outputVariables: ["imageUrl"],
    verbose: true,
  });
  const chainExecutionResult = await overallChain.call({
    paragraph:prompt  
           
  });
  // const newPage= await Collabpage.update({pageUrl:pageUrl},{where:{id:collabPageId} })      
 res.json(chainExecutionResult.imageUrl)

}

const editCoverImage= async(req,res)=>{
  const {coverUrl,collabId} = req.body

  const newPage= await Collab.update({coverUrl:coverUrl},{where:{id:collabId}})  



}

const shareCollab = async (req, res) => {
  const {email,collabId} = req.body
try { 
   const user = await User.findOne({ where: { email: email } })    
   const userCollab = await Usercollab.create({      
      updated_at: new Date(),
      created_at: new Date(),  
      userId:user.id,
      collabId:collabId,
    });  
    return res.json(userCollab)  
} catch (err) {
  console.log(err)
  return res.status(400).json({ error: true, msg: err });    
} 
}

const getShareCollab = async (req, res) => {
  const {currentUserId} = req.params
try { 
   const collabs = await Usercollab.findAll({ where: { userId: currentUserId},include:Collab })    
    
    return res.json(collabs)  
} catch (err) {
  console.log(err)
  return res.status(400).json({ error: true, msg: err });    
} 
}

 


module.exports = {
   
    createCollab,
    getCollab,
    getUserCollab,
    createCollabPage,
    getUserCollabPages,
    deleteCollabPage,
    editCollabContent,
    createPageImage,
    editPageImage,
    createCoverImage,
    editCoverImage,
    shareCollab,
    getShareCollab
   
};
     
