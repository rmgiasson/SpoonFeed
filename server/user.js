const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '/images/spoon.jpg' }, // Add this field
});

module.exports = mongoose.model('User', userSchema);
