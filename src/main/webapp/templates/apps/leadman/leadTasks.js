$(function () {
    $('input[name=taskType]').on('change', function (e) {
        var t = $(this);
        var uri = new URI(window.location.search);
        uri.removeSearch('type');
        uri = uri.addSearch('type', t.val());

        window.location.search = uri.search();
    });

    $('body').on('click', '.filter-assignedto', function (e) {
        e.preventDefault();

        var btn = $(this);
        var name = btn.attr('href');

        var uri = new URI(window.location.search);
        uri.removeSearch('assignedTo');
        uri = uri.addSearch('assignedTo', name);

        window.location.search = uri.search();
    });
});