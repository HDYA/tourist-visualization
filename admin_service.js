const uuid = require('node-uuid');

var admin_tokens = {};

function generate_token() {
    var new_token = uuid();
    while (admin_tokens[new_token] != undefined) {
        new_token = uuid();
    }
    admin_tokens[new_token] = true;
    return new_token;
}

module.exports.examine_admin = function (uuid, pwd) {
    if (uuid == 'admin' && pwd === 'admin') {
        return generate_token();
    } else {
        return null;
    }
};

module.exports.examine_admin_token = function (token) {
    return (admin_tokens[token] != undefined);
};
