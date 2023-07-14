const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = 3000
app.use(cors());
app.use(express.json()); 
const collabRouter =  require('./routers/collabRouter')
const storyRouter =  require('./routers/storyRouter')
const authRouter = require('./routers/authRouter')


app.use("/auth", authRouter)
app.use("/collab",collabRouter)
app.use("/story",storyRouter)

app.listen(port, () => {
  console.log(`Example app listening sson port ${port}`)
})