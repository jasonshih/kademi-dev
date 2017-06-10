jQuery(document).ready(function () {
    initFiles();

});


function initFiles() {
    log("initFiles");
    jQuery("abbr.timeago").timeago();
}