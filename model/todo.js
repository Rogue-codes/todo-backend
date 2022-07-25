// const { date } = require('joi');
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    "name": {type:String, required:true, minLength: 3, maxLength: 200},
    author: String,
    priority: String,
    uid: String,
    isComplete: Boolean,
    "date": {type: String, default:new Date().toLocaleString().split(',')[0]},
    dateDue : String,
})

const Todo = mongoose.model('Todo',todoSchema)

// exports.Todo = Todo  
module.exports = Todo 