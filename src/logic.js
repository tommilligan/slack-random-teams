import rp from 'request-promise';
import rid from 'readable-id';

import { tokenExchange } from './api';
import { splitWords, randomlyAssign } from './utils';
import { delayedResponder } from './responses';
import { formatTeams } from './formats';

import { User } from './services/storage';
import { channelUserProfiles } from './api';

export function authGrant(req, res) {
  // Parse callback data into oauth token exchange format
  var data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };
  tokenExchange(data)
    .then(response => {
      // You are done.
      // If you want to get team info, you need to get the token here
      console.log(response.data);
      let token = response.body.access_token; // Auth token
      console.log(`Got token ${token}`);

      var myData = new User({
        userId: '',
        teamId: '',
        oauthToken: token
      });
      myData.save()
        .catch(e => {
          console.log(`DBError: ${e}`);
          res.status(400).send('Unable to save to database');
        });

      res.sendStatus(200);
    })
    .catch(e => {
      const errorId = rid();
      console.error(`Error generated with ref: ${errorId}`);
      console.error(e);
    });
}

export function randomTeams(req, res) {
  const invocation = req.body;
  const teamNames = splitWords(invocation.text);
  const channel_id = invocation.channel_id;
  console.info(`Requested teams '${teamNames.join(', ')}' in channel ${channel_id}`);

  // Fire off a fast initial response
  const initialBody = {
    response_type: 'in_channel',
    text: `Generating ${teamNames.length} teams...`
  };
  res.json(initialBody);

  // Set up a factory for delayed responses
  const delayedResponse = delayedResponder(invocation.response_url);

  // Get information about the source channel
  channelUserProfiles(channel_id)
    .then(userProfiles => {
      return userProfiles.map(userProfile => userProfile.real_name);
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
