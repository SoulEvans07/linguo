const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const GameType = require('../models/GameTypeEnum');

const ALPHABET = [ "a", "b", "c", "d", "e", "f",
  "g", "h", "i", "j", "k",
  "l", "m", "n", "o", "p",
  "q", "r", "s", "t", "u",
  "v", "w", "x", "y", "z" ];

Array.prototype.asyncForEach = async function (callback) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[ index ])
  }
};

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

  game.questions.asyncForEach(await function (question) {
    question.save()
  });

  try {
    game = await game.save()
  } catch (e) {
    res.status(400).send(e.message);
  }

  return res.status(200).send(game.questions[ 0 ]);
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
      word: word.word_1,
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

exports.answer = async (req, res, next) => {
  var gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).populate("questions").exec();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  let answer = new Answer({
    word: entities.encode(req.body.word),
    answer: entities.encode(req.body.answer),
    index: req.body.index
  });

  if (game.questions[ answer.index ].word !== answer.word)
    return res.status(400).send("No question found for your answer!");
  if(game.answers.length !== answer.index)
    return res.status(400).send("You can't answer that question!");

  answer = await answer.save();

  game.answers.push(answer);
  await game.save();

  // TODO: check answer and send that too
  let lesson = await Lesson.findById(game.lesson_id).exec();
  let lang_1 = lesson.dictionary.lang_1;
  let lang_2 = lesson.dictionary.lang_2;
  let possible = await Word.find({
    $and: [
      { $or: [ { lang_1: lang_1, lang_2: lang_2 }, { lang_1: lang_2, lang_2: lang_1 } ] },
      { $or: [ { word_1: answer.word }, { word_2: answer.word } ] }
    ]
  }).exec();

  // check answer
  let correct = false;
  let solutions = [];
  possible.forEach(wo => {
    wo.order(lang_1, lang_2);
    solutions.push(wo.word_2);
  });
  solutions.forEach(sol => correct = correct || sol === answer.answer);

  if (answer.index + 1 < game.questions.length) {
    return res.status(200).send({
      correct: correct,
      solution: solutions,
      next: game.questions[ answer.index + 1 ]
    });
  } else {
    // TODO: send statistics
    // TODO: close/delete qame, questions and answers
    return res.status(200).send({
      correct: correct,
      solution: solutions,
      next: "Well done! You finished this Lesson!"
    });
  }
};

// TODO: filter
exports.list = async (req, res, next) => {
  let list = await Game.find().populate("questions").populate("answers").exec();

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