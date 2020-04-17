const homeRoutes = require('./home');

const constructorMethod = (app) => {
	app.use('/', homeRoutes);

	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;
