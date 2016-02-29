$(function () {
    $('input[name=taskType]').on('change', function (e) {
        var t = $(this);
        var uri = new URI(window.location.search);
        uri.removeSearch('type')
        uri = uri.addSearch('type', t.val());

        window.location.search = uri.search();
    });
});