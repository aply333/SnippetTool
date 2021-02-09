const bcrypt = require('bcryptjs');

const testKey1 = bcrypt.hashSync("testKey1", 12)
const testKey2 = bcrypt.hashSync("testKey2", 12)
const testKey3 = bcrypt.hashSync("testKey3", 12)

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('Users').insert([
        {user_email: "testUser01@test.com",
         username: "testUser01",
         name: "jake",
         key: testKey1,
         didAgree: true},
        {user_email: "testUser02@test.com",
         username: "testUser02",
         name: "ryan",
         key: testKey2,
         didAgree: true},
        {user_email: "testUser03@test.com",
         username: "testUser03",
         name: "steven",
         key: testKey3,
         didAgree: true}
      ]);
    });
};
