const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  word: { type: Schema.Types.ObjectId, ref: 'Word' },
  answer: String,
  is_correct: Boolean,
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  date: Date
});

module.exports = mongoose.model('Record', recordSchema);