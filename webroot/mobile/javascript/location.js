var display;
var token;

$(function () {
    display = $('.location');
    $('.update').click(updateLocation);

    updateLocation();
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
        utl: '/position',
        method: 'POST',
        data: {
            latitude: position.latitude,
            longitude: position.longitude,
            token: token
        }
    }).fail(function (err) {
        alert('Eror uploading position');
        alert(JSON.stringify(err));
    });
}

function watchErr(err) {
    display.html(JSON.stringify(err));
}
