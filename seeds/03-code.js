
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Code').del()
    .then(function () {
      // Inserts seed entries
      return knex('Code').insert([
        {code_title: "Form Page",
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 1},
        {code_title: "Landing Page",
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 1},
         {code_title: "Form Page",
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 2},
        {code_title: "Form Page",
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 3},
        {code_title: "Form Page",
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 4},
      ]);
    });
};
