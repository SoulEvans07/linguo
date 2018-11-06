const express = require('express');
const dictionaryController = require('../controllers/dictionaryController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/:lang_1/:lang_2/new',
  authController.authenticate,
  dictionaryController.new
);

router.get('/:lang_1/:lang_2',
  authController.authenticate,
  dictionaryController.dictionary
);

module.exports = router;
