import express from 'express';

import { verifySlack } from './middleware';
import { randomTeams } from './logic';

const applyRoutes = app => {
  // Metadata - open
  let metadata = express.Router();
  metadata.get('/health', function(req, res) {
    res.sendStatus(200);
  });
  app.use('/api/metadata', metadata);

  // Commands - require verification
  let commands = express.Router();
  commands.use(verifySlack);
  commands.post('/random-teams', randomTeams);
  app.use('/api/commands', commands);

  return app;
};

export default applyRoutes;