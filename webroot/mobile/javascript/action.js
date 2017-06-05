/**
 * Created by HDYA-BackFire on 2017/06/04 with IntelliJ IDEA.
 * Part of Project tourist-visualization
 * Make decision and don't look back
 * Like an angel you fly into my world, my snow white queen
 */

var $motion;
var alpha, beta, gamma, ax, ay, az, alphaRate, betaRate, gammaRate;

$(function () {
    $motion = $('.motion');

    $(window).on('deviceorientation', function (e) {
        var o = e.originalEvent;

        alpha = o.alpha;
        beta = o.beta;
        gamma = o.gamma;

        updateDisplay();
    });

    $(window).on('devicemotion', function (e) {
        var m = e.originalEvent;

        ax = m.acceleration.x;
        ay = m.acceleration.y;
        az = m.acceleration.z;

        alphaRate = m.rotationRate.alpha;
        betaRate = m.rotationRate.beta;
        gammaRate = m.rotationRate.gamma;

        updateDisplay();
        detectPhotographing();
    });
});

function updateDisplay() {
    $motion.html(''
        .concat('Alpha: ').concat(alpha).concat('<br>')
        .concat('Beta: ').concat(beta).concat('<br>')
        .concat('Gamma: ').concat(gamma).concat('<br>')
        .concat('Cosine Beta: ').concat(Math.abs(Math.cos(beta / 180 * pi))).concat('<br>')
        .concat('Acceleration X: ').concat(ax).concat('<br>')
        .concat('Acceleration Y: ').concat(ay).concat('<br>')
        .concat('Acceleration Z: ').concat(az).concat('<br>')
        .concat('Acceleration: ').concat(Math.sqrt(ax * ax + ay * ay + az * az)).concat('<br>')
        .concat('RotationRate Alpha: ').concat(alphaRate).concat('<br>')
        .concat('RotationRate Beta: ').concat(betaRate).concat('<br>')
        .concat('RotationRate Gamma: ').concat(gammaRate).concat('<br>')
        .concat('PhotographingTimestamp: ').concat(photographingTimestamp).concat('<br>')
        .concat('PhotographingTime: ').concat(Date.now() - photographingTimestamp).concat('<br>')
        .concat('PhotographingDetected: ').concat(photographingDetected).concat('<br>')
    )
}

var azEps = 0.5;
var betaEps = 0.3;

var pi = 3.141592654;

var photographingDetected = false;
var photographingTimestamp = 0;
var photographingTimeEps = 2000;
var photographingSent = false;

function detectPhotographing() {
    if (Math.sqrt(ax * ax + ay * ay + az * az) > azEps) {
        photographingDetected = false;
        photographingSent = false;
        return;
    }

    var arcb = beta / 180 * pi;
    var arcg = gamma / 180 * pi;

    var cosb = Math.cos(arcb);
    var sinb = Math.sin(arcb);
    var cosg = Math.cos(arcg);
    var sing = Math.sin(arcg);

    if (Math.abs(cosb) <= betaEps) {
        if (photographingDetected) {
            if (Date.now() - photographingTimestamp >= photographingTimeEps) {
                if (photographingSent) {
                    return;
                } else {
                    sendAction({
                        id: 0,
                        description: 'photographing'
                    });
                    photographingSent = true;
                }
            }
        } else {
            photographingDetected = true;
            photographingSent = false;
            photographingTimestamp = Date.now();
        }
    } else {
        photographingDetected = false;
    }
}

function sendAction(action) {
    $.ajax({
        url: '/action',
        method: 'POST',
        data: {
            token: token,
            position: currentPosition.position,
            action: action,
            timestamp: Date.now()
        },
        error: function (err) {
            console.error('Error uploading user action');
            console.error(JSON.stringify(err));
        }
    });
    alert('action detected!');
}