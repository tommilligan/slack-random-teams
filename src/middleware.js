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
  const q = {team_id: req.body.team_id};
  console.log(`Requesting team: ${JSON.stringify(q)}`);
  User.findOne(q).exec()
    .then(user => {
      console.log(user);
      const webClient = new WebClient(user.access_token);
      req.webClient = webClient;
      next();
    });
}
