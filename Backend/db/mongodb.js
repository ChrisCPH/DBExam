const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

module.exports = connectMongoDB;