var storage = require('./storage.js');

module.exports.register_action = function(uuid, acton, position, timestamp) {
    storage.add_action_record(uuid, acton, position, timestamp);
}

module.exports.get_action = function() {
    return storage.get_action_record();
}