/**
 * Created by Anh on 14/07/2017.
 */
(function ($) {
    $(function () {
        $(window).on('load', function () {
            $('.container-bg').each(function () {
                var item = $(this);
                var isMulti = item.attr('data-multiple-bg') == 'true';
                var imagesStr = item.attr('data-images');
                var transition = item.attr('data-bg-transition')*1000 || 2000;

                if (isMulti && imagesStr){
                    var imagesArr = imagesStr.split(',');
                    if (imagesArr.length){
                        for (var i = 0; i < imagesArr.length; i++){
                            var img = $('<img>').attr('src', imagesArr[i]).css('position','absolute').css('left','-9999999px');
                            $(document.body).append(img);
                        }

                        var count = 1;
                        function slide() {
                            if (count >= imagesArr.length) {
                                count = 0
                            }
                            var bgFor = item.hasClass('background-for') ? item : item.find('.container-content-wrapper');
                            bgFor.addClass('multiple-background-effect').css("background-image", 'url("' + imagesArr[count] + '")');
                            count++;
                        }
                        setInterval(slide, transition);
                    }
                }
            })
        });
    });
})(jQuery);