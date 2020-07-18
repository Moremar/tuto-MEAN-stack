// Node built-in packages
const http = require('http');

// Instance of our Express app
const app = require('./backend/app');

// use port 3000 by default (for dev phase) or on port specified in the config
const port = process.env.PORT || 3000;

// start Express app
console.log('Starting Express app on port ' + port);
app.listen(port);