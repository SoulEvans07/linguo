const express = require('express');
const wordController = require('../controllers/wordController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/list',
  authController.authenticate,
  authController.requireAdmin,
  wordController.list
);

router.post('/new',
  authController.authenticate,
  authController.requireAdmin,
  wordController.new
);

router.post('/:id/update',
  authController.authenticate,
  authController.requireAdmin,
  wordController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  authController.requireAdmin,
  wordController.delete
);

router.get('/:id',
  authController.authenticate,
  authController.requireAdmin,
  wordController.get
);


module.exports = router;
