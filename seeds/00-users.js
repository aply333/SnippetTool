
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Users').insert([
        {user_email: "testUser01@test.com",
         username: "testUser01"},
        {user_email: "testUser02@test.com",
         username: "testUser02"},
        {user_email: "testUser03@test.com",
         username: "testUser03"}
      ]);
    });
};
