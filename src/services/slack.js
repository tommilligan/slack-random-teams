// load .env file
require('dotenv-safe').load();

import { WebClient } from '@slack/client';

export const channelUsers = (webClient, channelId) => {
  // Get channel info
  return webClient.channels.info(channelId)
    .then(res => {
      const memberIds = res.channel.members;
      console.log(`Channel member ids: ${memberIds}`);
      // For each channel member, enrich to a profile
      return Promise.all(memberIds.map(memberId => {
        return webClient.users.info(memberId)
          .then(res => {
            return res.user;
          });
      }))
        .catch(e => {
          console.error(`Error getting users: ${e}`);
          throw e;
        });
    })
    .catch(e => {
      console.error(`Error getting channel info: ${e}`);
      throw e;
    });
};

export const tokenExchange = (code) => {
  // Get channel info
  return new WebClient().oauth.access(
    process.env.SLACK_CLIENT_ID,
    process.env.SLACK_CLIENT_SECRET,
    code
  )
    .then(res => res.access_token)
    .catch(e => {
      console.error(`Error during token exchenge: ${e}`);
      throw e;
    });
};

