/**
 * Created by Anh on 28/03/2017.
 */
$(function () {
    function initSlickSlider(){
        var slider =  $('.recentlyViewedRewardProducts');
        if (slider.length) {
            slider.not('.slick-initialized').slick({
                dots: false,
                draggable: false,
                infinite: true,
                speed: 300,
                slidesToShow: 5,
                slidesToScroll: 5,
                adaptiveHeight: true,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            arrows: false,
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
    }
    initSlickSlider();
});