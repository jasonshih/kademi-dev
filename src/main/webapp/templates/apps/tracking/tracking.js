(function (w, d) {
    w.$trackingKey = "$trackingId";
    d.cookie = "$cookie";
    var checkLS = function () {
        var s = "kdm";
        try {
            localStorage.setItem(s, s);
            localStorage.removeItem(s);
            return true;
        } catch (e) {
            return false;
        }
    };
    if (checkLS) {
        localStorage.setItem('KademiTrackingId', "{\"$trackingKey\": \"$trackingId\"}");
    }
})(window, document);

//#if($jsPath) Import extra JS file
#parse($jsPath)

//#end