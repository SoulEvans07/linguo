const entities = require('html-entities').AllHtmlEntities;

const Word = require('../models/Word');

exports.addWord = async (req, res, next) => {
  let word = new Word({
    lang_1: entities.encode(req.body.lang_1),
    lang_2: entities.encode(req.body.lang_2),
    word_1: entities.encode(req.body.word_1),
    word_2: entities.encode(req.body.word_2),
    difficulty: req.body.difficulty,
    tags: req.body.tags
  });

  word = await word.save();

  return res.status(200).send(word);
};