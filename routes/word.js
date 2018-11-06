const express = require('express');
const wordController = require('../controllers/wordController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/new',
  authController.authenticate,
  wordController.addWord
);

router.post('/:id/update',
  authController.authenticate,
  wordController.updateWord
);


module.exports = router;
