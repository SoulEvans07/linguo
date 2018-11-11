const express = require('express');
const wordController = require('../controllers/wordController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/list',
  authController.authenticate,
  wordController.list
);

router.post('/new',
  authController.authenticate,
  wordController.new
);

router.post('/:id/update',
  authController.authenticate,
  wordController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  wordController.delete
);

router.get('/:id',
  authController.authenticate,
  wordController.get
);


module.exports = router;
