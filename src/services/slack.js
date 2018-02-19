// load .env file
require('dotenv-safe').load();

import { WebClient } from '@slack/client';

export const channelUserProfiles = (webClient, channelId) => {
  // Get channel info
  return webClient.channels.info(channelId)
    .then(res => {
      const memberIds = res.channel.members;
      // For each channel member, enrich to a profile
      return Promise.all(memberIds.map(memberId => {
        return webClient.users.profile.get({user: memberId})
          .then(res => {
            return res.profile;
          });
      }));
    });
};

export const tokenExchange = (code) => {
  // Get channel info
  return new WebClient().oauth.access(
    process.env.SLACK_CLIENT_ID,
    process.env.SLACK_CLIENT_SECRET,
    code
  )
    .then(res => res.access_token);
};

