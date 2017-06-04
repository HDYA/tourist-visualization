var speedEps = 0.7;
var edgeWeightEps = 10;

function distance(position1, position2) {
    return Math.sqrt(
        Math.pow((position1.latitude - position2.latitude) * 60 * 1852, 2)
        + Math.pow((position1.longitude - position2.longitude) * 60 * 1862 * Math.cos(position.latitude / 180 * 3.141592654), 2)
        + Math.pow(position1.altitude - position2.altitude, 2)
    );
}

function filterSlowPoints(record) {
    var result = [];
    for (var uuid in record) {
        var points = [];
        var totalSpeed = 0.0;
        for (var id in record[uuid]) {
            if (id == 0) {
                continue;
            } else {
                var speed = distance(record[uuid][id].position, record[uuid][id - 1].position) / (record[uuid][id].timestamp - record[uuid][id - 1].timestamp);
                totalSpeed += speed;
                points.push({
                    position: {
                        latitude: (record[uuid][id].position.latitude + record[uuid][id - 1].position.latitude) >> 1,
                        longitude: (record[uuid][id].position.longitude + record[uuid][id - 1].position.longitude) >> 1,
                        altitude: (record[uuid][id].position.altitude + record[uuid][id - 1].position.altitude) >> 1,
                    },
                    speed: speed,
                    uuid: uuid,
                })
            }
        }
        totalSpeed /= points.length;
        for (var id in points) {
            if (points[id].speed < totalSpeed * speedEps) {
                result.push(points[id]);
            }
        }
    }
    return result;
}

function kruskalFindAncestor(parent, id) {
    if (parent[id] == id) {
        return id;
    } else {
        parent[id] = findAncestor(parent, parent[id]);
        return parent[id];
    }
}

function kruskalLikeFiltering(points) {
    var edges = [];
    for (var id1 in points) {
        for (var id2 in points) {
            if (id1 == id2) {
                continue;
            } else {
                edges.push({
                    endpoint1: id1,
                    endpoint2: id2,
                    weight: distance(points[id1].position, points[id2].position),
                })
            }
        }
    }

    edges.sort(new function(edge1, edge2) {
        return edge1.weight - edge2.weight;
    });

    var parent = [];
    for(var pid in points) {
        parent.push(pid);
    }

    var edgeCount = 0;
    for(var eid in edges) {
        if ((edgeCount == points.length - 1) || (edges[eid].weight >= edgeWeightEps)) {
            break;
        }
        var ancestor1 = findAncestor(parent, edges[eid].endpoint1);
        var ancestor2 = findAncestor(parent, edges[eid].endpoint2);
        if (ancestor1 == ancestor2) {
            continue;
        } else {
            parent[ancestor2] = ancestor1;
            edgeCount++;
        }
    }

    var cluster = {};
    for (var index in points) {
        var ancestor = findAncestor(parent, index);
        if (cluster[ancestor] == undefined) {
            cluster[ancestor] = {
                latitude: points[index].latitude,
                longitude: points[index].longitude,
                altitude: points[index].altitude,
                pointCount: 1,
            }
        } else {
            cluster[ancestor].latitude += points[index].latitude;
            cluster[ancestor].longitude += points[index].longitude;
            cluster[ancestor].altitude += points[index].altitude;
            cluster[ancestor].pointCount++;
        }
    }

    var result = [];
    for (var clusterID in cluster) {
        result.push({
            latitude: cluster[clusterID].latitude / cluster[clusterID].pointCount,
            longitude: cluster[clusterID].longitude / cluster[clusterID].pointCount,
            altitude: cluster[clusterID].altitude / cluster[clusterID].pointCount,
        })
    }

    return result;
}

module.exports.analysisSlowPoints = function(record) {
    var slowPoints = filterSlowPoints(record);
    return kruskalLikeFiltering(slowPoints);
}