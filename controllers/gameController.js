const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');

exports.new = async (req, res, next) => {
  let game = new Game({
    type: req.body.type,
    word_pool: req.body.word_pool,
    question_count: req.body.question_count
  });

  try{
    game = await game.save()
  }catch (e) {
    res.status(400).send(e.message);
  }

  return res.status(200).send(game);
};

exports.update = async (req, res, next) => {
  return res.status(200).send();
};

exports.delete = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Word.findOne({ _id: gid }).exec();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  await game.delete();

  return res.status(200).send();
};

exports.list = async (req, res, next) => {
  let list = await Game.find().exec();

  return res.status(200).send(list);
};

exports.get = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).populate("word_pool").exec();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  return res.status(200).send(game);
};