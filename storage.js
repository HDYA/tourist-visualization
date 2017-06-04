storage = {};

module.exports.add = function(uuid, position, timestamp) {
    if (storage[uuid]) {
        storage[uuid].push({
            'timestamp': timestamp ? timestamp : Date.now(),
            'position': position
        });
    } else {
        storage[uuid] = [{
            'timestamp': timestamp ? timestamp : Date.now(),
            'position': position
        }];
    }
};

module.exports.get = function() {
    return storage;
}