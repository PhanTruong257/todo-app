const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import tất cả routes từ file index routes
const routes = require('./src/routes');
app.use('/api', routes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000, () => console.log('Server started on port 5000'));
}).catch((err) => console.error(err));
