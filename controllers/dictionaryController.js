const entities = require('html-entities').AllHtmlEntities;

const Word = require('../models/Word');


exports.dictionary = async (req, res, next) => {
  dictionary = await Word.find(
    {
      $or: [
        { lang_1: req.params.lang_1, lang_2: req.params.lang_2 },
        { lang_1: req.params.lang_2, lang_2: req.params.lang_1 }
      ]
    }
  ).exec();

  dictionary.forEach(function (word) {
    word.order(req.params.lang_1, req.params.lang_2);
  });

  return res.status(200).send(dictionary);
};

exports.new = async (req, res, next) => {
  let word = new Word({
    lang_1: entities.encode(req.params.lang_1),
    lang_2: entities.encode(req.params.lang_2),
    word_1: entities.encode(req.body.word_1),
    word_2: entities.encode(req.body.word_2),
    difficulty: req.body.difficulty,
    tags: req.body.tags
  });

  word = await word.save();

  return res.status(200).send(word);
};