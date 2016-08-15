(function (w, d) {
    w.$trackingKey = "$!trackingId";
    d.cookie = "$cookie";
    d.cookie = "$domainCookie";
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

    function send(cmd, param) {
        var data = {
            cmd: cmd,
            params: param || {},
            trackingId: '$!trackingId'
        };
        var t = (new Date()).getTime();
        var pUrl = w.location.protocol + '//$host/ktrack.png?_t=' + t + '&data=' + encodeURIComponent(JSON.stringify(data));
        var img = d.getElementById("ktrack");
        if (img == null) {
            img = d.createElement("img");
            img.src = pUrl;
            img.id = 'ktrack';
            d.body.appendChild(img);
        } else {
            img.src = pUrl;
        }
    }

    w.ktracking = {
        send: send
    };
})(window, document);

//#if($jsPath) Import extra JS file
#parse($jsPath)

//#end