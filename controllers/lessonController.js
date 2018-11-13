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

// TODO: difficulty
exports.new = async (req, res, next) => {
  let dictionary = req.body.dictionary;
  dictionary.lang_1 = entities.encode(dictionary.lang_1);
  dictionary.lang_2 = entities.encode(dictionary.lang_2);

  let lesson = new Lesson({
    name: entities.encode(req.body.name),
    difficulty: 0,
    dictionary: dictionary,
    word_pool: req.body.word_pool,
    question_count: req.body.question_count
  });

  try {
    lesson = await lesson.save();
  } catch (e) {
    return res.status(400).send(e.message);
  }

  return res.status(200).send(lesson);
};

// TODO: lesson/:id/update
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

// TODO: filter
exports.list = async (req, res, next) => {
  let list = await Lesson.find().populate("parts").lean();

  return res.status(200).send(list);
};

exports.get = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.params.id);
  let lesson = await Lesson.findOne({ _id: lid }).lean();

  if (!lesson) {
    return res.status(400).send("Lesson doesn't exist!");
  }

  return res.status(200).send(lesson);
};