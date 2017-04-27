const uuid = require('node-uuid');

var admin_service_tokens = {};

function generate_token() {
    var new_token = uuid();
    while (token_database[new_token] != undefined) {
        new_token = uuid();
    }
    admin_service_tokens[new_token] = true;
    return new_token;
}

module.export.examine_admin = function (uuid, pwd) {
    if (uuid == 'admin_service' && pwd === 'admin_service') {
        return generate_token();
    } else {
        return null;
    }
}

module.export.examine_admin_token = function (token) {
    return (admin_service_tokens[token] != undefined);
}
