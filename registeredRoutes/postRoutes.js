const express = require("express");
const router = express.Router();
const project_table = require("../database/db-helpers/projectModels");

// POSTS NEW PROJECTS
router.route("/projects/:user_id").post(async (req, res) => {
  const { project_title } = req.body;
  const user_id = req.params.user_id;
  try {
    const new_table = await project_table.insertNewProject(
      user_id,
      project_title
    );
    res.status(201).json(new_table);
  } catch (err) {
    res.status(400).json({ error: "Failed to post.", details: err });
  }
});

// POST NEW CODE PAGES
router.route("/code/:project_id").post(async (req, res) => {
  const { title, description } = req.body;
  const project_id = req.params.project_id;
  try {
    const new_table = await project_table.insertNewCode(
      project_id,
      title,
      description
    );
    res.status(201).json(new_table);
  } catch (err) {
    res.status(400).json({ error: "Route Error", details: err });
  }
});

// POST NEW SNIPPETS && MARKERS. this will need to handl markers and snippets
router.route("/snippet").post(async (req, res) => {
  const { marker_object, snippet_object } = req.body;
  try {
    const marker_table = await project_table.insertNewMarker(marker_object);
    const snippet_table = await project_table.insertNewSnippet(
      snippet_object,
      marker_table.marker_id
    );
    res.status(201).json({makers: marker_table, snippets: snippet_table})
  } catch (err) {
    res.status(400).json({ error: "Route Error", details: err });
  }
});
module.exports = router;
