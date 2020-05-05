const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
// const uuid = require('uuid');

let exportedMethods = {

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserById(id) {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (!user) throw 'User not found';
        return user;
    },

    async addUser(email, hashedPassword) {

        const userCollection = await users();

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            _id: uuid.v4()
        };

        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getUserById(newInsertInformation.insertedId);
    },

    async removeUser(id) {
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`;
        }
        return true;
    },

    async updateUser(id, firstName, lastName) {
        const user = await this.getUserById(id);
        console.log(user);

        const userUpdateInfo = {
            firstName: firstName,
            lastName: lastName
        };

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({ _id: id }, { $set: userUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return await this.getUserById(id);
    }
};

module.exports = exportedMethods;
