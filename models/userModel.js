const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Any person needs a name'],
  },
  email: {
    type: String,
    require: [true, 'Please input an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please input a valid Email Account'],
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Please input a string password!'],
    minlength: [8, 'Passwords must be more than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      validator: function (doc) {
        return this.password === doc;
      },
      message: 'Passwords must be equal',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function(doc_password, user_password){
  return await bcrypt.compare(doc_password, user_password);
}
const User = mongoose.model('User', userSchema);
module.exports = User;
