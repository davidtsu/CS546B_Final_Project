const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const uuid = require('uuid');
const users = data.users;
const games = data.games;
const comments = data.comments;
const dictionaries = data.dictionaries;



const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();

	// adding sample users
	const barry = await users.addUser('barry@gmail.com', '$2a$16$i0l0O9ltA7ftK5QdX1DZ.eVq8DeGEAAhIscjFxbgHCie9GOmsmrbm', 'Barry', 'Berkman', 'Los Angeles', 'California');

	const gameCheese = await games.addGame('cheese');

	const barryPlaysCheese = await games.addPlayer(gameCheese._id, barry._id);

	const barryLosesCheese = await users.addGameLost(barry._id, gameCheese._id);

	const gameCheeseComment1 = await comments.addCommentToGame(gameCheese._id, barry._id, "This game sucks.");



	// adding sample dictionaries
	const beach_dict = await dictionaries.addDictionary('Beach', ['sand', 'beach', 'surfing', 'waves', 'boardwalk', 'surfboard', 'shore', 'coast', 'sandbar']);
	const camping_dict = await dictionaries.addDictionary('Camping', ['backpack', 'fishing', 'campfire', 'forest', 'birds', 'animals', 'trees', 'waterfall']);
	const eu_dict = await dictionaries.addDictionary('European Countries', ['Russia', 'France', 'Italy', 'Germany', 'United Kingdom', 'Albania', 'Portugal',
		'Spain', 'Ukraine', 'Poland', 'Romania', 'Netherlands', 'Belgium', 'Greece',
		'Czech Republic', 'Sweden', 'Hungary', 'Belarus', 'Austria', 'Serbia', 'Switzerland',
		'Bulgaria', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Moldova']);
	// there are definitely more, but I figured I should make at least one large list


	await db.serverConfig.close();


};

main().catch(console.log);
