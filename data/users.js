const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid');
const games = require('./games');

let exportedMethods = {

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async getUserByEmail(email) {
        if (!email) throw new Error('You must provide an email');
        if (typeof email != 'string') throw new TypeError('email must be a string');

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

    async getGamesPlayed(id) {
        if (!id) throw new Error('You must provide an id');

        const user = await this.getUserById(id);


        gamesPlayedIDs = user.gamesPlayedIDs;

        gamesPlayed = [];

        for (id of gamesPlayedIDs) {
            let g = await games.getGameById(id);
            gamesPlayed.push(g);
        }

        return gamesPlayed;
    },

    async addUser(email, hashedPassword, firstName, lastName, city, state) {
        if (!email) throw new Error('You must provide an email');
        if (!hashedPassword) throw new Error('You must provide a hashed password');
        if (!firstName) throw new Error('You must provide a first name');
        if (!lastName) throw new Error('You must provide a last name');
        if (!city) throw new Error('You must provide a city');
        if (!state) throw new Error('You must provide a state');

        if (typeof email != 'string') throw new TypeError('email must be a string');
        if (typeof hashedPassword != 'string') throw new TypeError('hashedPassword must be a string');
        if (typeof firstName != 'string') throw new TypeError('firstName must be a string');
        if (typeof lastName != 'string') throw new TypeError('lastName must be a string');
        if (typeof city != 'string') throw new TypeError('city must be a string');
        if (typeof state != 'string') throw new TypeError('state must be a string');

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
            _id: uuid.v4(),
            email: email,
            hashedPassword: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            city: city,
            state: state,
            gamesPlayedIDs: [],
            gamesWonIDs: [],
            gamesLostIDs: []
        };

        const userCollection = await users();
        const newInsertInformation = await userCollection.insertOne(newUser);

        if (newInsertInformation.insertedCount === 0) throw new Error('Insert failed!');

        return await this.getUserById(newInsertInformation.insertedId);
    },

    async addGameWonID(userId, gameId) {
        if (!userId) throw new Error('You must provide a userId');
        if (!gameId) throw new Error('You must provide a gameId');

        const user = await this.getUserById(userId);

        let userGamesWon = user.gamesWonIDs;
        let userGamesPlayed = user.gamesPlayedIDs;

        userGamesWon.push(gameId);
        userGamesPlayed.push(gameId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: userId},
            {$set: {gamesWonIDs: userGamesWon, gamesPlayedIDs: userGamesPlayed}}
        );

        let incrementWonGame = await games.incrementTimesWon(gameId);

        return await this.getUserById(userId);
    },

    async addGameLostID(userId, gameId) {
        if (!userId) throw new Error('You must provide a userId');
        if (!gameId) throw new Error('You must provide a gameId');

        const user = await this.getUserById(userId);

        let userGamesLost = user.gamesLostIDs;
        let userGamesPlayed = user.gamesPlayedIDs;

        userGamesLost.push(gameId);
        userGamesPlayed.push(gameId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: userId},
            {$set: {gamesLostIDs: userGamesLost, gamesPlayedIDs: userGamesPlayed}}
        );

        let incrementLostGame = await games.incrementTimesLost(gameId);

        return await this.getUserById(userId);
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

    async searchUser(search) {
        try {
        searchUser = search.toLowerCase();
        const userCollection = await users();
        const searchUserList = await userCollection.find({ email: {'$regex': searchUser} }).toArray();
        return searchUserList;
        } catch (err) {
            throw err;
        }
    },
    
    async totalscore(){
        //This function returns the users and his  # of wins
        const all_users = await this.getAllUsers();
        var hscores =[]
        var names = []
        for (x in all_users){
            var hscore = all_users[x].gamesWonIDs.length
            var name = all_users[x].firstName
            hscores.push(hscore)
            names.push(name)
        }

        var result = {};
        for (var i = 0; i<names.length; i++){
            result[names[i]]= hscores[i]
        }
        
        return result;
    }
    // async updateUser(id, email, hashedPassword) {
    //     if (!id) throw new Error('You must provide an id');
    //     if (!email) throw new Error('You must provide an email');
    //     if (!hashedPassword) throw new Error('You must provide an hashed password');

    //     if (typeof email != 'string' || email.length === 0) throw new TypeError('email must be a string');
    //     if (typeof hashedPassword != 'string' || hashedPassword.length === 0) throw new TypeError('hashedPassword must be a string');

    //     const user = await this.getUserById(id);
    //     console.log(user);

    //     const userUpdateInfo = {
    //         email: email.toLowerCase(),
    //         hashedPassword: hashedPassword
    //     };

    //     const userCollection = await users();
    //     const updateInfo = await userCollection.updateOne({ _id: id }, { $set: userUpdateInfo });

    //     if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw new Error('Update failed');

    //     return await this.getUserById(id);
    // }
};

module.exports = exportedMethods;
