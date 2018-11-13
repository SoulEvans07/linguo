const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const gameSchema = new mongoose.Schema({
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  user_id: Schema.Types.ObjectId,
  type: Number,
  word_pool: [ { type: Schema.Types.ObjectId, ref: 'Word' } ],
  questions: [ { type: Schema.Types.ObjectId, ref: 'Question' } ],
  answers: [ { type: Schema.Types.ObjectId, ref: 'Answer' } ],

  startTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);


