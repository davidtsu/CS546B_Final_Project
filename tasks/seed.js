const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();
	const barry = await users.addUser('barry@gmail.com', '$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK');

	await db.serverConfig.close();
};

main().catch(console.log);
