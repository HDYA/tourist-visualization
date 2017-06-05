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
