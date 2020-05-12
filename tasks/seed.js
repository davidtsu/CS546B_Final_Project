const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const uuid = require('uuid');
const users = data.users;
const games = data.games;
const comments = data.comments;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();
	const barry = await users.addUser('barry@gmail.com', '$2a$16$i0l0O9ltA7ftK5QdX1DZ.eVq8DeGEAAhIscjFxbgHCie9GOmsmrbm', 'Barry', 'Berkman', 'Los Angeles', 'California');

	const gameCheese = await games.addGame('cheese');

	const gameCheeseComment1 = await comments.addCommentToGame(gameCheese._id, barry._id, "This game sucks.");

	await db.serverConfig.close();
};

main().catch(console.log);
