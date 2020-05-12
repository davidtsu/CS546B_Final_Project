const mongoCollections = require('../config/mongoCollections');
const gameMetrics = mongoCollections.gameMetrics;
// const uuid = require('uuid');

let exportedMethods = {

    async getAllGameMetrics() {
        const gameMetricCollection = await gameMetrics();
        const gameMetricList = await gameMetricCollection.find({}).toArray();
        return gameMetricList;
    },

    async getGameMetricById(id) {
        const gameMetricCollection = await gameMetricMetrics();
        const gameMetric = await gameMetricCollection.findOne({ _id: id });
        if (!gameMetric) throw 'Game not found';
        return gameMetric;
    },

    async addGameMetric(word) {

        const gameMetricCollection = await gameMetrics();

        let newGameMetric = {
            word: word,
            partOf: [], //must get all IDs of dictionaries containing this word
            timesWon: 0,
            timesLost: 0,
            winPercentage: (timesLost == 0) ? 100 : timesWon/timesLost,
            playedBy: {}, //must get all IDs of players attempting this word
            _id: uuid.v4()
        };

        const newInsertInformation = await gameMetricCollection.insertOne(newGameMetric);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getGameMetricById(newInsertInformation.insertedId);
    },

    async removeGameMetric(id) {
        const gameMetricCollection = await gameMetrics();
        const deletionInfo = await gameMetricCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete gameMetric with id of ${id}`;
        }
        return true;
    },

    async updateGameMetric(id, word, timesWon, timesLost, playedBy) {
        const gameMetric = await this.getGameMetricById(id);
        console.log(gameMetric);

        const gameMetricUpdateInfo = {
            word: word,
            partOf: partOf,
            timesWon: timesWon,
            timesLost: timesLost,
            winPercentage: (timesLost == 0) ? 100 : timesWon/timesLost,
            playedBy: gameMetric.playedBy.add(playedBy)
        };

        const gameMetricCollection = await gameMetrics();
        const updateInfo = await gameMetricCollection.updateOne({ _id: id }, { $set: gameMetricUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return await this.getGameMetricById(id);
    }
};

module.exports = exportedMethods;
