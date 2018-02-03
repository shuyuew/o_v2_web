$(function() {

    "use strict";


    var windowLocationPath = window.location.pathname;

    if (windowLocationPath === '/') {
        /* ===========================
    WOW script
    https://github.com/matthieua/WOW
    ============================== */
    new WOW().init();




    /* ===========================
    AutoType Words
    https://github.com/mattboldt/typed.js/
    ============================== */

    if( $('#js-type').length > 0 ) {

        $("#js-type").typed({
            strings: ["Transferring Happiness Everday.", "Cross-Border Bill-Payment For Africa."],
            typeSpeed: 50,
            startDelay: 0,
            backSpeed: 20,
            backDelay: 1000,
            loop: true,
            showCursor: false,
            cursorChar: "|"
        });
    }



    /* ===========================
    FullPage Scroll
    https://github.com/alvarotrigo/fullPage.js
    ============================== */

    $('#js-fullpage').fullpage({
        navigation: true,
        navigationPosition: 'right',
        responsive: 900,
        keyboardScrolling: true,
        anchors: ['homepage','paybill','sendmoney','vendors','help'],
        css3: true,
        scrollingSpeed: 700,
        fitToSection: true,
        easingcss3: 'ease'
    });



    /* ===========================
    Application slides
    ============================== */

    var slideDelay = 2000,
        startDelay = 200,
        slides = $(".b-slides-wrapper");

    slides.each(function() {

        var sliderID = "#" + $(this).attr("id");
        slideApp(sliderID);

    });

    function slideApp(sliderID) {

        var slidesCount = $(sliderID + ' .js-slide').length,
            n = 0;

        $.each( $(sliderID + ' .js-slide'), function(i, el) {

            setTimeout(function() {

                var slide =  $(el).children();
                slide.addClass("animated");

                setTimeout(function() {
                    slide.removeClass("animated");
                }, slideDelay + 1000);

                n++;

                if(n == slidesCount) {
                    n = 0;

                    setTimeout(function() {

                        slideApp(sliderID);

                    }, slideDelay + 1000);
                }

            }, startDelay + ( i * slideDelay ));

        });

    }
    }



});
