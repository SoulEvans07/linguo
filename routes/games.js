const express = require('express');
const gameController = require('../controllers/gameController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/list',
  authController.authenticate,
  authController.requireAdmin,
  gameController.list
);

router.post('/new',
  authController.authenticate,
  authController.requireAdmin,
  gameController.new
);

router.post('/:id/answer',
  authController.authenticate,
  authController.requireAdmin,
  gameController.answer
);

// Games shouldn't have update

// Games shouldn't have delete

router.get('/:id',
  authController.authenticate,
  authController.requireAdmin,
  gameController.get
);


module.exports = router;
