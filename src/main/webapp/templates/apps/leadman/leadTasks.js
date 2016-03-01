$(function () {
    $('input[name=taskType]').on('change', function (e) {
        var t = $(this);
        var uri = new URI(window.location.search);
        uri.removeSearch('type');
        uri = uri.addSearch('type', t.val());

        window.location.search = uri.search();
    });

    $('body').on('click', '.filter', function (e) {
        e.preventDefault();

        var btn = $(this);
        var name = btn.data('name');
        var value = btn.data('value');

        var uri = new URI(window.location.search);
        uri.removeSearch(name);
        uri = uri.addSearch(name, value);

        window.location.search = uri.search();
    });

    $('body').on('submit', '#search-tasks-form', function (e) {
        e.preventDefault();

        var form = $(this);
        var searchField = form.find('input');
        var val = searchField.val();

        var uri = new URI(window.location.search);
        uri.removeSearch('q');
        uri = uri.addSearch('q', val);

        window.location.search = uri.search();
    });
});