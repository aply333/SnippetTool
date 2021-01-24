
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Projects').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Projects').insert([
        {project_title: "Test Project One",
         date_project_created: "01/11/2021",
         date_project_changed: "01/22/2021",
         user: 1,},
         {project_title: "Test Project Two",
         date_project_created: "01/11/2021",
         date_project_changed: "01/22/2021",
         user: 1,},
         {project_title: "Test Project One",
         date_project_created: "01/11/2021",
         date_project_changed: "01/22/2021",
         user: 2,},
         {project_title: "Test Project One",
         date_project_created: "01/11/2021",
         date_project_changed: "01/22/2021",
         user: 3,},
        ]);
    });
};
