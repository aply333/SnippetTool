const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require("./authentication/auth_middleware");
const authRoute = require("./authentication/authRoutes");
const userRoutes = require("./registeredRoutes/userRoutes")

const server = express()
const port = process.env.port || 5000

// Middleware:
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.use("/user", authRoute)
server.use("/:username", authenticate ,userRoutes)

server.get('/', (req, res) => {
    res.status(200).json({location:"Backend Root"})
})

server.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT: ${port}`)
})