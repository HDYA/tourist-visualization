var express = require('express');
var app = new express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var storage = require('./storage.js');

var admin_service = require('./admin_service.js');
var user_token = require('./user_token.js');
var location_service = require('./location.js');

app.use('/lib', express.static('webroot/lib'));
app.use('/mobile', express.static('webroot/mobile'));
app.use('/monitor', express.static('webroot/visualization'));

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
        token_exist: user_token.validate_token(req.body.token)
    })
});

/* Location */
app.post('/position', function (req, res) {
    console.log(JSON.stringify(req.body));
    location_service.registe_location(req.body.token, req.body.position, req.body.timestamp);
    res.status(200).send({
        status: 200,
        text: 'OK'
    });
});

/* administrator */
app.post('/admin', function (req, res) {
    var ret = admin_service.examine_admin(req.body.username, req.body.password);
    if (ret == null) {
        res.status(401).send({
            error: 'invalid login info'
        })
    } else {
        res.send({
            token: ret
        })
    }
});

app.get('/position', function (req, res) {
    var ret = admin_service.examine_admin_token(req.body.token);
    if (ret == null) {
        res.status(401).send({
            error: 'invalid admin_service token'
        })
    } else {
        res.send({
            positions: location_service.get_active_visitors()
        })
    }
});

app.listen(8080, function () {
    console.log('Server started on port 8080');
});
