const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const levelSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  exp: Number
});

module.exports = mongoose.model('Level', levelSchema);

