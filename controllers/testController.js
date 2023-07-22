const db = require("../db/models/index");
require('dotenv').config();
const { Op } = require("sequelize");
const { Configuration, OpenAIApi } = require("openai");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration)
const { Replicate } =require("langchain/llms/replicate")
const { OpenAI } = require("langchain/llms/openai");
 
const  { SequentialChain, LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const { formatData, formatPage } = require("../utils/utils");
const multer = require("multer");
 
 
const { storage }=require( '../firebase');
const { uploadBytes, getDownloadURL, ref }= require("firebase/storage");
// const { saveFile } = require("../utils/saveUrl");
const {Story} =db;
const {Page} = db;
const {User} = db;
const {Like} = db;
    
// This is an LLMChain to write a story of a book, given the context,character and location
const llm = new OpenAI({ 
  modelName:"text-davinci-003",
  temperature: 0, 
  openAIApiKey: process.env.OPENAI_API_KEY,
maxTokens:1000 });
const template = `You are a story teller. write a {length} words story about {content}.write in the style of a {genre} for children who are aged {age}

The main character has the following appearance {character}
and the story takes place in {location}


please remember to keep it to {length} words and not less than that. after you finish writing check if there are {length} words if there are less than {length} words please continue the story 
` ;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["content", "character","location","genre","age","length"],
});
const storyChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "story",
});


// This is an LLMChain to generate a title of a play given the story.
const titleLLM = new OpenAI({ temperature: 0 });
const titleTemplate = ` I am going to tell you a story
story:
{story} 

give me an appropriate title for this story `;
const titlePromptTemplate = new PromptTemplate({
  template: titleTemplate,
  inputVariables: ["story"],
});
const titleChain = new LLMChain({
  llm: titleLLM,
  prompt: titlePromptTemplate,
  outputKey: "title",
});














// image prompt chain
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
  "output an image for {imagePrompt} in the style of a {style}, make sure the image is like a cartoon and has warm earthy hues ",
inputVariables: ["imagePrompt","style"],
  
});

const imageChain = new LLMChain({
  prompt: imageTemplate,
  llm: imageModel,
  outputKey: "imageUrl",
   
});

//cover chain 

const coverModel = new Replicate({
  model:
    "ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
  apiKey: process.env.REPLICATE_API_KEY,
  input: { image_dimensions: "512x512" },
 
});

const coverTemplate = new PromptTemplate({
  template:
  "output an image of {location} with a {character} in the foreground. do this in the style of a children's storybook ",
inputVariables: ["character","location"],
  
});

const coverChain = new LLMChain({
  prompt: coverTemplate,
  llm: coverModel,
  outputKey: "coverUrl",
   
});

const getAllStory = async(req,res) =>{
  const {size,page}=req.params
  const {genreId,ageId,searchText} =req.query



  const queryObject ={}
  if (genreId && genreId!=="all") {
    queryObject.genreId= genreId
  }
  if (ageId && ageId!=="all") {
    queryObject.ageId= ageId
  }
  if (searchText) {
    queryObject.title= { [Op.iLike]: `%${searchText}%` }
  }

   

  
  const allStory = await Story.findAll(
    {where:queryObject,include: [ {model:Like },{model:User}], limit: size,
      offset: page * size }
  )
  const test = await Story.findAndCountAll(
    {where:queryObject}
  )

  const contentLength = test.count
  

   
  let pageCount = Math.ceil(contentLength/size)
  res.json({allStory,pageCount,contentLength})

 
}


const getUserStory = async(req,res) =>{
  const {currentUserId,page,size} = req.params
  const allStory = await Story.findAndCountAll(
    {where:{userId:currentUserId},include: [ {model:Like},{model:User}], limit: size,
      offset: page * size }
  )

  let pageCount = Math.ceil(allStory.count/size)


   
  res.json({allStory,pageCount})

 
}

