var anim = false;
var game = false;
var isStart = true;
var acceleration = 1;

$(document).ready(function(){
    let ufoVideo = $("#ufo").get(0);
    // if (ufoVideo.paused) ufoVideo.play();
    // anim = true;

    // MAIN ACTIONS
    function toogleVolume() {
        $( "#btnMute" ).toggle();
        $( "#btnVolume" ).toggle();
        ufoVideo.muted = !ufoVideo.muted;
    }
    function tooglePlay(event, stoppingAll=false) {
        if (event.key==" " || event.type!="keyup") {
            $( "#btnPlay" ).toggle(0);
            $( "#btnPause" ).toggle(0);
            anim = !anim;
            if (ufoVideo.paused && stoppingAll==false) {
                ufoVideo.play();
                document.documentElement.style.cssText = "--anim_conf: 10s linear forwards running";
                $( ".black" ).css("visibility", 'hidden');
            }
            else {
                if (stoppingAll==false) ufoVideo.pause();
                document.documentElement.style.cssText = "--anim_conf: 10s linear forwards paused";
            }
        }
    }
    function toStart() {
        acceleration = 1;
        ufoVideo.currentTime = 0;
        $(".fog1_cont, .fog2_cont").css("animation",'none');
        setTimeout(function() {
            $(".fog1_cont, .fog2_cont").css("animation",'');
        }, 10);
        isStart = true;
    }
    $("#btnMute").click(toogleVolume);
    $("#btnVolume").click(toogleVolume);
    $("#btnPlay").click(tooglePlay);
    $("#btnPause").click(tooglePlay);
    $("#btnRepeat").click(toStart);
    $(document).on('keyup', tooglePlay);

    ufoVideo.ontimeupdate = function(e){
        if (ufoVideo.currentTime > 12.02) $(".black").css("visibility", 'visible');
        else if (ufoVideo.currentTime > 8.05) acceleration = 0;
        else if (ufoVideo.currentTime > 6.2) {
            acceleration = 1 - ( (ufoVideo.currentTime - 6.2 ) / 1.85);
        }
    };
    ufoVideo.onended = function(e){
        tooglePlay(e,true);
        toStart();
    };

    // CONTROLS ANIMATION
    let timerFadeOut;
    function fadeOut(){
        $(".controls").fadeOut(200);
        $("main").removeClass("default");
    }
    function timerOn(fromControlsClick=false) {
        if (!$("main").hasClass("default")){
            $(".controls").stop(true);
            if (fromControlsClick===true)
                $(".controls").fadeIn(0);
        }
        clearTimeout(timerFadeOut);
        timerFadeOut = setTimeout(fadeOut, 3000);
    }
    function fadeIn(){
        timerOn();
        $(".controls").fadeIn(200);
        $("main").addClass("default");
    }
    function onClick(){
        timerOn();
        if ($("aside.controls").css("display")==="none") $("main").addClass("default");
        else $("main").removeClass("default");
        $(".controls").fadeToggle(200);
    }
    $("main").click(onClick);
    $(".controls").click(function(){timerOn(true);});
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.addEventListener('touchmove', onClick);
    }
    else
    {
        document.body.addEventListener('pointermove', fadeIn);
        document.body.addEventListener('pointerleave', fadeOut);
    }
});