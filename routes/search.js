const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require("../data");
const users = data.users;



router.get('/', async (req, res) => {
  try {
  let search = req.query['searchUser'];
  let searchUserList = await users.searchUser(search);
  res.render('search', {searchUserList});
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;