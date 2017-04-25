var express = require('express');
var app = new express();

var user_token = require('./user_token.js');
var location_service = require('location.js');

app.use('/mobile', express.static('webroot/mobile'));

/* Test */
app.get('/test', function (req, res) {
    res.send('Hello ');
});

/* Token */
app.get('/token', function (req, res) {
    res.send({
        new_token: user_token.generate_token()
    })
});

app.post('/token', function (req, res) {
    res.send({
        token_exist: user_token.validate_token(req.params.token)
    })
});

/* Location */
app.post('position', function (req, res) {
    location_service.registe_location(req.params.token, {
        latitude: req.params.latitude,
        longitude: req.params.longitude
    })
});

app.listen(8080, function () {
    console.log('Server started on port 8080');
});
