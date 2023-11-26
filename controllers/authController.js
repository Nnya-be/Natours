const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  token = jwt.sign({ id: newUser._id }, process.env.JWTSECRETE, {
    expiresIn: process.env.JWTEXPIRE,
  });

  res.status(200).json({
    status: 'Success',
    token,
    data: {
      user: newUser,
    },
  });
});
