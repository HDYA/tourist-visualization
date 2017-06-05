positionStorage = {};

module.exports.add_position_record = function (uuid, position, timestamp) {
    if (positionStorage[uuid]) {
        positionStorage[uuid].push({
            'timestamp': timestamp ? timestamp : Date.now(),
            'position': position
        });
    } else {
        positionStorage[uuid] = [{
            'timestamp': timestamp ? timestamp : Date.now(),
            'position': position
        }];
    }
};

module.exports.get_position_record = function () {
    return positionStorage;
}

var actionStorage = {};

module.exports.add_action_record = function (uuid, action, position, timestamp) {
    if (actionStorage[uuid]) {
        actionStorage[uuid].push({
            'timestamp': timestamp ? timestamp : Date.now(),
            'action': action,
            'position': position
        });
    } else {
        actionStorage[uuid] = [{
            'timestamp': timestamp ? timestamp : Date.now(),
            'action': action,
            'position': position
        }];
    }
}

module.exports.get_action_record = function() {
    return actionStorage;
}