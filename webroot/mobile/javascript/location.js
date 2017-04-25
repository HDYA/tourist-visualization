var display;

$(function () {
    display = $('.location');
    $('.update').click(updateLocation);

    updateLocation();
});

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(watchCallback, watchErr);
    } else {
        alert('Location service not supported by your browser');
    }
}

function watchCallback(position) {
    console.log(JSON.stringify(position));
    display.html(JSON.stringify(position));
}

function watchErr(err) {
    display.html(JSON.stringify(err));
}
