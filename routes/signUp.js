const joi = require('joi')
const bcrypt = require('bcrypt')
const express = require('express')
const User = require('../model/user')
const genAuthToken = require('./utils/authToken')

const router = express.Router()

router.post('/', async (req, res) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().min(3).max(50).required().email(),
        password: joi.string().min(6).max(250).required(),
    })

    const {error} = schema.validate(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email:req.body.email})

    if(user)return res.status(400).send('this user already exists')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    user = await user.save()

    const token = genAuthToken(user)

    res.status(200).send(token)
})

module.exports = router