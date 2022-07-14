const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    "name": {type:String, required:true, minLength: 3, maxLength: 200},
    author: String,
    priority: String,
    uid: String,
    isComplete: Boolean,
    "date": {type: Date, default:new Date()},
    "dateDue" : {type: Date, required:true}
})

const Todo = mongoose.model('Todo',todoSchema)

// exports.Todo = Todo  
module.exports = Todo 