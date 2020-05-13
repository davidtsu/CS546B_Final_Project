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
  res.render('profile', {
    title: 'Hangman User Profile',
    user: req.session.user
  });
});

/* GET profile page for other users */
router.get('/profile/:id', async (req, res, next) => { 
  let user = await users.getUserById(req.params.id);
  res.render('profile', {
    title: 'Hangman User Profile',
    user: user
  });
});


/* GET game page. */
router.get('/game', async (req, res, next) => {
  const gameId = (req.query['gameId']) ? req.query['gameId'] : '';
  let word = ''
  if (gameId) {
    g = await games.getGameById(gameId);
    word = g['word'];
  }

  const themeId = (req.query['themeId']) ? req.query['themeId'] : '';
  if (req.query['themeId']) {
    t = await dictionaries.getDictionaryById(themeId)
    word = t.words[Math.floor(Math.random() * t.words.length)]
  }

  if (word.length === 0 || !word) {
    res.redirect('/dashboard');
    return;
  }

  const game = await games.getGameByWord(word.toUpperCase());

  res.render('game', {
    title: 'Hangman Game',
    user: req.session.user,
    gameId: game._id,
    word: word,
  });
});

router.post('/game', async (req, res, next) => {
  //Figure out how to pass these 3 parameters to this POST function
  const currentUserID = req.session.user._id;
  const currentGameID = req.body.gameId;
  const gameWon = req.body.gameWon;

  await games.addPlayer(currentGameID, currentUserID);

  if (gameWon) {
    await users.addGameWonID(currentUserID, currentGameID);
  } else {
    await users.addGameLostID(currentUserID, currentGameID);
  }

  // Need to update the current user after game submission

  const user = await users.getUserById(currentUserID);

  let userInfo = {
		_id: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		city: user.city,
		state: user.state,
		gamesPlayedIDs: user.gamesPlayedIDs,
		gamesWonIDs: user.gamesWonIDs,
		gamesLostIDs: user.gamesLostIDs
	}
	
	req.session.user = userInfo;

  res.redirect(`/dashboard/comments/${currentGameID}`);

});


// TODO: eventually remove this
router.get('/comments', async (req, res, next) => {
  res.render('comments', {
    title: 'Game Log'
  });
});

/* GET comments for a game. */
// TODO: switch to :id, should be specific to comment
router.get('/comments/:id', async (req, res, next) => {
  let game = await games.getGameById(req.params.id);
  res.render('comments', {
    title: 'Game Log'
  });
});

module.exports = router;
