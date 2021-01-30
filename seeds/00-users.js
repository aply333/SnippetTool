
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Users').insert([
        {user_email: "testUser01@test.com",
         username: "testUser01",
         name: "jake",
         key: "testPass1",
         didAgree: true},
        {user_email: "testUser02@test.com",
         username: "testUser02",
         name: "ryan",
         key: "testPass2",
         didAgree: true},
        {user_email: "testUser03@test.com",
         username: "testUser03",
         name: "steven",
         key: "testPass3",
         didAgree: true}
      ]);
    });
};
