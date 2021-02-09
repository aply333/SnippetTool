const db = require("../dbConfig");

module.exports = {
  queryUserProjects,
  queryProjectID,
  queryProjectCode,
  queryProjectMarker,
  queryProjectSnippets,
  queryProjectTags,
  insertNewProject,
  insertNewCode,
  insertNewMarker,
  insertNewSnippet
};

function genearteDate() {
  let today = new Date();
  let date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  return date;
}

// DB Models  Users <==> Projects ==> Code.
function queryUserProjects(user_id) {
  // FINDS ALL PROJECTS ATTACTHED TO A GIVEN ID
  const project_table = db("Projects").where("user", Number(user_id));
  return project_table;
}

async function insertNewProject(user_id, project_title) {
  // INSERT NEW PROJECT WITH ASSOCIATED USER.
  try {
    await db("Projects").insert({
      project_title: project_title,
      date_project_created: genearteDate(),
      date_project_changed: genearteDate(),
      user: Number(user_id),
    });
  } catch (err) {
    return { error: "internal sql error", details: err };
  }
  const new_table = await queryUserProjects(user_id);
  return new_table;
}

function queryProjectID(project_id) {
  // RETURNS ID OF USER ASSOCIATED TO GIVEN PROJECT.
  const ids = db("Projects")
    .select("user")
    .where("project_id", Number(project_id));
  return ids;
}

// DB Models for Code <==> Projects.
function queryProjectCode(project_id) {
  const code_table = db("Code").where("project", Number(project_id));
  return code_table;
}

async function insertNewCode(project_id, title, desc) {
  // INSERT NEW CODE PAGE TO A PROJECT IN THE CODE TABLE
  try {
    await db("Code").insert({
      code_title: title,
      raw_code: "#enter code here",
      description: desc,
      date_code_created: genearteDate(),
      date_code_changed: genearteDate(),
      project: Number(project_id),
    });
    const code_table = await queryProjectCode(project_id);
    return code_table;
  } catch (err) {
    return { error: "Internal SQL Error", details: err };
  }
}

// DB Models for Tags <==> Projects.
function queryProjectTags(project_id) {
  const tag_table = db("Tag").where("project", Number(project_id));
  return tag_table;
}

// DB Models for Marker <==> Code
function queryProjectMarker(code_id) {
  const marker_table = db("Marker")
    .innerJoin("Tag", "Marker.tag", "=", "Tag.tag_id")
    .where("code", Number(code_id));
  return marker_table;
}

async function insertNewMarker( marker_object) {
    // INSERT NEW MARKER TO MARKER TABLE.
    try{
        await db('Marker').insert({
            startRow: Number(marker_object.startRow),
            startCol: Number(marker_object.startCol),
            endRow: Number(marker_object.endRow),
            endCol: Number(marker_object.endCol),
            tag: Number(marker_object.tag_id),
            code: Number(marker_object.code_id),
            marker_date_created: genearteDate(),
            marker_date_changed: genearteDate()
        })
        const marker_table = await queryProjectMarker(marker)
        return marker_table
    }catch(err){
        return({error: "Internal SQL Error", details: err})
    }
}


// DB Models  Code <==> Snippets
function queryProjectSnippets(code_id) {
  const snippet_table = db("Snippet")
    .innerJoin("Tag", "Snippet.tag", "=", "Tag.tag_id")
    .where("code_reference", Number(code_id));
  return snippet_table;
}

async function insertNewSnippet( snippet_object, marker_id ){
    // INSERT NEW SNIPPET TO SNIPPET TABLE
    try{
        await db("Snippet").insert({
            snippet_title:snippet_object.title,
            snippet_data: snippet_object.description,
            tag: snippet_object.tag_id,
            marker_reference: marker_id,
            code_reference: snippet_object.code_id
        })
        const snippet_table = await queryProjectSnippets(snippet_object.code_id)
        return snippet_table
    }catch(err){
        return {error: "Internal SQL error.", details: err}
    }
}
