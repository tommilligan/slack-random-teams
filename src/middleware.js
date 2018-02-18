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
