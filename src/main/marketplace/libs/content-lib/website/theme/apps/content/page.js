(function ($) {
    $(document).ready(function () {
        pageInitFunctions.push(function () {
            if ( $editMode) {
                edify($(".editableContent"), function (resp) {
                    log("page saved", resp);
                    if (resp.status) {
                        log("next href", resp.nextHref);
                        if (resp.nextHref) {
                            window.location = resp.nextHref;
                        } else {
                            window.location.href = window.location.pathname;
                        }
                    } else {
                        Msg.error("There was a problem saving the page");
                    }
                });
            }
        });
    });
}(jQuery));