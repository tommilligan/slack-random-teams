import express from 'express';
import rp from 'request-promise';
import rid from 'readable-id';

import { parseCommandText, randomlyAssign } from './logic';
import { delayedResponder } from './responses';
import { formatTeams } from './formats';

import { channelUserProfiles } from './api';
import { verifySlack } from './middleware';

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
  commands.post('/random-teams', function(req, res) {
    const invocation = req.body;
    const teamNames = parseCommandText(invocation.text);
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
  });
  app.use('/api/commands', commands);

  return app;
};

export default applyRoutes;