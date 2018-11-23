const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/list',
  authController.authenticate,
  authController.requireAdmin,
  userController.list
);

// Users new is auth/register

router.post('/:id/update',
  authController.authenticate,
  authController.requireAdmin,
  userController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  authController.requireAdmin,
  userController.delete
);

router.get('/:id',
  authController.authenticate,
  authController.requireAdmin,
  userController.get
);


module.exports = router;
