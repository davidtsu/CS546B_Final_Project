const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userList = require('../users');

router.get('/', async (req, res) => {
	if (!req.session.user) {
		return res.render('login', {
            title: 'Hangman Login',
            layout: 'navnolinks'
		});
	} else {
		res.redirect('/dashboard');
	}
});


router.post('/login', async (req, res) => {
	// get req.body username and password
	const { username, password } = req.body;
	let user = {hashedPassword: ''}
	let userFound = false;

	for (x in userList) {
		if (userList[x].username === username) {
			user = userList[x];
			userFound = true;
		}
	}

	let match = await bcrypt.compare(password, user.hashedPassword);

	if (!userFound || !match) {
		res.status(401).render('login', {
			title: 'Login',
			error: 'Invalid username and/or password.'
		});
		return;
	}

	let userInfo = {
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		profession: user.profession,
		bio: user.bio,
	}
	
	req.session.user = userInfo;
	res.redirect('/private');
});

router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.render('logout', {
		title: 'Logged Out',
	})
});

module.exports = router;
