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

/* GET game page. */
router.get('/game', async (req, res, next) => { 
  res.render('game', {
    title: 'Hangman game',
  });
});

/* GET comments for a game. */
// TODO: switch to :id, should be specific to comment
router.get('/comments', async (req, res, next) => {
  res.render('comments', {
    title: 'Game Log'
  });
});

module.exports = router;
