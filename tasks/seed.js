const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();
	// const patrick = await users.addUser('Patrick', 'Hill');
	// const id = patrick._id;
	// const firstPost = await posts.addPost('Hello, class!', 'Today we are creating a blog!', id);
	// const second = await posts.addPost(
	// 	'Using the seed',
	// 	'We use the seed to have some initial data so we can just focus on servers this week',
	// 	id
	// );
	// const third = await posts.addPost('Using routes', 'The purpose of today is to simply look at some GET routes', id);
	// console.log('Done seeding database');
	// await users.updateUser(patrick._id, 'John', 'Doe');
	const user1 = await users.addUser('harry@gmail.com', '$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK')
	await db.serverConfig.close();
};

main().catch(console.log);


// FIX THIS STUFF