// load .env file
require('dotenv-safe').load();

import { WebClient } from '@slack/client';

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_OAUTH_TOKEN;
const web = new WebClient(token);

export const channelUserProfiles = (channelId) => {
  // Get channel info
  return web.channels.info(channelId)
    .then(res => {
      const memberIds = res.channel.members;
      // For each channel member, enrich to a profile
      return Promise.all(memberIds.map(memberId => {
        return web.users.profile.get({user: memberId})
          .then(res => {
            return res.profile;
          });
      }));
    });
};

export const tokenExchange = (channelId) => {
  // Get channel info
  return web.channels.info(channelId)
    .then(res => {
      const memberIds = res.channel.members;
      // For each channel member, enrich to a profile
      return Promise.all(memberIds.map(memberId => {
        return web.users.profile.get({user: memberId})
          .then(res => {
            return res.profile;
          });
      }));
    });
};

