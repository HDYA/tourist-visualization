var display;
var token;

$(function () {
    display = $('.display');

    display.html('Logging in');
    $.ajax({
        url: '/admin',
        method: 'POST',
        data: {
            username: prompt('Admin Username'),
            password: prompt('Admin Password'),
        }
    }).success(function (data) {
        display.html('Token obtained:', data.token);
        token = data.token;
        startQuery();
    }).fail(function (err) {
        alert('Error obtaining administrator token');
        alert(JSON.stringify(err));
    });
});

function startQuery() {
    setTimeout(function () {
        $.ajax({
            url: '/position',
            method: 'GET',
            data: {
                token: token,
            }
        }).success(function (data) {
            var dis = '';
            for (var uuid in data) {
                dis = dis.concat(uuid).concat('<br>')
                    .concat('\t').concat(JSON.stringify(data[uuid].location)).concat('<br>')
                    .concat('\t').concat(data[uuid].timestamp).concat('<br>')
                    .concat('<br>');
            }
            display.html(dis);
        }).fail(function (err) {
            alert('Error obtaining active visitors');
            alert(JSON.stringify(err));
        });
    }, 10000)
}
