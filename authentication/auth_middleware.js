const jwt = require('jsonwebtoken')
const tokenSecret = require('./jwt_secret')

module.exports = (req, res, next) => {
    const token = req.headers.authorization
    if(token){
        jwt.verify(token, tokenSecret.jwt_secret, (err, decodedToken)=>{
            if(err){
                res.status(401).json({messege: "Authorization was not matched."})
            }else{
                req.decodedToken = decodedToken
                next()
            }
        })
    }else{
        res.status(401).json({ messege: "Please log-in."})
    }
}