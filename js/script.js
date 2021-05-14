$(document).ready(function(){
    let ufoVideo = $("#ufo").get(0);
    if (ufoVideo.paused) ufoVideo.play();
    window['anim'] = true;

    function toogleVolume() {
        $( "#btnMute" ).toggle();
        $( "#btnVolume" ).toggle();
        ufoVideo.muted = !ufoVideo.muted;
    }
    function tooglePlay(event, stoppingAll=false) {
        if (event.key==" " || event.type!="keyup") {
            $( "#btnPlay" ).toggle(0);
            $( "#btnPause" ).toggle(0);
            window['anim'] = !anim;
            if (ufoVideo.paused && stoppingAll==false) {
                ufoVideo.play();
                document.documentElement.style.cssText = "--anim_conf: 10s linear forwards running";
            }
            else {
                if (stoppingAll==false) ufoVideo.pause();
                document.documentElement.style.cssText = "--anim_conf: 10s linear forwards paused";
            }
        }
    }
    function toStart() {
        ufoVideo.currentTime = 0;
        $(".fog1_cont, .fog2_cont").css("animation",'none');
        setTimeout(function() {
            $(".fog1_cont, .fog2_cont").css("animation",'');
        }, 10);
    }
    $("#btnMute").click(toogleVolume);
    $("#btnVolume").click(toogleVolume);
    $("#btnPlay").click(tooglePlay);
    $("#btnPause").click(tooglePlay);
    $("#btnRepeat").click(toStart);
    $(document).on('keyup', tooglePlay);

    ufoVideo.onended = function(e){
        tooglePlay(e,true);
        toStart();
    };

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