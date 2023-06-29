const { initializeApp } = require('firebase/app')
const { getFirestore,getStorage } = require('firebase/storage')

const firebaseConfig = {
    apiKey: "AIzaSyAy9I5pm91w6GhBipWfRL4dsTBh1vpmEA4",
    authDomain: "storyb-b4216.firebaseapp.com",
    projectId: "storyb-b4216",
    storageBucket: "storyb-b4216.appspot.com",
    messagingSenderId: "749773466683",
    appId: "1:749773466683:web:2c4abeae27732a05af801e"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

 
module.exports = {  storage
    
   
};
