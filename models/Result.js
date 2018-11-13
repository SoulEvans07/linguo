const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const resultSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  word: { type: Schema.Types.ObjectId, ref: 'Word' },
  all: Number,
  correct: Number
});

module.exports = mongoose.model('Result', resultSchema);


