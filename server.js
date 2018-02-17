// load .env file
require('dotenv-safe').load();

const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise')
const rid = require('readable-id')
const { WebClient } = require('@slack/client');

const { shuffle, chunkArray } = require('./utils');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_OAUTH_TOKEN;
const web = new WebClient(token);

let app = express();
const port = process.env.PORT || 3000;

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Get a router for our endpoints
let router = express.Router();
router.get('/health', function(req, res) {
    res.sendStatus(200);
});

router.post('/random-teams', function(req, res) {
    const invocation = req.body;

    // The text should be a space delimited list of teamnames
    const teamNames = invocation.text.split(' ');
    const channel_id = invocation.channel_id;
    console.info(`Requested teams '${teamNames.join(", ")}' in channel ${channel_id}`)

    // Fire of a fast initial response
    const initialResponse = {
        "response_type": "in_channel",
        "text": `Generating ${teamNames.length} teams...`
    }
    res.json(initialResponse);

    // Set up options for delayed messaging
    let responseOptions = {
        method: 'POST',
        uri: invocation.response_url,
        body: {},
        json: true
    };

    web.channels.info(channel_id)
        .then(res => {
            // Channel info
            return res.channel.members
        })
        .then(memberIds => {
            return Promise.all(memberIds.map(memberId => {
                return web.users.profile.get(memberId)
                    .then(res => {
                        return res.profile.real_name;
                    });
            }))
        })
        .then(memberNames => {
            console.log(memberNames)
            memberNames = shuffle(memberNames)
            console.log(memberNames)
            const chunkedMembers = chunkArray(memberNames, teamNames.length)
            console.log(chunkedMembers)
            // Format data and create lines
            var lines = [];
            lines.push("_Your teams are:_");
            teamNames.forEach((teamName , i) => {
                lines.push(`*${teamName}*`);
                chunkedMembers[i].forEach(memberName => {
                    lines.push(memberName);
                });
            })

            const response = {
                "response_type": "in_channel",
                "text": lines.join("\n")
            }
            responseOptions.body = response;
            rp(responseOptions)
        })
        .catch(e => {
            const errorId = rid();
            const response = {
                "response_type": "in_channel",
                "text": `Sorry, something went wrong. Ref: \`${errorId}\``
            };
            responseOptions.body = response;
            rp(responseOptions)
                .catch(e => {
                    console.error("Failed sending an error to the user");
                    console.error(e);
                })
            console.error(`Error generated with ref: ${errorId}`)
            console.error(e)
        });
});

// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
