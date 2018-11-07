const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const lessonSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  difficulty: Number,
  dictionary: {
    lang_1: String,
    lang_2: String
  },
  parts: [ { type: Schema.Types.ObjectId, ref: 'Game' }, ]
});

module.exports = mongoose.model('Lesson', lessonSchema);

