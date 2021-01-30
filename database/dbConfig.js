const knex = require('knex')
const knexFile = require("../knexfile");
const evironment = "development"

module.exports = knex(knexFile[evironment])