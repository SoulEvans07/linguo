const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    fullName: { type: String, required: true },
    userName: String
  },
  email: { type: String, required: true, index: true },
  password: String,
  roles: { type: [String], default: ['user'] }
});

userSchema.pre('save', function (next) {
  const user = this;
  if(user.isNew) {
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
