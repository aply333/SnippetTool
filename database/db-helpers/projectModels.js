const db = require("../dbConfig")

module.exports = {
    queryUserProjects,
    queryProjectID,
    queryProjectCode,
}

// DB Models  Projects_Tables <==> Users.
function queryUserProjects(user_id){
    const project_table = db("Projects").where("user", Number(user_id))
    return project_table
}

function queryProjectID(project_id){
    const ids = db("Projects").select('user').where("project_id", Number(project_id))
    return ids 
}


// DB Models for Code <==> Projects.
 function queryProjectCode(project_id){
    const code_table = db("Code").where("project", Number(project_id))
    return code_table
}