const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');


exports.list = async (req, res, next) => {
  let list = req.query.filter
    ? await Lesson.find({ ...JSON.parse(req.query.filter) }).populate(req.query.populate ? JSON.parse(req.query.populate) : '').lean()
    : await Lesson.find({}).populate(req.query.populate ? JSON.parse(req.query.populate) : '').lean();

  return res.status(200).send(list);
};

exports.new = async (req, res, next) => {
  let dictionary = req.body.dictionary;
  dictionary.lang_1 = entities.encode(dictionary.lang_1);
  dictionary.lang_2 = entities.encode(dictionary.lang_2);

  let ids = [];
  req.body.word_pool.forEach(word => {
    ids.push(mongoose.Types.ObjectId(word));
  });

  let words = await Word.find({ _id: { $in: ids } }).exec();
  let max_difficulty = 0;
  words.forEach(word => {
    if (max_difficulty < word.difficulty)
      max_difficulty = word.difficulty;
  });

  let lesson = new Lesson({
    name: entities.encode(req.body.name),
    difficulty: max_difficulty,
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

exports.delete = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.params.id);
  let lesson = await Lesson.findOne({ _id: lid }).exec();

  if (!lesson) {
    return res.status(400).send("Lesson doesn't exist!");
  }

  await lesson.delete();

  return res.status(200).send();
};

exports.get = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.params.id);
  let lesson = await Lesson.findOne({ _id: lid }).lean();

  if (!lesson) {
    return res.status(400).send("Lesson doesn't exist!");
  }

  return res.status(200).send(lesson);
};