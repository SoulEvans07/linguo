const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  name: String,
  password: String,
  email: { type: String, required: true, unique: true, index: true },
  native_language: String,
  exp: { type: Number, default: 0 },
  is_admin: Boolean,
  signupdate: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isNew) {
    if (user.password) {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          console.error('Error saving user', user.email, err);
          return next();
        }
        user.password = hash;
        return next();
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
});

module.exports = mongoose.model('User', userSchema);
