const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');
const Question = require('../models/Question');
const GameType = require('../models/GameTypeEnum');
const ALPHABET = [ "a", "b", "c", "d", "e", "f",
  "g", "h", "i", "j", "k",
  "l", "m", "n", "o", "p",
  "q", "r", "s", "t", "u",
  "v", "w", "x", "y", "z" ];

// TODO: lesson start -> create game instance
exports.new = async (req, res, next) => {
  var lid = mongoose.Types.ObjectId(req.body.lesson_id);

  let lesson = await Lesson.findOne({ _id: lid }).populate("word_pool").exec();
  if (!lesson)
    res.status(400).send("No such lesson!");

  let game = new Game({
    lesson_id: lesson._id,
    user_id: res.currentUser._id,
    type: req.body.type,
    questions: pickQuestions(lesson, req.body.type),
  });

  // try{
  //   game = await game.save()
  // }catch (e) {
  //   res.status(400).send(e.message);
  // }

  game.answers = undefined;
  return res.status(200).send(game);
};

var pickQuestions = function (lesson, type) {
  let question_list = [];
  let pool = [];

  lesson.word_pool.forEach(word => {
    pool.push(word.order(lesson.dictionary.lang_1, lesson.dictionary.lang_2));
  });

  switch (type) {
    case GameType.WORD_MATRIX:
      question_list = createMatrix(pool, lesson.question_count, lesson.difficulty);
      break;
    case GameType.HANGMAN:
      question_list = createHangman(pool, lesson.question_count, lesson.difficulty);
      break;
    case GameType.TYPE_WRITER:
      question_list = createTypewriter(pool, lesson.question_count, lesson.difficulty);
      break;
  }

  return question_list;
};

var createMatrix = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.WORD_MATRIX,
      pool: selectMatrix(pool, translateDifficulty(difficulty, GameType.WORD_MATRIX))
    });
    question_list.push(question);
  });

  return question_list;
};

var createHangman = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.HANGMAN,
      pool: selectLetters(entities.decode(word.word_2), difficulty)
    });
    question_list.push(question);
  });

  return question_list;
};

var createTypewriter = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.TYPE_WRITER,
      pool: undefined
    });
    question_list.push(question);
  });

  return question_list;
};

var selectWords = function (pool, count) {
  let words = [];
  pool.forEach(w => words.push(w));
  words = words.sort(() => .5 - Math.random());
  return words.slice(0, count);
};

var selectMatrix = function (pool, count) {
  let hints = [];
  pool.forEach(w => hints.push(entities.decode(w.word_2)));
  hints = hints.sort(() => .5 - Math.random());
  return hints.slice(0, count);
};

var selectLetters = function (word, count) {
  let hints = word.split('');
  let letters = ALPHABET;
  letters = letters.filter(l => {
    return word.indexOf(l) === -1;
  });

  letters = letters.sort(() => .5 - Math.random());
  return (hints.concat(letters.slice(0, count))).sort(() => .5 - Math.random());
};

var translateDifficulty = function (difficulty, type) {
  return 10 - difficulty;
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