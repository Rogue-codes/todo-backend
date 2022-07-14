const joi = require('joi')
const express = require('express')
const User = require('../model/user')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// creating a new user (this is a post request)
router.post('/', async (req, res) => {
    // using joi to validate the request from the client side
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().min(3).max(30).required().email(),
        password: joi.string().min(3).max(200).required()
    })

    try{
        const {error} = schema.validate(req.body)

        if(error) return res.status(400).send(error.details[0].message)
    
        // checking to see if a user already exists
        let users = await User.findOne({email: req.body.email})
    
        if(users) return res.status(400).send('user with this email already exist')

        // creating a new user in our DB
        users = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        // hashing our password soo it will be encrypted in our DB

        const salt = await bcrypt.genSalt(10)

        users.password = await bcrypt.hash(users.password, salt) 

        // saving new users to the DB
        await users.save()

        const secretKey = process.env.SECRET_KEY

        const Token = jwt.sign({
            _id: users._id,
            name: users.name,
            password: users.password
        }, secretKey) 

        res.send(Token)

        res.send('user registration sucessful')

    }catch(err){
        res.status(500).send(error.message)
        console.log(error.message)
    }
    
})

module.exports = router