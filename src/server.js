// load .env file
require('dotenv-safe').load();

import express from 'express';
import bodyParser from 'body-parser';
import rp from 'request-promise';
import rid from 'readable-id';
import { WebClient } from '@slack/client';

import { parseCommandText, randomlyAssign } from './logic';

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_OAUTH_TOKEN;
const web = new WebClient(token);

let app = express();

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Get a router for our endpoints
let router = express.Router();
router.get('/health', function(req, res) {
  res.sendStatus(200);
});


/**
 * Returns options for arequest JSON POST response
 * @param {String} url 
 * @param {Object} body 
 */
const response = (url, body) => {
  const responseOptions = {
    method: 'POST',
    uri: url,
    body: body,
    json: true
  };
  return responseOptions;
};

/**
 * Returns a closure for generating multiple JSON POST requests to the same URL
 * @param {String} url 
 */
const delayedResponder = url => {
  const delayedResponse = body => {
    return response(url, body);
  };
  return delayedResponse;
};

let getUserName = (memberId) => {
  return web.users.profile.get({user: memberId})
    .then(res => {
      return res.profile.real_name;
    });  
};

router.post('/random-teams', function(req, res) {
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
  web.channels.info(channel_id)
    // Process the channel to get a list of usernames
    .then(res => {
      const memberIds = res.channel.members;
      return Promise.all(memberIds.map(memberId => {
        return getUserName(memberId);
      }));
    })
    // Actually do team assignment
    .then(memberNames => {
      const teams = randomlyAssign(teamNames, memberNames);
      
      // Format data and create lines
      var lines = [];
      lines.push('_Your teams are:_');
      teams.forEach(([teamName, memberNames]) => {
        lines.push(`*${teamName}*`);
        memberNames.forEach(memberName => {
          lines.push(memberName);
        });
      });

      const body = {
        response_type: 'in_channel',
        text: lines.join('\n')
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

// all of our routes will be prefixed with /api
app.use('/api', router);

export default app;