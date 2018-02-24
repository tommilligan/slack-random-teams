import { WebClient } from '@slack/client';

import { deserializeUser } from './services/storage';

export function verifySlack (req, res, next) {
  if (req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    // If not sent by Slack, return Unauthorized
    console.warn('Request verification failed. Not from Slack.');
    res.sendStatus(401);
  } else {
    console.log('Verified request was from Slack');
    next();
  }
}

export function attachSlashWebClient (req, res, next) {
  const {team_id} = req.body;
  deserializeUser(team_id)
    .then(user => {
      console.log(`Setting up web client for ${team_id}`);
      const webClient = new WebClient(user.access_token);
      req.webClient = webClient;
      next();
    })
    .catch(e => {
      console.error(e);
      const body = {
        response_type: 'ephemeral',
        text: 'This workspace is unauthorised. Please try reinstalling the app.'
      };
      // I'd respond with a 401 but Slack doesn't allow it
      res.json(body);
    });
}
