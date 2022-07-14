// importing our dependencies
const todo = require('./routes/todos')
const signUp = require('../back-end/routes/signUp')
const signIn = require('../back-end/routes/signIn')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
require('dotenv').config()

// initializing cors middleware
app.use(cors());

// initailizing JSON
app.use(express.json())


// our todo endpoint
app.use('/api/todos', todo)

// our signUp endpoint
app.use('/api/signup', signUp)

// our signIn endpoint
app.use('/api/signin', signIn)

// initializing our default API route
app.get('/', (req, res) => {
    res.send('welcome to home page')
})

// getting our connection string from our .env file
const conectionString = process.env.CONNECTION_STRING

const port = process.env.PORT || 5000
// initializing our application to run on port 5000
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`)
})

// using mongoose to connect to our MongoDB database
mongoose.connect(conectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('MongoDB connection is established')
})
.catch((err) => {
    console.log('An error occured:', err.message)
})