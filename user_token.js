const uuid = require('node-uuid');

var token_database = { 'test': true };

module.exports.validate_token = function (token) {
    return (token_database[token] != undefined);
}

module.exports.generate_token = function () {
    var new_token = 'test';
    while (token_database[new_token] != undefined) {
        new_token = uuid();
    }
    token_database[new_token] = true;
    return new_token;
}
