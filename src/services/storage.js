import mongoose from 'mongoose';

const mongoUrl = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;mongoose.connect(mongoUrl);

var srtSchema = new mongoose.Schema({
  userId: String,
  teamId: String,
  oauthToken: String
});

export const User = mongoose.model('User', srtSchema);
