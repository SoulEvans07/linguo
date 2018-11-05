const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  difficulty: Number,
  dictionary: { type: Schema.Types.ObjectId, ref: 'Dictionary' },
  parts: [ { type: Schema.Types.ObjectId, ref: 'Game' }, ]
});

module.exports = mongoose.model('Lesson', lessonSchema);

