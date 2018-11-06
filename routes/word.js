const express = require('express');
const wordController = require('../controllers/wordController');
const authController = require('../controllers/authController');

const router = express.Router();


router.post('/new',
  authController.authenticate,
  wordController.addWord
);


module.exports = router;
