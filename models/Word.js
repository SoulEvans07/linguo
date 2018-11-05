const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  lang_1: { type: String, required: true },
  word_1: { type: String, required: true },
  lang_2: { type: String, required: true },
  word_2: { type: String, required: true },
  difficulty: Number,
  tags: [ String ]
});

module.exports = mongoose.model('Word', wordSchema);
