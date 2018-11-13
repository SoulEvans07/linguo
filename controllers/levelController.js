const entities = require('html-entities').AllHtmlEntities;

const Level = require('../models/Level');

exports.list = async (req, res, next) => {
  let list = await Level.find().lean();
  return res.status(200).send(list);
};

exports.new = async (req, res, next) => {
  let level = new Level({
    name: entities.encode(req.body.name),
    exp: req.body.exp
  });

  try {
    level = await level.save();
  } catch (e) {
    return res.status(400).send(e.message);
  }

  return res.status(200).send(level);
};

exports.update = async (req, res, next) => {
  let level = await Level.findById(req.params.id).exec();

  if(!level)
    return res.status(404).send("No such level!");

  if(req.body.name)
    level.name = entities.encode(req.body.name);
  if(req.body.exp)
    level.exp = req.body.exp;

  level = await level.save();

  return res.status(200).send(level);
};

exports.delete = async (req, res, next) => {
  let level = await Level.findById(req.params.id).exec();

  if(!level)
    return res.status(404).send("No such level!");

  await level.delete();

  return res.status(200).send();
};

exports.get = async (req, res, next) => {
  let level = await Level.findById(req.params.id).lean();

  if(!level)
    return res.status(404).send("No such level!");

  return res.status(200).send(level);
};