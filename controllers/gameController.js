const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Game = require('../models/Game');
const Word = require('../models/Word');

// TODO: lesson start -> create game instance
exports.new = async (req, res, next) => {
  // let game = new Game({
  //   type: req.body.type,
  //   word_pool: req.body.word_pool,
  //   question_count: req.body.question_count
  // });
  //
  // try{
  //   game = await game.save()
  // }catch (e) {
  //   res.status(400).send(e.message);
  // }
  //
  // return res.status(200).send(game);
};

// TODO: remove, there shouldn't be generic update for game instance
exports.update = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).lean();

  if (!game) {
    return res.status(400).send("Word doesn't exist!");
  }

  if (req.body.lesson) {
    game.lesson = req.body.lesson;
  }

  if (req.body.type) {
    game.type = req.body.type;
  }

  if (req.body.question_count) {
    game.question_count = req.body.question_count;
  }

  if (req.body.word_pool) {
    game.word_pool = req.body.word_pool;
  }

  game = await game.save();

  return res.status(200).send(game);
};

// TODO: remove. on finishing lesson the game instance is closed but not removed
exports.delete = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Word.findOne({ _id: gid }).lean();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  await game.delete();

  return res.status(200).send();
};

// TODO: filter
exports.list = async (req, res, next) => {
  let list = await Game.find().lean();

  return res.status(200).send(list);
};

exports.get = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).populate("word_pool").lean();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  return res.status(200).send(game);
};