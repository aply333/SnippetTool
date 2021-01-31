const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require("./authentication/auth_middleware");
const authRoute = require("./authentication/authRoutes");
const userRoutes = require("./registeredRoutes/userRoutes")
const helmet = require("helmet")
const cors = require("cors")

const server = express()
const port = process.env.port || 5000
const corsOptions = {

}

// Debug Logger:
function logger (req, res, next){
    console.log(`[${Date.now()}] ${req.method} at ${req.url}`);
    next();
}

// Middleware:
server.use(helmet())
server.use(cors())
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.use(logger)
server.use("/user", authRoute)
server.use("/at/:username", authenticate ,userRoutes)

server.get('/', (req, res) => {
    res.status(200).json({location:"Backend Root"})
})

server.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT: ${port}`)
})