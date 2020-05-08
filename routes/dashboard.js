const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => { 
  res.render('home', {
    title: 'Hangman Home',
  });
});

/* GET high scores page. */
router.get('/highscores', async (req, res, next) => { 
  res.render('highscores', {
    title: 'Hangman High Scores',
  });
});

/* GET profile page. */
router.get('/profile', async (req, res, next) => { 
  res.render('profile', {
    title: 'Hangman User Profile',
  });
});

router.get('/game', async (req, res, next) => { 
  res.render('game', {
    title: 'Hangman game',
  });
});

module.exports = router;
