const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
// const uuid = require('uuid');

let exportedMethods = {

    async getAllGames() {
        const gameCollection = await games();
        const gameList = await gameCollection.find({}).toArray();
        return gameList;
    },

    async getGameById(id) {
        const gameCollection = await games();
        const game = await gameCollection.findOne({ _id: id });
        if (!game) throw 'Game not found';
        return game;
    },

    async addGame(word) {

        const gameCollection = await games();

        let newGame = {
            word: word,
            date: new Date().toTimeString(),
            comments: [],
            _id: uuid.v4()
        };

        const newInsertInformation = await gameCollection.insertOne(newGame);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getGameById(newInsertInformation.insertedId);
    },

    async removeGame(id) {
        const gameCollection = await games();
        const deletionInfo = await gameCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete game with id of ${id}`;
        }
        return true;
    },

    async updateGame(id, word, date, comments) {
        const game = await this.getGameById(id);
        console.log(game);

        const gameUpdateInfo = {
            word: word,
            date: date,
            comments: comments
        };

        const gameCollection = await games();
        const updateInfo = await gameCollection.updateOne({ _id: id }, { $set: gameUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return await this.getGameById(id);
    }
};

module.exports = exportedMethods;
