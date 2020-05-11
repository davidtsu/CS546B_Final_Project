const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require("../data");
const users = data.users;

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
	let { email, password } = req.body;
	
	let user, userFound, match;

	try {
		user = await users.getUserByEmail(email);
		userFound = true;
		match = await bcrypt.compare(password, user.hashedPassword);
	} catch (err) {
		console.log(err);
		userFound = false;
	}


	if (!userFound || !match) {
		res.status(401).render('login', {
			title: 'Login',
			error: 'Invalid username and/or password.',
			layout: 'navnolinks'
		});
		return;
	}

	let userInfo = {
		email: user.email,
		// username: user.username,
		// firstName: user.firstName,
		// lastName: user.lastName,
		// profession: user.profession,
		// bio: user.bio,
	}
	
	req.session.user = userInfo;
	res.redirect('/dashboard');
});

router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.render('logout', {
		title: 'Logged Out',
		layout: 'navnolinks'
	})
});

module.exports = router;
