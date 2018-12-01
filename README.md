# slack-random-teams
[![license](https://img.shields.io/github/license/tommilligan/slack-random-teams.svg)]()

[![Travis branch](https://img.shields.io/travis/tommilligan/slack-random-teams/master.svg)](https://travis-ci.org/tommilligan/slack-random-teams)
[![codecov](https://codecov.io/gh/tommilligan/slack-random-teams/branch/master/graph/badge.svg)](https://codecov.io/gh/tommilligan/slack-random-teams)
[![David](https://img.shields.io/david/tommilligan/slack-random-teams.svg)](https://david-dm.org/tommilligan/slack-random-teams)

A slack app for generating random teams in your workspace.


## Install

[![Add to Slack](https://platform.slack-edge.com/img/add_to_slack.png)](https://slack.com/oauth/authorize?client_id=316826906230.315357059952&scope=commands,channels:read,groups:read,users:read,team:read) [![Greenkeeper badge](https://badges.greenkeeper.io/tommilligan/slack-random-teams.svg)](https://greenkeeper.io/)

> This app is still under development, and may be unstable


## Use

Call the slash command `random-teams` follwed by a list of space separated team names

```bash
# Organise a group for tasks
/random-teams A B C

# Split a channel to have a debate
/random-teams For Against
```

## Call flow

When installing, the user is redirected to Slack to login and accept permissions.

When permissions are confirmed/denied, the user is redirected to `/api/auth/slack/callback`.

The app then requests a permenant OAuth `token` and persists it to storage, along with `team_id`.

When a slash command is called, the endpoint middleware attaches an authorised Slack api `WebClient` to the request object. A fast response is sent directly back - the web client is then used to access further resourses and respond slowly to the `response_url` provided.
