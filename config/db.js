const mongoose = require('mongoose');
const config = require('config');

// get the MongoDB connection in the default.json
const db = config.get('mongoURI');

// Connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err.message);
    // exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
