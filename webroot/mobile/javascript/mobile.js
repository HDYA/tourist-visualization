/**
 * Created by HDYA-BackFire on 2017/05/23 with IntelliJ IDEA.
 * Part of Project tourist-visualization
 * Make decision and don't look back
 * Like an angel you fly into my world, my snow white queen
 */

var $shader, $adviceBox, $interactBox;

$(function() {
    initMap();//创建和初始化地图
    $shader = $('.shader');
    $adviceBox = $('.advice_box');
    $interactBox = $('.interact_box');

    $shader.hide();
    $shader.click(hideAll);

    $adviceBox.hide();
    $interactBox.hide();

    $('.advice').click(showAdvice);
    $('.advice_box div').click(function() {
        $.ajax(

        );
        hideAll();
    });
});

function showAdvice() {
    $shader.show(true);
    $adviceBox.show(true);
}

function showInteract() {
    $shader.show(true);
    $interactBox.show(true);
}

function hideAll() {
    $shader.hide(true);
    $adviceBox.hide(true);
    $interactBox.hide(true);
}