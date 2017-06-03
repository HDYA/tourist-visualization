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
    })
});

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
                for (var uuid in data.positions) {
                    dis = dis.concat(uuid).concat('<br>')
                        .concat('\t').concat(JSON.stringify(data.positions[uuid].position)).concat('<br>')
                        .concat('\t').concat(data.positions[uuid].timestamp).concat('<br>')
                        .concat('<br>');
                }
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
