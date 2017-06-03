var display;
var token;

$(function () {
    display = $('.location');
    $('.update').click(updateLocation);
    if (window.localStorage.tvs_user_token != undefined) {
        token = window.localStorage.tvs_user_token;
        display.html('Local token loaded');
        updateLocation();
    } else {
        display.html('Requesting user token');
        $.ajax({
            url: '/token',
            method: 'GET',
            success: function (data) {
                console.log(JSON.stringify(data));
                display.html('Token obtained:' + data.new_token);
                window.localStorage.tvs_user_token = data.new_token;
                token = data.new_token;
                updateLocation();
            },
            error: function (err) {
                alert('Error obtaining user token');
                alert(JSON.stringify(err));
            }
        });
    }
});

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(watchCallback, watchErr, {
            timeout: 15000,
            enableHighAccuracy: true
        });
    } else {
        alert('Location service not supported by your browser');
    }
}

function watchCallback(position) {
    var currentPosition = {
        position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
        },
        timestamp: position.timestamp,
        token: token
    };

    console.log(JSON.stringify(currentPosition));
    display.html(JSON.stringify(currentPosition));

    $.ajax({
        url: '/position',
        method: 'POST',
        dataType:"json",
        data: currentPosition
    }).fail(function (err) {
        alert('Error uploading position');
        alert(JSON.stringify(err));
    });

    window.map.setCenter(new BMap.Point(currentPosition.position.longitude, currentPosition.position.latitude));
    window.map.removeOverlay(currentMarkerOverlay);
    markerArr[0].point = currentPosition.position.longitude + '|' + currentPosition.position.latitude;
    addMarker();
}

function watchErr(err) {
    alert(err.message);
    display.html('Error: ' + JSON.stringify(err));
}
