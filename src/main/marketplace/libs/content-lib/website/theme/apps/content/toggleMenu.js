$(function () {
    $(document.body).on('click', '.toggle-menu-trigger', function (e) {
        e.preventDefault();

        var trigger = $(this);
        var menuSelector = trigger.attr('data-menu');
        var menu = $(menuSelector);

        menu.show();
        menu.trigger('showed.toggleMenu');
    });

    $(document.body).on('click', '.toggle-menu-closer', function (e) {
        e.preventDefault();

        var closer = $(this);
        var menuSelector = closer.attr('data-menu');
        var menu = $(menuSelector);

        menu.hide();
        menu.trigger('hidden.toggleMenu');
    });
});