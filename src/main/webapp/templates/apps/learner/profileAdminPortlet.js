function initAdminProfile() {
    $('.btn-complete-module').click(function (e) {
        e.preventDefault();

        var modal = $('#modal-complete-module').modal('show');
    });

    $('.cbb-program').change(function (e) {
        var select = $(e.target);
        var form = select.closest('form');
        var moduleList = form.find('.modules-list');
        moduleList.html('');
        log('clicked', select.find('option:checked'));
        var href = select.find('option:checked').attr('value');
        form.attr('action', href);
        if (href != null && href.length > 0) {
            $.getJSON(href + '_DAV/PROPFIND?fields=href,milton:title,name,milton:moduleType&depth=2&where=milton:moduleType', function (data) {
                log('resp', data.length);

                var moduleLi = '';

                for (i = 0; i < data.length; i++) {
                    var item = data[i];
                    var id = 'option' + i;
                    log('add', item);
                    if (!item.name.startsWith('.')) {
                        var title = item.title;
                        if (title === undefined || title.length === 0) {
                            title = item.href;
                        }
                        moduleLi +=
                                '<li class="col-md-6 module">' +
                                '<div>' +
                                '<label for="' + id + '">' +
                                '<input id="' + id + '" type="checkbox" name="forceCompleteModule" value="' + item.href + '"/>' +
                                title +
                                '</label>' +
                                '<a class="btn btn-xs btn-default" target="_blank" title="Open" href="' + item.href + '"><i class="fa fa-caret-square-o-right"></i></a>' +
                                '</div>' +
                                '</li>';
                    }
                }

                moduleList.append(moduleLi);

                moduleList.parent().removeClass('hide');
            });
        }
    });

    $(document.body).on('click', '.btn-delete-download', function (e) {
        e.preventDefault();
        flog(href);
        var target = $(e.target);
        var href = target.closest('a').attr('href');
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            $('#moduleprogress-body').reloadFragment();
        });
    });
}