const createTest =  async (req, res) => { 
  
  let{content:userContent,character,location,genre,age,length,numOfPages,style} = req.body

  const setGenre=()=>{
    if(genre==1){
      genre = "Fairytale"
    }
    else if(genre==2){
      genre = "Adventure"
    }
    else if(genre==3){
      genre = "Mystery"
    }
    else if(genre==4){
      genre = "Science Fiction"
    }
    else if(genre==5){
      genre = "Horror"
    }
  }

  

  const setAge=()=>{
    if(age==1){
      age = 2
    }
    else if(age==2){
      age = 4
    }
    else if(age==3){
      age = 6
    }
    else if(age==4){
      age = 8
    }
    else if(age==5){
      age = 10
    }
  }

  setGenre()
  setAge()

    const overallChain = new SequentialChain({
        chains: [storyChain,coverChain,titleChain],
        inputVariables: ["content", "character","location","genre","age","length"],
        // Here we return multiple variables
        outputVariables: ["story", "coverUrl","title"],
        verbose: true,
      });
      const chainExecutionResult = await overallChain.call({
        content: userContent,
        character: character,
        location:location,  
        genre: genre,
        age: age,
        length: length

      });
      const story=formatData(chainExecutionResult.story)


      //--------------TEST CODE---------------------
      const content = formatData(chainExecutionResult.story)
      const paragraphs=formatPage(content,numOfPages)
      const title = formatData(chainExecutionResult.title)
      const coverUrl = formatData(chainExecutionResult.coverUrl)
      // let filename = ""

      // const saveFile= (url)=> {
      //   let outputUrl = ""
      //   // Get file name from url.
      //   filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];

      //   var xhr = new XMLHttpRequest();
      //    xhr.open('GET', url, true);
      //    xhr.responseType = 'blob';
      //    xhr.onload = function(e) {
      //      if (this.status == 200) {
      //        var myBlob = this.response;
      //        console.log(myBlob)
      //        const storageRef = ref(storage, `images/${filename}`);  
    
      //        uploadBytes(storageRef, myBlob)
      //        .then((snapshot) => {
      //          console.log("submitted")
      //          return getDownloadURL(snapshot.ref);
               
               
      //        }).then((url)=>{
      //           console.log(url)
      //           outputUrl = url
      //        })
      //        // myBlob is now the blob that the object URL pointed to.
      //      }
      //    };
      //    xhr.send();
          
      // }

      // saveFile(coverUrl)

    
      const promptArray = []
      const imageArray =[]
      for(let i=0;i<paragraphs.length;i++){

        const overallChain = new SequentialChain({
          chains: [imagePromptChain,imageChain],
          inputVariables: ["paragraph","style"],          
          outputVariables: ["imagePrompt","imageUrl"],
          verbose: true,
        });
        const chainExecutionResult = await overallChain.call({
          paragraph: paragraphs[i],    
          style : style       
        });

        const imagePrompt = formatData(chainExecutionResult.imagePrompt)
        const image = chainExecutionResult.imageUrl

        
        imageArray.push(image)
        promptArray.push(imagePrompt)

      }

    //  const newStory= await Story.create({        
    //   updated_at: new Date(),
    //   created_at: new Date(),  
    //   title:title,
    //   coverUrl:coverUrl      
    // });



      res.json({promptArray,imageArray,paragraphs,story,title,coverUrl})


     

      //----------------OLD CODE---------------------------//

      // const imagePrompts = formatData(chainExecutionResult.review)

      // const story = await Story.create({        
      //   updated_at: new Date(),
      //   created_at: new Date(),  
      //   content:formatData(chainExecutionResult.synopsis),
         
      // });

      

      // res.json({imagePrompts,story})


      
}

const createCover = async(req,res)=>{
  const {coverUrl,title,userId,style,ageId,genreId} = req.body
   const newStory= await Story.create({        
      updated_at: new Date(),
      created_at: new Date(),  
      title:title,
      coverUrl:coverUrl   ,
      userId:userId,
      ageId:ageId,
      genreId:genreId
    });

  res.json(newStory)

}

const createPage = async(req,res)=>{
  const {pageNumber,pageContent,pageUrl,storyId,prompt} = req.body
   const newPage= await Page.create({        
      updated_at: new Date(),
      created_at: new Date(),  
      pageNumber:pageNumber,
      pageContent:pageContent ,
      pageUrl:pageUrl,
      storyId:storyId,
      prompt:prompt,
    });

  res.json(newPage)

}

const getStory =  async (req, res) => {
  
  const { storyId} = req.params;    
   
  const story = await Story.findAll({include: [
    { model: User},{model:Like} ]   ,where:{id : storyId}
  });
  res.json(story)

}
const getPages = async(req,res)=>{
 
  const { storyId,page,size } = req.params;    
  const pages = await Page.findAndCountAll({where: { storyId: storyId }, include:[{model:Story,include: [User]}],order:["pageNumber"], limit: size,
      offset: page * size});   
  res.json(pages)
}

const test =async(req,res)=>{
  res.json("hi")
}


const deleteStory =  async (req, res) => {
  
  const {storyId} = req.params;    

  //Delete associated Likes and Pages
  const like = await Like.destroy({where:{ storyId : storyId}});
  const page = await Page.destroy({where:{ storyId : storyId}});   
  const story = await Story.destroy({where:{id : storyId}});
  res.json(story)

}


 

module.exports = {
   
    createTest,
    getAllStory,
    getStory,
    getUserStory,
    createCover,
    createPage,
    getPages,
    test,
    deleteStory
    
   
};
     
