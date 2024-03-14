// models/adminModel.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other fields as needed for your admin model
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
