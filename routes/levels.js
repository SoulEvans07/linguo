const express = require('express');
const router = express.Router();

const levelController = require('../controllers/levelController');
const authController = require('../controllers/authController');


router.get('/list',
  authController.authenticate,
  levelController.list
);

router.post('/new',
  authController.authenticate,
  levelController.new
);

router.post('/:id/update',
  authController.authenticate,
  levelController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  levelController.delete
);

router.get('/:id',
  authController.authenticate,
  levelController.get
);


module.exports = router;
