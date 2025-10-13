const { getDb } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getTasks = async (req, res) => {
  try {
    const db = getDb();
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const db = getDb();
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(req.params.id) });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('tasks').insertOne({
      title: req.body.title,
      description: req.body.description || '',
      completed: req.body.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'Task not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
