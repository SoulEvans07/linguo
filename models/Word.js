const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  lang_1: { type: String, required: true },
  word_1: { type: String, required: true },
  lang_2: { type: String, required: true },
  word_2: { type: String, required: true },
  difficulty: Number,
  tags: [ String ]
});

wordSchema.methods.switch = function () {
  let lang_tmp = this.lang_1;
  let word_tmp = this.word_1;

  this.lang_1 = this.lang_2;
  this.word_1 = this.word_2;
  this.lang_2 = lang_tmp;
  this.word_2 = word_tmp;
  return this;
};

wordSchema.methods.order = function (lang_1, lang_2) {
  if (this.lang_1 === lang_2 && this.lang_2 === lang_1)
    return this.switch();
  return this;
};

module.exports = mongoose.model('Word', wordSchema);
