const entities = require('html-entities').AllHtmlEntities;
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson');
const Game = require('../models/Game');
const Word = require('../models/Word');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const GameType = require('../models/GameTypeEnum');

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

Array.prototype.asyncForEach = async function (callback) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[ index ])
  }
};


// TODO: filter
exports.list = async (req, res, next) => {
  let list = await Game.find().populate("questions").populate("answers").exec();

  return res.status(200).send(list);
};

exports.new = async (req, res, next) => {
  let lid = mongoose.Types.ObjectId(req.body.lesson_id);

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

  console.log(game.questions[ 0 ]);
  return res.status(200).send({ game: game._id, question: game.questions[ 0 ] });
};

let pickQuestions = function (lesson, type) {
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

let createMatrix = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let matrix = selectMatrix(pool, translateDifficulty(difficulty, GameType.WORD_MATRIX));
    matrix.push(entities.decode(word.word_2));
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.WORD_MATRIX,
      length: word.word_2.length,
      pool: matrix
    });
    question_list.push(question);
  });

  return question_list;
};

let createHangman = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.HANGMAN,
      length: word.word_2.length,
      pool: selectLetters(entities.decode(word.word_2), difficulty)
    });
    question_list.push(question);
  });

  return question_list;
};

let createTypewriter = function (pool, count, difficulty) {
  let question_list = [];
  let words = selectWords(pool, count);

  words.forEach(word => {
    let question = new Question({
      word: entities.decode(word.word_1),
      type: GameType.TYPE_WRITER,
      length: word.word_2.length,
      pool: undefined
    });
    question_list.push(question);
  });

  return question_list;
};

let selectWords = function (pool, count) {
  let words = [];
  pool.forEach(w => words.push(w));
  words = words.sort(() => .5 - Math.random());
  return words.slice(0, count);
};

let selectMatrix = function (pool, count) {
  let hints = [];
  pool.forEach(w => hints.push(entities.decode(w.word_2)));
  hints = hints.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  hints = hints.sort(() => .5 - Math.random());
  return hints.slice(0, count);
};

let selectLetters = function (word, count) {
  let hints = word.split('');

  for (let i = 0; i < count; i++) {
    let rand_indx = Math.round(Math.random() * (ALPHABET.length-1));
    let letter = ALPHABET[ rand_indx ];
    hints.push(letter);
  }

  return hints.sort(() => .5 - Math.random());
};

let translateDifficulty = function (difficulty, type) {
  return 10 - difficulty;
};

exports.answer = async (req, res, next) => {
  let gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).populate("questions").populate("answers").exec();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  let answer = new Answer({
    word: entities.encode(req.body.word),
    answer: entities.encode(req.body.answer),
    index: req.body.index
  });

  if (game.questions[ answer.index ].word !== entities.decode(answer.word)) {
    console.log("No question found for your answer!");
    console.log("expected:\n" + JSON.stringify(game.questions[ answer.index ].word));
    console.log("got:\n" + JSON.stringify(answer));
    return res.status(400).send("No question found for your answer!");
  }
  if (game.answers.length !== answer.index) {
    console.log("You can't answer that question!");
    console.log(answer);
    return res.status(400).send("You can't answer that question!");
  }

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
  let is_correct = false;
  let solutions = [];
  possible.forEach(wo => {
    wo.order(lang_1, lang_2);
    solutions.push(wo.word_2);
  });
  solutions.forEach(sol => is_correct = is_correct || sol === answer.answer);

  answer.is_correct = is_correct;
  answer = await answer.save();

  game.answers.push(answer);
  await game.save();

  if (answer.index + 1 < game.questions.length) {
    return res.status(200).send({
      correct: is_correct,
      solution: solutions,
      next: game.questions[ answer.index + 1 ]
    });
  } else {
    let score = getScore(game);
    
    res.currentUser.exp += score;
    await res.currentUser.save();
    
    return res.status(200).send({
      correct: is_correct,
      solution: solutions,
      game: {
        questions: game.questions,
        answers: game.answers
      },
      score: score
    });
  }
};

let getScore = function(game){
  let score = 0;
  game.answers.forEach(answer => {
    score += answer.is_correct ? game.questions[answer.index].length : 0;
  });

  return score;
};

exports.get = async (req, res, next) => {
  let gid = mongoose.Types.ObjectId(req.params.id);
  let game = await Game.findOne({ _id: gid }).populate("word_pool").lean();

  if (!game) {
    return res.status(400).send("Game doesn't exist!");
  }

  return res.status(200).send(game);
};