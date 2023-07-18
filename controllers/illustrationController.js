

const { OpenAI } = require("langchain/llms/openai");
const  { SequentialChain, LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const  Replicate  = require("replicate");
const db = require("../db/models/index");
 
const {Illustration} =db;
 
   

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,     
  });


  
const generateIllustration = async (req,res)=>{
    const{prompt,image} = req.body   
      
      const output = await replicate.run(
        "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
        {
          input: {
            image,
            scale:7,
            prompt,
            image_resolution: "512",
            n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            
          }
        }
      );
   
   res.send({output})
 
}

const saveIllustration = async (req,res)=>{
  const{illustrationUrl,userId} = req.body  

  try {
    const newIllustration = await Illustration.create({
     userId:userId,
     illustrationUrl:illustrationUrl,
     updated_at: new Date(),
     created_at: new Date() }) 

 
     return res.status(200).json(newIllustration);
   
    
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  } 
 

}

const getAllIllustrations = async(req,res)=>{ 
  const {currentUserId,page,size} = req.params
  const illustration = await Illustration.findAndCountAll({where:{
    userId:currentUserId},limit: size,offset: page * size })

    
  res.json(illustration)
  // res.send("hdi")
}

const deleteIllustration = async(req,res)=>{ 
  const {currentIllustrationId} = req.params

   
  const illustration = await Illustration.destroy({
    where:{
      id:currentIllustrationId},});
    
 
  res.send("deleted")
}
 
 

module.exports = {
  getAllIllustrations,
   
    generateIllustration,
    saveIllustration,
    deleteIllustration
    
     
     
    
   
};
     