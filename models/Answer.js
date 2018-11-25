const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const answerSchema = new Schema({
  word: String,
  answer: String,
  is_correct: Boolean,
  index: Number
});

module.exports = mongoose.model('Answer', answerSchema);