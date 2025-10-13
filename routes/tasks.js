const express = require("express");
const router = express.Router();
const {
  getAll,
  getSingle,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/tasks.js");

router.get("/", getAll);
router.get("/:id", getSingle);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;

