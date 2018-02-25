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
  access_token: String,
  team_id: String
});

const User = mongoose.model('User', srtSchema);

/**
 * Looks up a user record by team_id.
 * Permissions are scoped by team, so any person's token will do.
 * @param {String} team_id Team id of the user
 * @returns {Promise<user>} The user object if found,
 * @throws {Error} If a user is not found, or there was an error with the service
 */
export function deserializeUser(team_id) {
  const q = {team_id};
  console.log(`Deserialising user for team ${team_id}`);
  return User.findOne(q).exec()
    .then(user => {
      if (user === null) {
        throw Error(`No user found for ${team_id}`);
      } else {
        return user.toObject();
      }
    });
}

/**
 * Serialise a user to storage.
 * @param {Object} user User object to serialise. See `User` for definition
 * @returns {Promise<user>} Promise that resolves the saved User model.
 */
export function serializeUser(user) {
  const {team_id} = user;
  console.log(`Saving access token for team ${team_id}`);
  return User.remove({team_id: user.team_id}).exec()
    .then(() => {
      return new User(user).save();
    });
}