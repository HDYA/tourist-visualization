var express = require('express');
var app = new express();

var admin_service = require('admin_service.js');
var user_token = require('user_token.js');
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
app.post('/position', function (req, res) {
    location_service.registe_location(req.params.token, {
        latitude: req.params.latitude,
        longitude: req.params.longitude
    })
});

/* admin_serviceistrator */
app.post('/admin_service', function (req, res) {
    var ret = admin_service.examine_admin(req.params.username, req.params.password);
    if (ret == null) {
        res.status(401).send({
            error: 'invalid login info'
        })
    } else {
        res.send({
            token: ret
        })
    }
})

app.get('/position', function (req, res) {
    var ret = admin_service.examine_admin_token(req.params.token);
    if (ret == null) {
        res.status(401).send({
            error: 'invalid admin_service token'
        })
    } else {
        res.send({
            positions: location_service.get_active_visitors()
        })
    }
})

app.listen(8080, function () {
    console.log('Server started on port 8080');
});
