const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
    : await User.findOne({ 'name.userName': _.get(req.body, 'name.userName', req.body.userName) }).lean();
  if (!user) return res.status(404).send('User not found');
  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    const token = signToken(_.pick(user, ['_id', 'email', 'name', 'roles']));
    user.password = undefined;
    return res.status(200).send({ user, token });
  }
  return res.status(403).send('Bad credentials!');
};

exports.refreshToken = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    token = jwt.verify(token, process.env.SECRET, { ignoreExpiration: true });
    const userId = _.get(token, 'user._id');
    if (userId) {
      const currentUser = await User.findById(userId);
      token = signToken(_.pick(currentUser, ['_id', 'email', 'name', 'roles']));
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
    let user = new User({
      email: req.body.email,
      password: req.body.password,
      name: {
        fullName: _.isString(req.body.name) ? req.body.name : _.get(req.body, 'name.fullName'),
        userName: _.get(req.body, 'name.userName')
      }
    });
    user = await user.save();
    return res.status(200).send(_.omit(user, ['password']));
  } catch (e) {
    console.error('Error creating user', e);
    return res.status(500).send(e.message);
  }
};
