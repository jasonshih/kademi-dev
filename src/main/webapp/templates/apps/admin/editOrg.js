var map;
var mapDiv;

function initEditOrg() {
    $(".org-details").forms({
        onSuccess: function (resp) {
            flog("saved", resp);
            Msg.info("Saved OK", 'save');
            
            $("#form-body").reloadFragment({
                whenComplete: function () {
                    $(".chosen-select").chosen({
                        search_contains: true
                    });
                    initMap();
                }
            });
        }
    });
    $(".chosen-select").chosen({
        search_contains: true
    });
    
    $(document.body).on("click", ".btnSearchAddress", function (e) {
        e.preventDefault();
        
        if (mapDiv.is(':hidden')) {
            mapDiv.show();
            google.maps.event.trigger(map, "resize");
        }
        
        search();
    });
    
    $(document.body).on("click", ".addOrgType", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        addOrgType(name, e);
    });
    
    $(document.body).on("click", ".removeOrgType", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        removeOrgType(name, e);
    });
    
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $(".profile-photo img").attr("src", resp.nextHref);
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", resp.nextHref);
                        $(".main-profile-photo img").attr("src", resp.nextHref);
                    } else {
                        Msg.error("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    Msg.error('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });
    
    $('body').on('click', '#btn-remove-ava', function (e) {
        e.preventDefault();
        
        Kalert.confirm('Are you sure you want to clear the avatar?', function () {
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    clearAvatar: true
                },
                success: function (resp) {
                    if (resp.status) {
                        $(".profile-photo img").attr("src", "pic");
                        $(".main-profile-photo img").attr("src", "pic");
                    } else {
                        Msg.error("Sorry, an error occured updating your profile image");
                    }
                },
                error: function () {
                    Msg.error('Sorry, we couldn\'t save your profile image.');
                }
            });
        });
    });
    
}

function initMap() {
    mapDiv = $('#map');
    
    var orgLoc = {}; //lat: -33.867, lng: 151.195
    if (orgLat && orgLng) {
        orgLoc.lat = orgLat;
        orgLoc.lng = orgLng;
        flog("use coords", orgLoc);
        map = new google.maps.Map(mapDiv.get(0), {
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
                Msg.info("Added", 'addOrgType');
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

function removeOrgType(name, event) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            removeOrgType: name
        },
        success: function (resp) {
            flog("done1");
            if (resp.status) {
                Msg.info("Removed", 'removeOrgType');
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