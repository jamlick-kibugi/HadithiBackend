 

const { uploadBytes, getDownloadURL, ref   } =require( "firebase/storage");
const { storage } = require("../firebase");
    
    function saveFile(url) {
        let outputUrl = ""
        // Get file name from url.
         const filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
         console.log(filename)
         var xhr = new XMLHttpRequest();
         xhr.open('GET', url, true);
         xhr.responseType = 'blob';
         xhr.onload = function(e) {
           if (this.status == 200) {
             var myBlob = this.response;
             console.log(myBlob)
             const storageRef = ref(storage, `images/${filename}`);  
    
             uploadBytes(storageRef, myBlob)
             .then((snapshot) => {
               console.log("submitted")
               return getDownloadURL(snapshot.ref);
               
               
             }).then((url)=>{
                console.log(url)
                outputUrl = url
             })
             // myBlob is now the blob that the object URL pointed to.
           }
         };
         xhr.send();
         return filename
    }
  module.exports = {
   
   saveFile
      
     
  };
       