const jwt = require('jsonwebtoken');
const _ = require('lodash');
const entities = require('html-entities').AllHtmlEntities;
const bcrypt = require('bcrypt');

const User = require('../models/User');

const signToken = user => jwt.sign(
  { user },
  process.env.SECRET,
  { expiresIn: '7d' },
);


exports.login = async (req, res, next) => {
  const user = req.body.email
    ? await User.findOne({ email: req.body.email }).lean()
    : await User.findOne({ username: req.body.username }).lean();

  if (!user)
    return res.status(404).send('User not found');

  const match = await bcrypt.compare(req.body.password, user.password);

  if (match) {
    const token = signToken(_.pick(user, [ '_id', 'email', 'username', 'is_admin' ]));
    user.password = undefined;
    return res.status(200).send({ user, token });
  }

  return res.status(403).send('Bad credentials!');
};

exports.authenticate = async (req, res, next) => {
  try {
    let token = jwt.verify(req.headers.authorization, process.env.SECRET);
    const userId = _.get(token, 'user._id');
    if (userId) {
      const currentUser = await User.findById(userId);
      currentUser.password = undefined;
      res.currentUser = currentUser;
    }
    return next();
  } catch (e) {
    console.error('Error verifying token');
    return res.status(403).send();
  }
};

exports.requireAdmin = async (req, res, next) => {
  let admin = res.currentUser.is_admin;
  res.currentUser.is_admin = undefined;

  if(!admin)
    return res.status(403).send();

  return next();
};

exports.refreshToken = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    token = jwt.verify(token, process.env.SECRET, { ignoreExpiration: true });
    const userId = _.get(token, 'user._id');
    if (userId) {
      const currentUser = await User.findById(userId);
      token = signToken(_.pick(currentUser, [ '_id', 'email', 'username', 'is_admin' ]));
      delete currentUser.password;
      return res.status(200).send({ user: currentUser, token });
    }
  } catch (e) {
    console.error('Error verifying token', e);
    return res.status(403).send();
  }
  return res.status(403).send();
};

exports.register = async (req, res, next) => {
  try {
    if ((typeof req.body === 'undefined') || (typeof req.body.username === 'undefined') ||
      (typeof req.body.password === 'undefined') || (typeof req.body.email === 'undefined') ||
      (typeof req.body.native_language === 'undefined')) {
      return next();
    }

    if (req.body.username.length < 3) {
      console.error('The username should be at least 3 characters!');
      return res.status(500).send('The username should be at least 3 characters!');
    }

    let user = new User({
      username: entities.encode(req.body.username),
      password: req.body.password,
      email: entities.encode(req.body.email),
      native_language: entities.encode(req.body.native_language),
      exp: 0,
      is_admin: false
    });

    user = await user.save();

    user.password = undefined;

    return res.status(200).send(user);
  } catch (e) {
    console.error('Error creating user', e);
    return res.status(500).send(e.message);
  }
};
