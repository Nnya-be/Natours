const express = require('express');
const userCongtroller = require('../controllers/userController');
const router = express.Router();

router
  .route('/')
  .get(userCongtroller.getAllUsers)
  .post(userCongtroller.createUser);

router
  .route('/:id')
  .get(userCongtroller.getUser)
  .patch(userCongtroller.updateUser)
  .delete(userCongtroller.deleteUser);

module.exports = router;
