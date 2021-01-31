const jwt = require('jsonwebtoken')
const tokenSecret = require('./jwt_secret')

module.exports = tokenGenerate;

 function tokenGenerate(user){
    const payload = {
        subject: user.user_id,
        username: user.username
    }
    const secret = tokenSecret.jwt_secret;
    const options = {
        expiresIn: '2h'
    }
    token = jwt.sign(payload, secret, options)
    return token
}