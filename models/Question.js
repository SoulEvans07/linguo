const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const questionchema = new Schema({
  word: String,
  type: Number,
  length: Number,
  pool: [ String ] // can be empty, string array or array of letters depending on gametype
});

module.exports = mongoose.model('Question', questionchema);


