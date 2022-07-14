const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(400).send('not authorised...')

    try{
        const secretKey = process.env.SECRET_KEY
        const payload = jwt.verify(token, secretKey)

        req.user = payload
        next()
    }catch(err){
        res.status(400).send("Invalid token")
        console.log(err.message)
    }
}

module.exports = auth