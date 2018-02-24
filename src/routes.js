import express from 'express';

import { verifySlack, attachSlashWebClient } from './middleware';
import { randomTeams, authGrant } from './logic';

const applyRoutes = app => {
  // Metadata - open
  let metadata = express.Router();
  metadata.get('/health', function(req, res) {
    res.sendStatus(200);
  });
  app.use('/api/metadata', metadata);

  // Authorisation - open
  let auth = express.Router();
  // Completes the OAuth flow.
  auth.get('/slack/callback', (req, res, next) => {
    if (!req.query.code) {
      res.sendStatus(401);
    } else {
      next();
    }
  }, authGrant);

  app.use('/api/auth', auth);

  // Commands - require verification
  let commands = express.Router();
  commands.use(verifySlack);
  commands.use(attachSlashWebClient);
  commands.post('/random-teams', randomTeams);
  app.use('/api/commands', commands);

  return app;
};

export default applyRoutes;