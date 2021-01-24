const express = require('express');
const port = 5000
const server = express()

server.get('/', (req, res) => {
    res.send("Backend Root")
})

server.listen(port)