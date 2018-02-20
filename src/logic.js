import rp from 'request-promise';
import rid from 'readable-id';
import { WebClient } from '@slack/client';

import { splitWords, randomlyAssign } from './utils';
import { delayedResponder } from './responses';
import { formatTeams } from './formats';

import { User } from './services/storage';
import { channelUsers, tokenExchange } from './services/slack';

export function authGrant(req, res) {
  // Parse callback data into oauth token exchange format
  tokenExchange(req.query.code)
    .then(access_token => {
      const web = new WebClient(access_token);
      web.team.info()
        .then(response => {
          const team_id = response.team.id;
          const user = new User({
            access_token,
            team_id
          });
          const q = {team_id};
          console.log(`Saving access token for team ${team_id}`);
          User.remove(q).exec()
            .then(() => {
              user.save();
              res.redirect(`https://${response.team.domain}.slack.com`);
            });
        });
    })
    .catch(e => {
      console.error(`Error during token exchenge: ${e}`);
      res.sendStatus(500);
    });
}

export function randomTeams(req, res) {
  const invocation = req.body;
  const teamNames = splitWords(invocation.text);
  const {channel_id} = invocation;
  console.info(`Requested teams '${teamNames.join(', ')}' in channel ${channel_id}`);

  // Get an authorised webclient
  const webClient = req.webClient;
  // Otherwise, fire off a fast initial response
  const initialBody = {
    response_type: 'in_channel',
    text: `Generating ${teamNames.length} teams...`
  };
  res.json(initialBody);

  // Set up a factory for delayed responses
  const delayedResponse = delayedResponder(invocation.response_url);

  // Get information about the source channel
  channelUsers(webClient, channel_id)
    .then(users => {
      return users.map(user => user.profile.real_name);
    })
    // Actually do team assignment
    .then(memberNames => {
      const teams = randomlyAssign(teamNames, memberNames);
      const teamText = formatTeams(teams);
      const body = {
        response_type: 'in_channel',
        text: teamText
      };
      rp(delayedResponse(body));
    })
    // If we raise any errors, send a message back to the channel
    .catch(e => {
      const errorId = rid();
      console.error(`Error generated with ref: ${errorId}`);
      console.error(e);
      let body = {
        response_type: 'in_channel',
        text: `Sorry, something went wrong.\nRef: \`${errorId}\``
      };
      rp(delayedResponse(body))
        .catch(e => {
          console.error('Failed sending an error to the user');
          console.error(e);
        });
    });
}
