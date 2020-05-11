const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid');

let exportedMethods = {

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserByEmail(email) {
        if (!email) throw new Error('You must provide an email');
        if (typeof email != 'string') throw new TypeError('Email must be a string');

        email = email.toLowerCase();

        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });

        if (!user) throw new Error(`User with email of ${email} not found`);

        return user
    },

    async getUserById(id) {
        if (!id) throw new Error('You must provide an id');

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });

        if (!user) throw new Error(`User with id of ${id} not found`);

        return user;
    },

    async addUser(email, hashedPassword) {
        if (!email) throw new Error('You must provide an email');
        if (!hashedPassword) throw new Error('You must provide an hashed password');

        if (typeof email != 'string') throw new TypeError('Email must be a string');
        if (typeof hashedPassword != 'string') throw new TypeError('Hashed password must be a string');

        email = email.toLowerCase()

        let emailExists;
        try {
            const user = await this.getUserByEmail(email);
            emailExists = true;
        } catch (err) {
            emailExists = false;
        }

        if (emailExists) throw new Error('Email already registered');

        let newUser = {
            email: email,
            hashedPassword: hashedPassword,
            _id: uuid.v4()
        };

        const userCollection = await users();
        const newInsertInformation = await userCollection.insertOne(newUser);

        if (newInsertInformation.insertedCount === 0) throw new Error('Insert failed!');

        return await this.getUserById(newInsertInformation.insertedId);
    },

    async removeUser(id) {
        if (!id) throw new Error('You must provide an id');

        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete user with id of ${id}`);
        }

        return true;
    },

    async updateUser(id, email, hashedPassword) {
        if (!id) throw new Error('You must provide an id');
        if (!email) throw new Error('You must provide an email');
        if (!hashedPassword) throw new Error('You must provide an hashed password');

        if (typeof email != 'string' || email.length === 0) throw new TypeError('Email must be a string');
        if (typeof hashedPassword != 'string' || hashedPassword.length === 0) throw new TypeError('Hashed password must be a string');

        const user = await this.getUserById(id);
        console.log(user);

        const userUpdateInfo = {
            email: email.toLowerCase(),
            hashedPassword: hashedPassword
        };

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({ _id: id }, { $set: userUpdateInfo });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw new Error('Update failed');

        return await this.getUserById(id);
    }
};

module.exports = exportedMethods;
