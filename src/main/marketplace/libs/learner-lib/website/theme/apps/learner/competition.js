(function(){

    function checkViewUploaded() {
        var div = $(".viewUploaded");
        log("checkViewUploaded", div);
        if( div.find("img").length == 0 ) {
            div.addClass("noImage");
        } else {
            div.removeClass("noImage");
        }
    };

    $(document).ready(function(){

        if($('.competition-page').length > 0) {
            $("form.entryForm").forms({
                callback: function() {
                    window.location.reload();
                }
            });
            $("#myUploaded").mupload({
                url: "uploads/",
                buttonText: "Upload a photo",
                oncomplete: function(data, name, href) {
                    $("form input[name=userAttachmentHash]").val(name);
                    var divViewUploaded = $("div.viewUploaded");
                    var img = divViewUploaded.find("img");
                    if( img.length == 0 ) {
                        img = $("<img/>");
                        divViewUploaded.empty();
                        divViewUploaded.append(img);
                    }
                    img.attr("src", "uploads/" + name + "/alt-150-150.png");
                    pulseBorder(divViewUploaded);
                }
            });
            $('.photos a').lightBox({
                imageLoading: '/static/images/lightbox-ico-loading.gif',
                imageBtnClose: '/static/images/lightbox-btn-close.gif',
                imageBtnPrev: '/static/images/lightbox-btn-prev.gif',
                imageBtnNext: '/static/images/lightbox-btn-next.gif',
                imageBlank: '/static/images/lightbox-blank.gif',
                containerResizeSpeed: 350
            } );
            checkViewUploaded();
        }
    });



})(jQuery);