const entities = require('html-entities').AllHtmlEntities;

const Word = require('../models/Word');


var mongoose = require('mongoose');

exports.getDictionary = async (req, res, next) => {
  dictionary = await Word.find({
    lang_1: req.params.lang_1,
    lang_2: req.params.lang_2
  }).exec();

  return res.status(200).send(dictionary);
};