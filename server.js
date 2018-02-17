const express    = require('express');
const bodyParser = require('body-parser');

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
    const payload = req.body;
    console.log(payload);

    const title = "_Your teams are:_";

    const teamNames = payload.text.split(' ');
    const teamParagraphs = teamNames.map(teamName => {
        return `*${teamName}*`
    })

    const paragraphs = [].concat([title], teamParagraphs)

    const response = {
        "response_type": "in_channel",
        "text": paragraphs.join("\n")
    }
    console.log(response);
    res.json(response);   
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
