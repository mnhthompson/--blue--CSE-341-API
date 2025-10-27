const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const jwt = require('jsonwebtoken');

// Hardcoded JWT secret
const JWT_SECRET = 'carrot';


function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user; 
    next();
  });
}

// GET routes (public)
router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getSingle);

// POST route (protected)
router.post('/', ensureAuthenticated, tasksController.createTask);
//  PUT route (protected)
router.put('/:id', ensureAuthenticated, tasksController.updateTask);
// DELETE route (protected)
router.delete('/:id', ensureAuthenticated, tasksController.deleteTask);

module.exports = router;
