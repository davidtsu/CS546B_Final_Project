const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();
	const barry = await users.addUser('barry@gmail.com', '$2a$16$i0l0O9ltA7ftK5QdX1DZ.eVq8DeGEAAhIscjFxbgHCie9GOmsmrbm', 'Barry', 'Berkman', 'Los Angeles', 'California');

	await db.serverConfig.close();
};

main().catch(console.log);
