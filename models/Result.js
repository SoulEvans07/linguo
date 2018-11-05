const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  all: Number,
  correct: Number
});

module.exports = mongoose.model('Result', resultSchema);


