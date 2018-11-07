const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');


Array.prototype.asyncForEach = async function (callback) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[ index ])
  }
};

exports.new = async (req, res, next) => {
  let dictionary = req.body.dictionary;
  dictionary.lang_1 = entities.encode(dictionary.lang_1);
  dictionary.lang_2 = entities.encode(dictionary.lang_2);

  // TODO: difficulty
  let parts = [];
  await req.body.parts.asyncForEach(async function (game) {
    console.log(typeof game);
    if (typeof game === "string") {
      parts.push(game);
    } else if (typeof game === "object") {
      game = new Game({
        type: game.type,
        word_pool: game.word_pool,
        question_count: game.question_count
      });

      game = await game.save();
      parts.push(game._id);
    }
  });

  let lesson = new Lesson({
    name: entities.encode(req.body.name),
    difficulty: 0,
    dictionary: dictionary,
    parts: parts
  });

  try {
    lesson = await lesson.save();
  } catch (e) {
    return res.status(400).send(e.message);
  }

  return res.status(200).send(lesson);
};

exports.update = async (req, res, next) => {
  return res.status(200).send();
};

exports.delete = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.params.id);
  let lesson = await Lesson.findOne({ _id: lid }).exec();

  if (!lesson) {
    return res.status(400).send("Lesson doesn't exist!");
  }

  await lesson.delete();

  return res.status(200).send();
};

exports.list = async (req, res, next) => {
  let list = await Lesson.find().populate("parts").exec();

  return res.status(200).send(list);
};

exports.get = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.params.id);
  let lesson = await Lesson.findOne({ _id: lid }).exec();

  if (!lesson) {
    return res.status(400).send("Lesson doesn't exist!");
  }

  return res.status(200).send(lesson);
};