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
    function fadeOut(){
        $(".controls").fadeOut(200);
        $("main").css("cursor", "none");
    }
    function timerOn() {
        if ($("main").css("cursor")==="none") $(".controls").stop(true);
        clearTimeout(timerFadeOut);
        timerFadeOut = setTimeout(fadeOut, 3000);
    }
    function fadeIn(){
        timerOn();
        $(".controls").fadeIn(200);
        $("main").css("cursor", "default");
    }
    $("main").click(function(){
        timerOn();
        $(".controls").fadeToggle(200);
        if ($(this).css("cursor")==="none") $(this).css("cursor", "default");
        else $(this).css("cursor", "none");
    });
    document.body.addEventListener('pointermove', fadeIn);
    document.body.addEventListener('pointerout', fadeOut);

});