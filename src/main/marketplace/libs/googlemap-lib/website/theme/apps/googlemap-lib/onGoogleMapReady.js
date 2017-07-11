function onGoogleMapReady() {
    setTimeout(function () {
        flog('onGoogleMapReady');
        $(document.body).trigger('onGoogleMapReady');
    },0);
}
