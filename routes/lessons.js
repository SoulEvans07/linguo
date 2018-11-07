const express = require('express');
const lessonsController = require('../controllers/lessonController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/list',
  authController.authenticate,
  lessonsController.list
);

router.post('/new',
  authController.authenticate,
  lessonsController.new
);

router.post('/:id/update',
  authController.authenticate,
  lessonsController.update
);

router.delete('/:id/delete',
  authController.authenticate,
  lessonsController.delete
);

router.get('/:id',
  authController.authenticate,
  lessonsController.get
);

module.exports = router;
