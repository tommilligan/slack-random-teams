// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;        // set our port

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log(req.body);
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/', function(req, res) {
    console.log(req.body);
    res.json({ response: req.data });   
});


router.post('/random-teams', function(req, res) {
    const payload = req.body;
    console.log(payload);

    const title = "*Your teams are:*";

    const teamNames = payload.text.split(' ');
    const teamParagraphs = teamNames.map(teamName => {
        return `_${teamName}_`
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
