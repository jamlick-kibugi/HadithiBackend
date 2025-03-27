const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = 3000
app.use(cors());
app.use(express.json()); 


// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://servicefiti.co.ke' , 'https://hadithi.co.ke'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }



const collabRouter =  require('./routers/collabRouter')
const storyRouter =  require('./routers/storyRouter')
const authRouter = require('./routers/authRouter')


app.use("/auth", authRouter)
app.use("/collab",collabRouter)
app.use("/story",storyRouter)

app.listen(port, () => {
  console.log(`Example app listening sson port ${port}`)
})
