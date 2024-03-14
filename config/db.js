const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://roshanlms:roshankr123@cluster0.vmjig2e.mongodb.net/lms?retryWrites=true&w=majority');
    console.log('Connected to Database');
  } catch (error) {
    console.error('Error connecting to Database:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
