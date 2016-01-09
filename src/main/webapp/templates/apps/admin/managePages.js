function initManagePages() {
    initPublishingMenu('');
    initCRUDPages();
    initAddPageModal();
    initCopyCutPaste();
    setRecentItem(window.location.pathname, window.location.pathname);
    initPjax();
    initDeleteFolders();
}

function initCRUDPages() {
    var container = $('#filesContainer');

    container.on('click', '.btn-create-folder', function (e) {
        e.stopPropagation();
        e.preventDefault();
        flog('initManageFiles: add folder');
        var parentHref = window.location.pathname;
        showCreateFolder(parentHref, 'New folder', 'Please enter a name for the new folder', function () {
            $('#subFoldersList').reloadFragment();
        });
    });

    container.on('click', '.btn-edit-page', function (e) {
        e.preventDefault();
        flog('click edit page', e, this);

        var a = $(this);
        var name = a.attr('href');
        var article = a.closest('article');
        showEditModal(name, article);
    });

    container.on('click', '.btn-delete-page', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var target = $(this);
        var href = target.attr('href');
        flog('click delete. href', href);
        var name = getFileName(href);
        var article = target.closest('article');
        confirmDelete(href, name, function () {
            flog('deleted', article);
            article.remove();
            Msg.success('Deleted ' + name);
        });
    });
}

function initAddPageModal() {
    flog('initAddPageModal');

    var modal = $('#modal-save-page');
    var form = modal.find('form');

    modal.on('hidden.bs.modal', function () {
        flog('a');

        modal.find('.btn-history-page').addClass('hidden');
        clearForm(form);
        $('.meta-wrapper').html('');
        $('.param-wrapper').html('');
    });

    form.forms({
        beforePostForm: function (form, config, data) {
            var pageName = form.find('[name=pageName]').val();
            if (pageName.length === 0) {
                form.attr('action', 'autoname.new');
            } else {
                form.attr('action', pageName);
            }

            return data;
        },
        onSuccess: function (resp) {
            if (resp.status) {
                $('#page-list').reloadFragment({
                    whenComplete: function () {
                        Msg.success('Page is saved!');
                        modal.modal('hide');
                    }
                });
            } else {
                Msg.error('There was an error saving the page: ' + resp.messages);
            }
        },
        onError: function (resp) {
            flog('error', resp);
            Msg.error('Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.');
        }
    });

    $('.btn-add-meta').on('click', function (e) {
        e.preventDefault();

        addMetaTag('', '');
    });

    $('.btn-add-param').on('click', function (e) {
        e.preventDefault();

        addParam('', '');
    });
}

function addMetaTag(name, content) {
    var metaWrapper = $('.meta-wrapper');
    var id = (new Date()).getTime();

    metaWrapper.append(
        '<div class="input-group meta">' +
        '    <input type="text" class="form-control input-sm required" required="required" name="metaName.' + id + '" placeholder="Meta name" value="' + name + '" />' +
        '    <input type="text" class="form-control input-sm required" required="required" name="metaContent.' + id + '" placeholder="Meta content" value="' + content + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-meta" type="button"><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}

function addParam(title, value) {
    var metaWrapper = $('.param-wrapper');
    var id = (new Date()).getTime();

    metaWrapper.append(
        '<div class="input-group param">' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramTitle.' + id + '" placeholder="Data/parameter title" value="' + title + '" />' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramValue.' + id + '" placeholder="Data/parameter value" value="' + value + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-param" type="button"><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}

function showEditModal(name, pageArticle) {
    flog('showEditModal', name, pageArticle);

    var modal = $('#modal-save-page');
    var form = modal.find('form');

    var btnHistoryPage = modal.find('.btn-history-page');
    btnHistoryPage.unbind().removeClass('hidden');
    btnHistoryPage.history({
        pageUrl: name,
        showPreview: false,
        modal: $('#modal-history')
    });

    $.ajax({
        type: 'GET',
        url: name + '?type=json',
        dataType: 'json',
        success: function (resp) {
            flog('Loaded page data', resp);

            var data = resp.data;

            var template = data.template;
            if (!template.endsWith('.html')) {
                template += '.html';
            }
            modal.find('select option').each(function (i, n) {
                var opt = $(n);
                if (template.startsWith(opt.attr('value'))) {
                    opt.prop('selected', true);
                } else {
                    opt.prop('selected', false);
                }
            });

            modal.find('input[name=pageName]').val(name);
            modal.find('input[name=title]').val(data.title);
            modal.find('input[name=itemType]').val(data.itemType);
            modal.find('input[name=category]').val(data.category);
            modal.find('input[name=tags]').val(data.tags);

            flog(data.metas, data.params);

            for (var i = 0; i < data.metas.length; i++) {
                addMetaTag(data.metas[i].name, data.metas[i].content);
            }

            for (var i = 0; i < data.params.length; i++) {
                addParam(data.params[i].title, data.params[i].value);
            }

            modal.modal('show');
        },
        error: function (resp) {
            flog('Could not load page data', resp);
            Msg.error('Could not load page data');
        }
    });
}

function initDeleteFolders() {
    $('body').on('click', '.btn-delete-folder', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        confirmDelete(href, href, function () {
            $('#subFoldersList').reloadFragment();
        });
    });
}

function initPjax() {
    var container = $('#filesContainer');
    var files = $('#files');
    flog('initPjax', container);
    container.on('click', 'a.pjax', function (e) {
        e.preventDefault();

        var a = $(this);
        var href = a.attr('href');
        var name = a.text();

        flog('click pjax', a);

        files.reloadFragment({
            url: href,
            whenComplete: function (response, status, xhr) {
                flog('done', response, status, xhr);

                document.title = name;
                window.history.pushState('', href, href);

                var formAction = window.location.pathname + '_DAV/PUT?overwrite=true';
                $('#modal-upload form').attr('action', formAction);
                var dz = Dropzone.forElement('#uploadFileDropzone');
                dz.options.url = formAction;

                var zipFormAction = window.location.pathname;
                $('#modal-upload-zip form').attr('action', zipFormAction);
                var dz2 = Dropzone.forElement('#uploadZipDropzone');
                dz2.options.url = zipFormAction;
                setRecentItem(window.location.pathname, window.location.pathname);

                var dom = $(response);
                var pages = $('#pages');

                flog('update pages', pages);
                pages.html(dom.find('#pages > *'));

                initFilesLayout();
                initCopyCutPaste();
            }
        });
    });
}
