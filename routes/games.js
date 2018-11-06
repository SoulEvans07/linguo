const express = require('express');
const gameController = require('../controllers/gameController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/new',
  authController.authenticate,
  gameController.new
);

router.post('/:id/update',
  authController.authenticate,
  gameController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  gameController.delete
);

router.get('/:id',
  authController.authenticate,
  gameController.get
);


module.exports = router;
