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
  authController.requireAdmin,
  lessonsController.new
);

// router.post('/:id/update',
//   authController.authenticate,
//   authController.requireAdmin,
//   lessonsController.update
// );

router.delete('/:id/delete',
  authController.authenticate,
  authController.requireAdmin,
  lessonsController.delete
);

router.get('/:id',
  authController.authenticate,
  authController.requireAdmin,
  lessonsController.get
);

module.exports = router;
