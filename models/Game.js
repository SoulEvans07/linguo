const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const gameSchema = new mongoose.Schema({
  type: Number,
  word_pool: [ { type: Schema.Types.ObjectId, ref: 'Word' } ],
  question_count: Number
});

module.exports = mongoose.model('Game', gameSchema);


