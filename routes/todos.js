const Todo = require('../model/todo')
const auth = require('../middleware/auth')
const express = require('express')
const joi = require('joi')

// creating a mini application
const router = express.Router()

// handling a get request
router.get('/',  async (req, res) => {
    try{
        const todos = await Todo.find().sort({date: -1})
        res.send(todos)
    }
    catch(err) {
        res.status(500).send(err.message)
        console.log(err.message)
    }

})
// send a post request to the DB.
router.post('/', async (req,res) => {
    const Schema = joi.object({
        name: joi.string().min(3).max(200).required(),
        author: joi.string().min(3).max(200),
        priority: joi.string(),
        uid: joi.string(),
        isComplete: joi.boolean(),
        date: joi.string(),
        dateDue: joi.string()
    })

    const {error} = Schema.validate(req.body)

    if(error) return res.status(400).send(error.details[0].message)
    
    let todo = new Todo({
        name: req.body.name,
        uid: req.body.uid,
        isComplete: req.body.isComplete,
        date: req.body.date,
        priority: req.body.priority,
        dateDue: req.body.dateDue,
        author : req.body.author
    })

    try{
        // saving todo in our DB
        todo = await todo.save()

        // sending todo to the client side 
        res.send(todo)
    }
    catch(error){
        res.status(500).send(error.message)
        console.log(error.message)
    }
})

// handling edit request
router.put('/:id', async (req, res) => {
    // using joi to validate our new entry
    const Schema = joi.object({
        name: joi.string().min(3).max(200).required(),
        author: joi.string().min(3).max(30).required(),
        priority: joi.string(),
        uid: joi.string(),
        isComplete: joi.boolean(),
        date: joi.date(),
    })

    // using joi to validate our request body before sending to the client side
    const {error} = Schema.validate(req.body)

    // if there's an error in the joi schema, return the error from joi to the client
    if(error) return res.status(400).send(error.details[0].message)

    try{    
        const todo = await Todo.findById(req.params.id)
    
        if(!todo) return res.status(404).send('Todo does not exist')
        
        // updating the old task with a new one 
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            uid: req.body.uid,
            isComplete: req.body.isComplete,
            priority: req.body.priority,
            date: req.body.date,
            author : req.body.author,
        },{new: true})
    
        // sending the new task to the client
        res.send(updatedTodo)
    }catch(err){
        res.status(500).send(err.message)
        console.log(err.message)
    }
})

// edit a particular item
router.patch('/:id', async(req, res) => {
    try{
        const todo = await Todo.findById(req.params.id)
    
        if(!todo) return res.status(404).send('Todo does not exist')

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id,{
            isComplete : !todo.isComplete
        },{new:true})

        res.send(updatedTodo)
    }catch(err){
        res.status(500).send(err.message)
        console.log(err.message)
    }
})

// handling delete request
router.delete('/:id', async (req, res) => {
    try{
        const todo = await Todo.findById(req.params.id)
    
        if(!todo) return res.status(404).send('Todo does not exist')

        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)
        res.send(deletedTodo)
    }catch(err){
        res.status(500).send(err.message)
        console.log(err.message)
    }
})

module.exports = router