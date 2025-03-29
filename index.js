const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = 3000;

// Allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://servicefiti.co.ke'];

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl requests, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const collabRouter = require('./routers/collabRouter');
const storyRouter = require('./routers/storyRouter');
const authRouter = require('./routers/authRouter');

app.use("/auth", authRouter);
app.use("/collab", collabRouter);
app.use("/story", storyRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
