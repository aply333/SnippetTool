
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Tag').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Tag').insert([
        {tag_text: "HTML", color: "yellow", project: 1, hex:"#FFD700"},
        {tag_text: "NodeJs", color: "lightblue", project: 1, hex:"#A4DDEE"},
        {color: "lavender", project: 1, hex: "#E7D46A"},
        {tag_text: "HTML", color: "yellow", project: 2, hex:"#FFD700"},
        {tag_text: "NodeJs", color: "lightblue", project: 2, hex:"#A4DDEE"},
        {color: "lavender", project: 2, hex: "#E7D46A"},
        {tag_text: "HTML", color: "yellow", project: 3, hex:"#FFD700"},
        {tag_text: "NodeJs", color: "lightblue", project: 3, hex:"#A4DDEE"},
        {color: "lavender", project: 3, hex: "#E7D46A"}
      ]);
    });
};
