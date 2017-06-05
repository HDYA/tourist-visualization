var display, map;
var token;

var camera;
var visitors = {};

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

    var scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    var render = function () {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    };

    render();
});

function converter(position) {
    position.latitude *= 60 * 1852;
    position.longitude *= 60 * 1852 * Math.cos(position.latitude / 180 * 3.141592654);
}

function addVisitor(uuid, position) {
    if (visitors[uuid] != undefined) {
        return;
    }
    converter(position);
    var geometry = new THREE.BoxGeometry(position.longitude, position.latitude, position.altitude);
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
        visitors[uuid].position.x = position.longitude;
        visitors[uuid].position.y = position.latitude;
        visitors[uuid].position.z = position.altitude;
    }
}

function startQuery() {
    setTimeout(function () {
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
                        addVisitor(uuid, data.positions[uuid].position);
                    } else {
                        moveVisitor(uuid, data.positions[uuid].position);
                    }

                    count++;
                    longitudeCenter += data.positions[uuid].position.longitude;
                    latitudeCenter += data.positions[uuid].position.latitude;
                }

                longitudeCenter /= count;
                latitudeCenter /= count;
                camera.position.x = longitudeCenter;
                camera.position.y = latitudeCenter;

                console.log(JSON.stringify(data));
                display.html(dis);
            },
            fail: function (err) {
                alert('Error obtaining active visitors');
                alert(JSON.stringify(err));
            }
        })
    }, 1000)
}
