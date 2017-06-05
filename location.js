var storage = require('./storage.js');

active_visitors = {};

module.exports.registe_location = function (uuid, position, timestamp) {
    if (active_visitors[uuid] != undefined) {
        storage.add_position_record(uuid, active_visitors[uuid].position, active_visitors[uuid].timestamp)
    }
    active_visitors[uuid] = {
        timestamp: timestamp ? timestamp : Date.now(),
        position: position
    };
}

module.exports.get_active_visitors = function () {
    return active_visitors;
}

setTimeout(function () {
    for (var uuid in active_visitors) {
        if (active_visitors[uuid].timestamp + 300000 < Date.now()) {
            // no longer active 
            set_inactive(uuid);
        }
    }
}, 300000);

module.exports.set_inactive = function set_inactive(uuid) {
    delete active_visitors[uuid];
}