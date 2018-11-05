const express = require('express');
const dictionaryController = require('../controllers/dictionaryController');

const router = express.Router();

router.get('/:lang_1/:lang_2', dictionaryController.getDictionary);

module.exports = router;
