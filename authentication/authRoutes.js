"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const tokenGenerate = require("./tokenGenerate");
const userTable = require("../database/db-helpers/userModel");

function validUserData(user_data) {
  const hasEmail =
    typeof user_data.email == "string" && user_data.email.trim() != "";
  const hasUsername =
    typeof user_data.username == "string" && user_data.username.trim() != "";
  const hasName =
    typeof user_data.username == "string" && user_data.username.trim() != "";
  const hasKey = typeof user_data.key == "string" && user_data.key.trim() != "";
  const didAgree = user_data.didAgree === true;
  return hasEmail && hasUsername && hasName && hasKey && didAgree;
}

router.route("/login").post(async (req, res) => {
  try {
    const { email, key } = req.body;
    const user = await userTable.findUser(email);
    const keyCheck = await bcrypt.compare(key, user.key);
    if (user) {
      if (keyCheck) {
        const token = tokenGenerate(user);
        delete user.key
        res.status(200).json({ token: token, data: user });
      } else {
        res.status(401).json({ error: "invalid password" });
      }
    } else {
      res.json({ error: "User not found.", status: 404 });
    }
  } catch {
    res.json({ error: "Invalid input or user not found.", status: 404 });
  }
});

router.route("/register").post(async (req, res) => {
  let new_user = req.body;
  let hash = await bcrypt.hash(new_user.key, 12);
  new_user.key = hash;
  if (validUserData(new_user)) {
    try {
      const addedUser = await userTable.registerUser(new_user);
      res.status(201).json(addedUser);
    } catch (err) {
      console.log(`Register Error: ${err}`);
    }
  } else {
    res.send("Invalid User Post.");
  }
});

module.exports = router;
