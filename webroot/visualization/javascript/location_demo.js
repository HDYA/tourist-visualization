var display, map;
var token;

var cameraHeight = 50;

var scene, camera;
var visitors = {};
var positionStartPoint;

$(function () {
    display = $('.display');

    display.html('Logging in');
    $.ajax({
        url: '/admin',
        method: 'POST',
        data: {
            username: prompt('Admin Username'),
            password: prompt('Admin Password'),
        },
        success: function (data) {
            display.html('Token obtained:', data.token);
            token = data.token;
            startQuery();
        },
        fail: function (err) {
            alert('Error obtaining administrator token');
            alert(JSON.stringify(err));
        }
    });

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(0, cameraHeight, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var groundGeometry = new THREE.PlaneGeometry(1200, 1200, 1, 1);
    ground = new THREE.Mesh(groundGeometry, new THREE.MeshLambertMaterial({
        color: 0x000000
    }));
    ground.position.y = -10;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    var axisHelper = new THREE.AxisHelper(800);
    scene.add(axisHelper);

    var gridHelper = new THREE.GridHelper(800, 50);
    gridHelper.position = new THREE.Vector3(0, 0, 0);
    gridHelper.rotation = new THREE.Euler(0, 0, 0);
    scene.add(gridHelper);

    var gridHelper2 = gridHelper.clone();
    gridHelper2.rotation = new THREE.Euler(Math.PI / 2, 0, 0);
    scene.add(gridHelper2);

    var gridHelper3 = gridHelper.clone();
    gridHelper3.rotation = new THREE.Euler(Math.PI / 2, 0, Math.PI / 2);
    scene.add(gridHelper3);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var render = function () {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    };

    render();
});

function converter(position) {
    var latitude = position.latitude;
    position.latitude *= 60 * 1852;
    position.longitude *= 60 * 1852 * Math.cos(latitude / 180 * Math.PI);
}

function getRandomColor() {
    return '0x' + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}

function addVisitor(uuid, position) {
    if (visitors[uuid] != undefined) {
        return;
    }
    converter(position);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    visitors[uuid] = cube;
}

function moveVisitor(uuid, position) {
    if (visitors[uuid] == undefined) {
        return;
    } else {
        converter(position);
        console.log('visitor position:', JSON.stringify(position));

        if (positionStartPoint == undefined) {
            positionStartPoint = {
                longitude: position.longitude,
                latitude: position.latitude,
            }
        }

        visitors[uuid].position.set(position.longitude - positionStartPoint.longitude, position.altitude, position.latitude - positionStartPoint.latitude);
    }
}

function startQuery() {
    setInterval(function () {
        $.ajax({
            url: '/position',
            method: 'GET',
            data: {
                token: token,
            },
            success: function (data) {
                var dis = '';
                var count = 0;
                var longitudeCenter = 0.0;
                var latitudeCenter = 0.0;

                for (var uuid in data.positions) {
                    dis = dis.concat(uuid).concat('<br>')
                        .concat('\t').concat(JSON.stringify(data.positions[uuid].position)).concat('<br>')
                        .concat('\t').concat(data.positions[uuid].timestamp).concat('<br>')
                        .concat('<br>');

                    if (visitors[uuid] == undefined) {
                        addVisitor(uuid, {
                            longitude: data.positions[uuid].position.longitude,
                            latitude: data.positions[uuid].position.latitude,
                            altitude: data.positions[uuid].position.altitude
                        });
                    }
                    moveVisitor(uuid, {
                        longitude: data.positions[uuid].position.longitude,
                        latitude: data.positions[uuid].position.latitude,
                        altitude: data.positions[uuid].position.altitude
                    });

                    count++;
                    longitudeCenter += data.positions[uuid].position.longitude;
                    latitudeCenter += data.positions[uuid].position.latitude;
                }

                if (count == 0) {
                    return;
                }

                longitudeCenter /= count;
                latitudeCenter /= count;

                console.log('data received:', JSON.stringify(data));
                display.html(dis);
            },
            fail: function (err) {
                alert('Error obtaining active visitors');
                alert(JSON.stringify(err));
            }
        })
    }, 1000)
}
