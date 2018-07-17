'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  fullname: { type: String},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true }
});

// Customize output for `res.json(data)`, `console.log(data)` etc.
userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});

// userSchema.methods.validatePassword = function (password) {
//   return password === this.password;
// };

userSchema.methods.serialize = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    username: this.username
  };
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);

