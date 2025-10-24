
require('dotenv').config();
const http = require('http');

const app = require('./app'); 
const connectDB = require('./config/db'); 

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB and start server:", err);
    process.exit(1);
  }
})();

