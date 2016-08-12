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

    function send(cmd, param) {
        var d = {
            cmd: cmd,
            param: param || {}
        };
        var pUrl = 'https://$host/ktrack.png?data=' + encodeURIComponent(JSON.stringify(d));
        var img = d.getElementById("ktrack");
        if (img == null) {
            img = document.createElement("img");
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