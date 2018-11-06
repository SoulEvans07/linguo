const express = require('express');
const dictionaryController = require('../controllers/dictionaryController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/:lang_1/:lang_2/new',
  authController.authenticate,
  dictionaryController.addWord
);

router.get('/:lang_1/:lang_2',
  authController.authenticate,
  dictionaryController.getDictionary
);

module.exports = router;
