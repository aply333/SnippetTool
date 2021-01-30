const db = require("../dbConfig");

module.exports = {
  findUser,
  registerUser,
};

 function findUser(email) {
    const user =  db("Users")
                    .first('*')
                    .where("user_email", email);
      return user  
  
}

async function registerUser(new_user) {
  try {
    await db("Users").insert({
      user_email: new_user.email,
      username: new_user.username,
      name: new_user.name,
      key: new_user.key,
      didAgree: new_user.didAgree,
    });
  } catch {
    return { ERROR: "User already registered.", STATUS: 409 };
  }
  return findUser(new_user.email);
}
