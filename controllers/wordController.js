const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

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

exports.updateWord = async (req, res, next) => {
  if(req.params.id === undefined || req.body.lang_1 === undefined || req.body.lang_2 === undefined){
    return res.status(400).send("Missing parameters!");
  }

  var wid = mongoose.Types.ObjectId(req.params.id);
  let word = await Word.findOne({_id: wid}).exec();
  word.order(req.body.lang_1, req.body.lang_2);

  if(req.body.word_1 !== undefined){
    word.word_1 = entities.encode(req.body.word_1);
  }

  if(req.body.word_2 !== undefined){
    word.word_2 = entities.encode(req.body.word_2);
  }

  if(req.body.difficulty !== undefined){
    word.difficulty = req.body.difficulty;
  }

  if(req.body.tags !== undefined && req.body.tags !== []){
    word.tags = req.body.tags;
  }

  word = await word.save();

  return res.status(200).send(word);
};