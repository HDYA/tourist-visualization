﻿var display;
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
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        token: token
    };

    console.log(JSON.stringify(currentPosition));
    display.html(JSON.stringify(currentPosition));

    $.ajax({
        url: '/position',
        method: 'POST',
        dataType:"json",
        data: position
    }).fail(function (err) {
        alert('Error uploading position');
        alert(JSON.stringify(err));
    });

    window.map.setCenter(new BMap.Point(currentPosition.longitude, currentPosition.latitude));
    window.map.removeOverlay(currentMarkerOverlay);
    markerArr[0].point = currentPosition.longitude + '|' + currentPosition.latitude;
    addMarker();
}

function watchErr(err) {
    alert(err.message);
    display.html('Error: ' + JSON.stringify(err));
}
