const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./_config');

// Require the _config.js file to access mongoURI configuration
const config = require('./_config');

// Define routes
let index = require('./routes/index');
let image = require('./routes/image');

// Use the appropriate URI based on your environment (production, development, test)
const mongoURI = process.env.NODE_ENV === 'production' ? config.mongoURI.production : config.mongoURI.development;

// Connecting to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Check for MongoDB connection errors
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Initialize Express app
const app = express();

// View Engine setup (assuming you are using EJS based on your setup)
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies for API requests
app.use(express.json());

// Define routes
app.use('/', index);
app.use('/image', image);

// Start the server only if not in test mode
// if (process.env.NODE_ENV !== 'test') {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{
    console.log(`Server is listening at http://localhost:${PORT}`)
});

module.exports = app; // Export app for testing
