const entities = require('html-entities').AllHtmlEntities;

const User = require('../models/User');

exports.list = async (req, res, next) => {
  try {
    let list = req.query.filter
      ? await User.find({ ...JSON.parse(req.query.filter) }).lean()
      : await User.find({}).lean();
    return res.status(200).send(list);
  } catch (e) {
    console.error('Error in User list', e.message)
    return res.status(500).send(e.message)
  }
};

exports.update = async (req, res, next) => {
  let user = await User.findById(req.params.id).exec();

  if (!user)
    return res.status(404).send("No user with id" + req.params.id + "!");

  if (req.body.username) user.username = entities.encode(req.body.username);
  if (req.body.email) user.email = entities.encode(req.body.email);
  if (req.body.native_language) user.native_language = entities.encode(req.body.native_language);
  if (req.body.name) user.name = entities.encode(req.body.name);
  // TODO? check if old password is correct
  if (req.body.password) user.password = req.body.password;

  user = await user.save();

  return res.status(200).send(user);
};

exports.delete = async (req, res, next) => {
  let user = await User.findById(req.params.id).exec();

  if (!user)
    return res.status(404).send("No user with id" + req.params.id + "!");

  await user.delete();

  return res.status(200).send();
};

exports.get = async (req, res, next) => {
  let user = await User.findById(req.params.id).lean();

  if (!user)
    return res.status(404).send("No user with id" + req.params.id + "!");

  return res.status(200).send(user);
};