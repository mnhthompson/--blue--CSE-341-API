const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb
    .getDb()
    .collection('users')
    .find()
    .toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users', details: err });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
    .getDb()
    .collection('users')
    .findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user', details: err });
  }
};


const createUser = async (req, res) => {
  try {
    const { oauthId, name, email } = req.body;
    if (!oauthId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newUser = { oauthId, name, email };
    const result = await mongodb
    .getDb()
    .collection('users')
    .insertOne(newUser);
    const user = await mongodb
    .getDb()
    .collection('users')
    .findOne({ _id: result.insertedId });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err });
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
    .getDb()
    .collection('users')
    .deleteOne({ _id: userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err });
  }
};

module.exports = { getAllUsers, getUserById, createUser, deleteUser };
