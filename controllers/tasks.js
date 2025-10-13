const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().collection('task').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('task')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Update
const updateTask = async (req, res) => {
  const userId = new ObjectId(req.params.id);
    const task = {
      title: req.body.title,
      description: req.body.description || '',
      completed: req.body.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  const response = await mongodb
    .getDb()
    .collection('task')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while Updating the task.');}};

  // Create
const createTask = async (req, res) => {
    const task = {
      title: req.body.title,
      description: req.body.description || '',
      completed: req.body.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  const response = await mongodb
    .getDb()
    .collection('task')
    .insertOne(contact);
  if (response.acknowledged) {res.status(201).json(response);} 
  else {res.status(500).json(response.error || 'error while creating the task.');}};


  // Delete
const deleteTask = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('task')
    .deleteOne({ _id: userId });
  console.log(response);
  if (response.deletedCount > 0) {res.status(204).send();} 
  else {res.status(500).json(response.error || 'error while deleating the task.');}};




module.exports = {getAll,getSingle,createTask,updateTask,deleteTask};
