const sampleCode = require('../seedData');

const  generic_desc = "Here is some generic seed data, this is supposed to be the description of the code, call it header text."

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Code').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Code').insert([
        {code_title: "Form Page",
         raw_code: sampleCode.formPage,
         description: generic_desc,
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 1},
        {code_title: "Landing Page",
         raw_code: sampleCode.landingPage,
         description: generic_desc,
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 1},
         {code_title: "Form Page",
         raw_code: sampleCode.formPage,
         description: generic_desc,
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 2},
        {code_title: "Form Page",
         raw_code: sampleCode.formPage,
         description: generic_desc,
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 3},
        {code_title: "Form Page",
         raw_code: sampleCode.formPage,
         description: generic_desc,
         date_code_created: "01/11/2021",
         date_code_changed: "01/22/2021",
         project: 4},
      ]);
    });
};
