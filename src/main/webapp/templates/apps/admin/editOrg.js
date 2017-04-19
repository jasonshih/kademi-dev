function initEditOrg() {
    var oldId = $("#orgId").val();
    $(".org-details").forms({
        callback: function (resp) {
            flog("saved", resp);
            Msg.info("Saved OK");
            var newId = $("#orgId").val();
//            if (oldId !== newId) {
//                window.location = "../" + newId + "/edit";
//            } else {
                $("#form-body").reloadFragment({
                    whenComplete: function () {
                        $(".chosen-select").chosen({
                            search_contains: true
                        });
                        initMap();
                    }
                });
//            }
        }
    });
    $(".chosen-select").chosen({
        search_contains: true
    });
    $("body").on("click", ".btnSearchAddress", function (e) {
        e.preventDefault();
        search();
    });
    $("body").on("click", ".addOrgType", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        addOrgType(name,e);
    });
    $("body").on("click", ".removeOrgType", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        removeOrgType(name,e);
    });

}

function initMap() {
    var orgLoc = {}; //lat: -33.867, lng: 151.195
    if (orgLat && orgLng) {
        orgLoc.lat = orgLat;
        orgLoc.lng = orgLng;
        flog("use coords", orgLoc);
        map = new google.maps.Map(document.getElementById('map'), {
            center: orgLoc,
            zoom: 15
        });
        createMarker(orgLoc);

    } else {
        flog("no coords");
        var orgLoc = {lat: -33.867, lng: 151.195};
        map = new google.maps.Map(document.getElementById('map'), {
            center: orgLoc,
            zoom: 15
        });
    }
}

function search() {
    var service = new google.maps.places.PlacesService(map);
    var q = $("#orgAddress").val() + "," + $("#orgAddress2").val() + "," + $("#country").val();
    flog("search", q);
    service.textSearch({
        query: q
    }, callback);
}

function callback(results, status) {
    flog("callback", results, status);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var first = results[0];
        firstLoc = first.geometry.location;
        flog("callback, set center", firstLoc);
        map.setCenter(firstLoc);
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i].geometry.location);
        }
    }
}

function createMarker(loc) {
    var marker = new google.maps.Marker({
        map: map,
        position: loc
    });

    google.maps.event.addListener(marker, 'click', function () {
        flog("clicked", marker.getPosition());
        var pos = marker.getPosition();
        map.setCenter(marker.getPosition());
        $("input[name=lat]").val(pos.lat);
        $("input[name=lng]").val(pos.lng);
        orgLat = Number($("input[name=lat]").val());
        orgLng = Number($("input[name=lng]").val());
    });
}

function addOrgType(name) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            addOrgType: name
        },
        success: function (resp) {
            if (resp.status) {
                Msg.info("Added");
                $("#orgTypesContainer").reloadFragment();
            } else {
                Msg.error("Couldnt add org type: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })
}

function removeOrgType(name,event) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            removeOrgType: name
        },
        success: function (resp) {
            flog("done1");
            if (resp.status) {
                Msg.info("Removed");
                $("#orgTypesContainer").reloadFragment();
            } else {
                Msg.error("Couldnt remove org type: " + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
            hideLoadingIcon();
        }
    })
}