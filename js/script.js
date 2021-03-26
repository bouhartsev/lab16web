$(document).ready(function(){
    function toogleVolume() {
        $( "#btnMute" ).toggle();
        $( "#btnVolume" ).toggle();
    }
    function tooglePlay() {
        $( "#btnPlay" ).toggle(0);
        $( "#btnPause" ).toggle(0);
    }
    $("#btnMute").click(toogleVolume);
    $("#btnVolume").click(toogleVolume);
    $("#btnPlay").click(tooglePlay);
    $("#btnPause").click(tooglePlay);

    let timerFadeOut;
    $("main").click(function(){
        $(".controls").fadeToggle(200);
        clearTimeout(timerFadeOut);
        timerFadeOut = setTimeout(function(){$(".controls").fadeToggle(200);}, 3000);
    });
    document.body.addEventListener('pointermove', function(){
        $(".controls").fadeIn(200);
        clearTimeout(timerFadeOut);
        timerFadeOut = setTimeout(function(){$(".controls").fadeToggle(200);}, 3000);
        //cursor: none; при выключенном плеере
    });
});