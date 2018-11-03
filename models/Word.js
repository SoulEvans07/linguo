const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true, index: true },
  translations: [{
    lang: String,
    word: String
  }],
  difficulty: Number,
  tags: [ String ]
})

module.exports = mongoose.model('Word', wordSchema);
