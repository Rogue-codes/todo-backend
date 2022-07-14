const mongoose = require('mongoose')

// creating our userSchema
const UserSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
        minLength: 3,
        maxLength:200
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
        minLength: 3,
        maxLength:200
    },
    password: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength:1024
    }
})

// creating our user model
const User = mongoose.model('User', UserSchema)

// exporting the user model
module.exports = User