// load .env file
require('dotenv-safe').load();

import mongoose from 'mongoose';

// Get connection info
const mongoUrl = process.env.MONGODB_URI;
// Use promises
mongoose.Promise = global.Promise;

// Set up connection
mongoose.connect(mongoUrl);
//Get the default connection
const db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {  
  console.log('Mongoose connection open');
}); 

// If the connection throws an error
db.on('error',function (err) {  
  console.log('Mongoose connection error: ' + err);
}); 

// When the connection is disconnected
db.on('disconnected', function () {  
  console.log('Mongoose connection disconnected'); 
});

// Data models
// Setup a data model for our users
const srtSchema = new mongoose.Schema({
  userId: String,
  teamId: String,
  oauthToken: String
});

export const User = mongoose.model('User', srtSchema);
