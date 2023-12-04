const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
// Adding the user functions
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
// Getting users
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//Creating new users
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//updating users
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//Deleting user
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  /** Create Error if user posts password data */
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot Update password', 400));
  }
  /** UPdate User  Document*/
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidatores: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      user: updateUser,
    },
  });
});
