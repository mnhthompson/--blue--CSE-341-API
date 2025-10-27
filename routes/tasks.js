const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// GET
router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getSingle);


// POST router.post('/', tasksController.createTask);

router.post('/', ensureAuthenticated, tasksController.createTask);

// PUT router.put('/:id', tasksController.updateTask);

router.put('/:id', ensureAuthenticated, tasksController.updateTask);

// DELETE router.delete('/:id', tasksController.deleteTask);

router.delete('/:id', ensureAuthenticated, tasksController.deleteTask);


module.exports = router;

