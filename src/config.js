import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;

const applyConfig = app => {
  // for parsing application/json
  app.use(bodyParser.json());
  // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  // logging
  app.use(morgan('combined'));

  // Authorization
  passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
  }, (accessToken, scopes, team, extra, profiles, done) => {
    done(null, profiles.user);
  }));
  app.use(passport.initialize());

  return app;
};

export default applyConfig;