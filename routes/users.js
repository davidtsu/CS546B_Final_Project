const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 5;
//const userList = require('../users'); 

// Data from mongo collection for users
const data = require('../data');
const userData = data.users;

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
	let { username, password } = req.body;
	let user = {hashedPassword: ''}
    let userFound = await userData.findOne({email: req.body.email})

	let match = await bcrypt.compare(password, user.hashedPassword);

	if (!userFound || !match) {
		res.status(401).render('login', {
			title: 'Login',
			error: 'Invalid username and/or password.'
		});
		return;
	}

	let userInfo = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email
	}
	
	req.session.user = userInfo;
	res.redirect('/dashboard');
});

router.get("/signup", (req, res) => {
    res.render("signup")
  });

router.post("/signup", async (req, res) => {
	let userInfo = req.body;
	if(!userInfo) {
		res.status(400).json({ error: 'You must provide data to create a new user' });
		return;
	}
	if (!userInfo.firstName) {
		res.status(400).json({ error: 'You must provide your first name' });
		return;
	}
	if (!userInfo.lastName) {
		res.status(400).json({ error: 'You must provide your last name' });
		return;
	}
    if (!userInfo.email) {
		res.status(400).json({ error: 'You must provide an email' });
		return;
	}
	if (!userInfo.password) {
		res.status(400).json({ error: 'You must provide a password' });
		return;
	}
	try {
		let user = await userData.getUserByName(userInfo.email);
    	if (user) {
       		return res.status(400).send('User already exisits!');
    	} else {
			const hashedPassword = await bcrypt.hash(userInfo.password, saltRounds);
			const newUser = await userData.addUser(userInfo.firstName, userInfo.lastName, userInfo.email, userInfo.hashedPassword);
			if (newUser) {
				res.redirect('/');

			} else {
				res.redner('/signup', {send : "Unable to create user, please try again"});
				return;
			}
		}

	} catch (e) {
		res.status(500).json({"error": e.message});
	}
});




router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.render('logout', {
		title: 'Logged Out',
	})
});

module.exports = router;
