const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => { 
  res.render('home', {
    title: 'Hangman Home Page',
  });
});

module.exports = router;
