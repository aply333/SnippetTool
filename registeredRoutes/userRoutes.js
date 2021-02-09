const express = require("express");
const router = express.Router();
const projects_table = require("../database/db-helpers/projectModels");

// Errors
const res403_unAuth = "Querying un authorized table."
const res404_Pre_Fail = "Code not founde: Pre-Query."


router.route("/projects").get((req, res) => {
  res.send("At project Route");
});

// ROUTE TO USER'S PROJECTS.
router.route("/projects/:user_id")
  .get(async (req, res) => {
  try {
    const user_projects = await projects_table.queryUserProjects(
      req.params.user_id
    );
    res.status(200).json(user_projects);
  } catch {
    res.status(404).json({ error: "Projects not found: Pre-Query." });
  }
});

// ROUTE TO USERS CODE FOR A GIVEN PROJECT, WITH USER CHECK.
router.route("/projects/:user_id/:project_id")
  .get(async (req, res) => {
  const user_id = req.params.user_id;
  const project_id = req.params.project_id;
  try {
    const id_match = await projects_table.queryProjectID(project_id);
    const project_code = await projects_table.queryProjectCode(project_id);
    if (id_match[0].user === Number(user_id)) {
      res.status(200).json(project_code);
    } else {
      res.status(403).json({ error: res403_unAuth });
    }
  } catch {
    res.status(404).json({ error: res404_Pre_Fail });
  }
});

// ROUTE TO RELATIVE TAGS OF A GIVEN PROJECT.
router.route("/projects/:user_id/tags/:project_id")
  .get(async (req, res) => {
    const project_id = req.params.project_id
    try{
      const tag_table = await projects_table.queryProjectTags(project_id)
      res.status(200).json(tag_table)
    } catch {
      res.status(404).json({error: res404_Pre_Fail})
    }
  })

// GET CODE MARKERS, WITH USER CHECK
router.route("/projects/:user_id/:project_id/marker/:code_id")
  .get(async(req, res) =>{
    const user_id = req.params.user_id
    const project_id = req.params.project_id
    const code_id = req.params.code_id
    try{
      const id_match = await projects_table.queryProjectID(project_id)
      const marker_table = await projects_table.queryProjectMarker(code_id)
      if(id_match[0].user === Number(user_id)){
        res.status(200).json(marker_table)
      }else{
        res.status(403).json({error: res403_unAuth})
      }
    } catch {
      res.status(404).json({error: res404_Pre_Fail, location: "code get"})
    }
  })

router.route("/projects/:user_id/:project_id/snippet/:code_id")
  .get(async(req, res) =>{
    const user_id = req.params.user_id
    const project_id = req.params.project_id
    const code_id = req.params.code_id
    try{
      const id_match = await projects_table.queryProjectID(project_id)
      const snippet_table = await projects_table.queryProjectSnippets(code_id)
      if(id_match[0].user === Number(user_id)){
        res.status(200).json(snippet_table)
      }else{
        res.status(403).json({error: res403_unAuth})
      }
    } catch {
      res.status(404).json({error: res404_Pre_Fail, location: "snippet get"})
    }
  })


module.exports = router;
