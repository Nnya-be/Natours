const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const signToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWTSECRETE, {
    expiresIn: process.env.JWTEXPIRE,
  });
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookie_options = {
    expires: new Date(Date.now() + process.env.JWTCOOKIE * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookie_options.secure = true;
  res.cookie('jwt', token, cookie_options);
  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createToken(newUser, 201, res);
  // token = signToken(newUser);
  // res.status(200).json({
  //   status: 'Success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.logIn = catchAsync(async (req, res, next) => {
  /**Check if the is an email and password in the req */
  // console.log (req);
  const user_email = req.body.email;
  const user_password = req.body.password;
  // console.log(user_email, user_password);

  if (!user_email || !user_password)
    return next(new AppError('Incorrect Password or Email', 400));

  /** Check if there exist a user with that email */
  const user_found = await User.findOne({ email: req.body.email }).select(
    '+password',
  );
  // console.log(user_found);

  if (!user_found)
    return next(new AppError('Incorrect Password or Email', 400));

  /** Use bcrypt to check for the user password  */
  const password_check = await user_found.checkPassword(
    user_password,
    user_found.password,
  );
  if (!password_check)
    return next(new AppError('Incorrect Password or Email!', 400));

  /** IF there is all correct Then send token. */
  // token = signToken(user_found);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
  createToken(user_found, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  /** Get token from the header and check if it exitst. */
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) return next(new AppError('Please Log in!', 401));
  /** verify the token */
  const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRETE);

  /** Chech if the user still exitst */
  const userAccount = await User.findById(decoded.id);

  if (!userAccount) {
    return next(new AppError('Invalid Credentials! No user found', 401));
  }
  /** Check if pssword has be changed since token issued date. */

  if (userAccount.changedPassword(decoded.iat))
    return new AppError('Invalid Credentials! Password changed', 401);

  req.user = userAccount;
  next();
});

exports.restrictTo = (...role) => {
  return async (res, req, next) => {
    // console.log(role);
    if (!role.includes(req.user.role))
      return next(new AppError('Permission denied for this action!', 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  /** Get user email field from the body */
  const userEmail = req.body.email;

  /** Query for the user document */
  const userDocument = User.findOne({ email: userEmail });
  /** Chech if the email or no document of the email exist. */

  if (!userDocument || !userEmail) {
    return next(new AppError('Wrong Credentials', 401));
  }

  const resetToken = userDocument.createPasswordResetToken();
  await userDocument.save({ validateBeforeSave: false });
  /** Check and send token to user email*/

  const resetURL = `${req.protcol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit your request with your new password and Confirm. If your didn't, please ignore`;
  // console.log(userDocument);
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset Token (valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to the email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Error while sending Email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  /** Get user  based on token */
  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpiration: { $gt: Date.now() },
  });
  /** If the token has not experied then set the new password */
  if (!user) {
    return next(new AppError('Invalid Token', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetExpiration = undefined;
  user.passwordResetToken = undefined;

  await user.save();
  /** Update the changed at property */

  /** Log user in */
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
  createToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  /** Get user from the collection */
  const user = await User.findById(req.user.id).select('+password');

  /** Check if the password is correct */
  if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Invalid Password!', 401));
  }
  /** Update the password */

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  /** Log user in */
  // const token = signToken(user._id);
  // res.status(200).json({});
  createToken(user, 200, res);
});
