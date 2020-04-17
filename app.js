const express = require('express');
const exphbs = require('express-handlebars');

// Initialize App
const app = express();


// Set Static Public Folder
const static = express.static(__dirname + '/public');
app.use('/public', static);

// Include Bootstrap from node_modules (You don't want to expose the whole node_modules folder)
const bootstrap = express.static(__dirname + '/node_modules/bootstrap');
app.use('/bootstrap', bootstrap);

// Include jQuery from node_modules
const jquery = express.static(__dirname + '/node_modules/jquery');
app.use('/jquery', jquery);


// Configure Routing from ./routes
const configRoutes = require('./routes');
configRoutes(app);


// Middleware to Recognize JSON in Requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// View Engine Setup: Handlebars (extension .hbs instead of .handlebars)
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');


app.listen(3000, () => {
	console.log("Server running.");
	console.log('Routes will be running on http://localhost:3000');
});
