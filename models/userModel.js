const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Any person needs a name'],
  },
  email: {
    type: String,
    required: [true, 'Please input an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please input a valid Email Account'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please input a string password!'],
    minlength: [8, 'Passwords must be more than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (doc) {
        return this.password === doc;
      },
      message: 'Passwords must be equal',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiration: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: {$ne: false} });
  next();
});

userSchema.methods.checkPassword = async function (
  doc_password,
  user_password,
) {
  return await bcrypt.compare(doc_password, user_password);
};

userSchema.methods.changedPassword = function (JWTtime) {
  if (this.passwordChangedAt) {
    const time = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTtime < time;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetString = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetString)
    .digest('hex');
  this.passwordResetExpiration = Date.now() + 10 * 60 * 1000;

  return resetString;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
