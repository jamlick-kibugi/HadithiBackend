const db = require("../db/models/index");
require('dotenv').config();
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
    
// This is an LLMChain to write a story of a book, given the context,character and location
const llm = new OpenAI({ 
  modelName:"text-davinci-003",
  temperature: 0, 
  openAIApiKey: process.env.OPENAI_API_KEY,
maxTokens:1000 });
const template = `You are a story teller. write a 400 words story about {content}.

The main character has the following appearance {character}
and the story takes place in {location}


please remember to keep it to 400 words and not less than that. after you finish writing check if there are 400 words if there are less than 400 words please continue the story 
` ;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["content", "character","location"],
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
  "output an image for {imagePrompt} in the style of a children's book illustration, make sure the image is like a cartoon and has warm earthy hues ",
inputVariables: ["imagePrompt"],
  
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
  const allStory = await Story.findAll({})

  res.json(allStory)
}

const createTest =  async (req, res) => {  

    const overallChain = new SequentialChain({
        chains: [storyChain,coverChain,titleChain],
        inputVariables: ["content", "character","location"],
        // Here we return multiple variables
        outputVariables: ["story", "coverUrl","title"],
        verbose: true,
      });
      const chainExecutionResult = await overallChain.call({
        content: "an epic space battle",
        character: "a monkey with a yellow hat",
        location:"a space station",      
      });
      const story=formatData(chainExecutionResult.story)


      //--------------TEST CODE---------------------
      const content = formatData(chainExecutionResult.story)
      const paragraphs=formatPage(content,5)
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
          inputVariables: ["paragraph"],          
          outputVariables: ["imagePrompt","imageUrl"],
          verbose: true,
        });
        const chainExecutionResult = await overallChain.call({
          paragraph: paragraphs[i],           
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
  const {coverUrl,title,userId} = req.body
   const newStory= await Story.create({        
      updated_at: new Date(),
      created_at: new Date(),  
      title:title,
      coverUrl:coverUrl   ,
      userId:userId
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

const getPages = async(req,res)=>{
 
  const { storyId,page,size } = req.params;    
  const pages = await Page.findAndCountAll({where: { storyId: storyId }  ,order:["pageNumber"], limit: size,
      offset: page * size,});   
  res.json(pages)
}

 

module.exports = {
   
    createTest,
    getAllStory,
    createCover,
    createPage,
    getPages,
    
   
};
     
