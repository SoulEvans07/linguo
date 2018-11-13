const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const gameSchema = new mongoose.Schema({
  lesson_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  type: Number,
  questions: [ { type: Schema.Types.ObjectId, ref: 'Question' } ],
  answers: [ { type: Schema.Types.ObjectId, ref: 'Answer' } ],

  startTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);


