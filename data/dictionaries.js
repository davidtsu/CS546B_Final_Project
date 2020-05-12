const mongoCollections = require('../config/mongoCollections');
const dictionaries = mongoCollections.dictionaries;
const uuid = require('uuid');

let exportedMethods = {

    async getAllDictionaries() {
        console.log('fetching all dictionaries')
        const dictionaryCollection = await dictionaries();
        const dictionaryList = await dictionaryCollection.find({}).toArray();
        console.log(dictionaryList)
        return dictionaryList;
    },

    async getDictionaryById(id) {
        const dictionaryCollection = await dictionaries();
        const dictionary = await dictionaryCollection.findOne({ _id: id });
        if (!dictionary) throw 'Dictionary not found';
        return dictionary;
    },

    async addDictionary(theme, wordList) {
        if(!theme) throw new Error('No theme supplied for dictionary.');
        if(!word_list) throw new Error('No words provided for dictionary.');

        if (typeof theme != 'string') throw new TypeError('theme must be of type string');
        if (!Array.isArray(wordList)) throw new TypeError('word_list');

        let newDictionary = {
            _id: uuid.v4(),
            theme: theme,
            words: wordList
        };
        
        const dictionaryCollection = await dictionaries();
        const newInsertInformation = await dictionaryCollection.insertOne(newDictionary);


        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getDictionaryById(newInsertInformation.insertedId);
    },

    async removeDictionary(id) {
        const dictionaryCollection = await dictionaries();
        const deletionInfo = await dictionaryCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete dictionary with id of ${id}`;
        }
        return true;
    },

    async updateDictionary(id, theme, word_list) {
        const dictionary = await this.getDictionaryById(id);
        console.log(dictionary);

        const dictionaryUpdateInfo = {
            theme: theme,
            words: word_list
        };

        const dictionaryCollection = await dictionaries();
        const updateInfo = await dictionaryCollection.updateOne({ _id: id }, { $set: dictionaryUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return await this.getDictionaryById(id);
    }
};

module.exports = exportedMethods;
