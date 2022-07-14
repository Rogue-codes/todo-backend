const joi = require('joi');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const router = express.Router()

// sending a post request to sign our users In
router.post('/', async (req, res) => {
    // client validation with joi
    const schema = joi.object({ 
        email: joi.string().min(3).max(30).required().email(),
        password: joi.string().min(3).max(200).required()
    })

    try{
        const {error} = schema.validate(req.body)

        if (error) return res.status(200).send(error.details[0].message)

        const user = await User.findOne({email: req.body.email})

        // checking if user email exist in the DB
        if(!user) return res.status(404).send("Invalid  E-mail or Password")

        const hiddenPassword = await bcrypt.compare(req.body.password, user.password)

        // checking if user password is valid
        if(!hiddenPassword) return res.status(404).send("Invalid  E-mail or Password")

        const secretKey = process.env.SECRET_KEY

        // using JWT to generate a token
        const Token = jwt.sign({
            _id : user._id,
            name: user.name,
            email: user.email
        }, secretKey)

        // sending the token to the client
        res.send(Token)
    }catch(err) {
        res.status(500).send(err.message)
        console.log(err.message)
    }
})

module.exports = router