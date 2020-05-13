const express = require('express');
const router = express.Router();
const data = require("../data");
const games = data.games;
const dictionaries = data.dictionaries;
const users = data.users;


/* GET home page. */
router.get('/', async (req, res, next) => {
  const currentUser = req.session.user;

  const userGames = await users.getGamesPlayed(currentUser._id);

  const allDict = await dictionaries.getAllDictionaries();
  const allGames = await games.getAllGames();

  for (g of allGames) {
    if (g.latestPlayerId) { 
      let latestPlayer = await users.getUserById(g.latestPlayerId);
      g.latestPlayer = latestPlayer;
    }
  }

  res.render('home', {
    title: 'Hangman Home',
    user: currentUser,
    userGames: userGames,
    allDictionaries: allDict,
    allGames: allGames
  });
});

/* GET high scores page. */
router.get('/highscores', async (req, res, next) => {
  res.render('highscores', {
    title: 'Hangman High Scores',
    user: req.session.user
  });
});

/* GET profile page. */

router.get('/profile', async (req, res, next) => { 
  let totalGames = req.session.user.gamesWonIDs.length + req.session.user.gamesLostIDs.length;
  let winPercentage = 0;
  if (totalGames != 0) {
    winPercentage = (req.session.user.gamesWonIDs.length / totalGames) * 100;
  }
  let recentGames = await games.getMostRecentID(req.session.user);
  console.log("Recent Games");
  console.log(recentGames);

  res.render('profile', {
    title: 'Hangman User Profile',
    user: req.session.user,
    win: winPercentage,
    total: totalGames,
    recentGames: recentGames
  });
});

/* GET profile page for other users */
router.get('/profile/:id', async (req, res, next) => { 
  let user = await users.getUserById(req.params.id);
  let totalGames = user.gamesWonIDs.length + user.gamesLostIDs.length;
  if (totalGames != 0) {
    winPercentage = user.gamesWonIDs.length / totalGames;
  }
  res.render('profile', {
    title: 'Hangman User Profile',
    user: user,
    win: winPercentage,
    total: totalGames
  });
});


/* GET game page. */
router.get('/game', async (req, res, next) => {
  res.render('game', {
    title: 'Hangman Game',
    user: req.session.user
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
