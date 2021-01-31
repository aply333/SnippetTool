const express = require('express');
const router = express.Router();
const projects_table = require('../database/db-helpers/projectModels')

router
    .route("/projects")
    .get((req, res) => {
        res.send('At project Route')
    })

router
    .route("/projects/:user_id")
    .get(async (req, res)=>{
        try{
            const user_projects = await projects_table.queryUserProjects(req.params.user_id)
            res.status(200).json(user_projects)
        }catch{
            res.status(404).json({error: "Projects not found: Pre-Query."})
        }
        
    })

router
    .route("/projects/:user_id/:project_id")
    .get(async (req, res) => {
        const user_id = req.params.user_id
        const project_id = req.params.project_id
        try {
            const id_match = await projects_table.queryProjectID(project_id)
            const project_code = await projects_table.queryProjectCode(project_id)
            if(id_match[0].user === Number(user_id)){
              res.status(200).json(project_code)  
            }else{
              res.status(403).json({error : "Querying un authorized table."})
            }   
        } catch {
            res.status(404).json({error: "Code not founde: Pre-Query."})
        }
    })
module.exports = router;