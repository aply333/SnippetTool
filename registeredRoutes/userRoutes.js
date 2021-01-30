const express = require('express');
const router = express.Router();

router
    .route("/projects")
    .get((req, res) => {
        res.send('At project Route')
    })

module.exports = router;