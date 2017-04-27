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
            method: 'GET'
        }).success(function (data) {
            display.html('Token obtained:', data.new_token);
            window.localStorage.tvs_user_token = data.new_token;
            token = data.new_token;
            updateLocation();
        }).fail(function (err) {
            alert('Error obtaining user token');
            alert(JSON.stringify(err));
        });
    }
});

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(watchCallback, watchErr, {
            timeout: 15000,
            enableHighAccuracy: true
        });
    } else {
        alert('Location service not supported by your browser');
    }
}

function watchCallback(position) {
    console.log(JSON.stringify(position));
    display.html(JSON.stringify(position));

    $.ajax({
        url: '/position',
        method: 'POST',
        data: {
            latitude: position.latitude,
            longitude: position.longitude,
            token: token
        }
    }).fail(function (err) {
        alert('Error uploading position');
        alert(JSON.stringify(err));
    });
}

function watchErr(err) {
    display.html(JSON.stringify(err));
}
