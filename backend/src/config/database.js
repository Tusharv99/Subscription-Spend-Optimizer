const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are for better performance and stability
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected Successfully!`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Cluster: ${conn.connection.host.split('.')[0]}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(` MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log(' MongoDB reconnected');
    });

  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.error(`Please check your MONGODB_URI in .env file`);
    process.exit(1);
  }
};

module.exports = connectDB;