
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Tag').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Tag').insert([
        {tag_text: "HTML", color: "#062982"},
        {tag_text: "NodeJs", color: "#027700"},
        {color: "#820606"}
      ]);
    });
};
