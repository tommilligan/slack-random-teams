import { WebClient } from '@slack/client';

import { User } from './services/storage';

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
  const q = {team_id};
  console.log(`Getting record for team ${team_id}`);
  User.findOne(q).exec()
    .then(user => {
      if (user === null) {
        console.log(`No record found for ${team_id}`);
        const body = {
          response_type: 'ephemeral',
          text: 'This workspace is unauthorised. Please try reinstalling the app.'
        };
        // I'd respond with a 401 but Slack doesn't allow it
        res.json(body);
      } else {
        console.log(`Setting up web client for ${team_id}`);
        const webClient = new WebClient(user.access_token);
        req.webClient = webClient;
        next();
      }
    });
}
