import bodyParser from 'body-parser';
import session from 'express-session';
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

  // When using Passport's session functionality, you need to tell passport how to
  // serialize/deserialize the user object to the session store
  passport.serializeUser((user, done) => {
    // Simplest possible serialization
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser((json, done) => {
    // Simplest possible deserialization
    done(null, JSON.parse(json));
  });
  app.use(session({
    cookie: {
      // secure should be enabled in a production app, but disabled for simplicity
      // secure: true,
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.CLIENT_SECRET,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  return app;
};

export default applyConfig;