const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(` Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  }
  console.error(` Server error: ${error.message}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n Shutting down server...');
  server.close(() => {
    console.log(' Server closed');
    process.exit(0);
  });
});