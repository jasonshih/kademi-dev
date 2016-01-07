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
    flog('initAddPageModal', $('.btn-add-page'));

    var modal = $('#modal-add-page');

    initFuseModal(modal, function () {
        modal.find('.modal-body').css('height', getStandardModalEditorHeight());
        initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow'); // disable autogrow
    });

    modal.on('hidden.modal.fuse', function () {
        modal.find('.btn-history-page').addClass('hidden');
    });

    var form = modal.find('form');

    $('.btn-add-page').click(function (e) {
        e.preventDefault();
        flog('initAddPageModal: click');

        form.find('input[type=text], textarea,input[name=pageName]').val('');
        form.unbind();
        form.submit(function (e) {
            flog('submit clicked', this);
            e.preventDefault();
            //createPage(modal.find('form'));
            doSavePage(form, null, false);
        });
        openFuseModal(modal);
        flog('initAddPageModal: click done');
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
