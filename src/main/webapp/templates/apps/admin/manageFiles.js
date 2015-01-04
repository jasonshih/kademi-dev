function initManageFiles() {
    initPublishingMenu('');
    initFiles();
    initImport();
    initCRUDPages();
    initAddPageModal();
    initCRUDFiles();
    initCopyCutPaste();
}

function initCopyCutPaste() {
    var cont = $("body");
    $("#table-files").cutcopy();
}

function initImport() {
    var modal = $('#modal-import');

    $('.btn-show-import').on('click', function(e) {
        e.preventDefault();

        modal.modal('show');
    });

    modal.find('form').forms({
        callback: function(resp) {
            flog('resp', resp);
            Msg.info('The importer is running')
        }
    });

    $('.btn-import-status').on('click', function(e) {
        e.preventDefault();

        $.getJSON(window.location.pathname + '?importStatus', function(data) {
            $('#import-status-result').val(data.messages).show(300);
        });
    });
}

function initCRUDPages() {
    var pageList = $('#page-list');

    pageList.on('click', '.btn-edit-page', function(e) {
        e.preventDefault();
        flog('click edit page', e, this);
        var a = $(this);
        var name = a.attr('href');
        var article = a.closest('article');
        showEditModal(name, article);
    });

    pageList.on('click', '.btn-delete-page', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var target = $(this);
        var href = target.attr('href');
        flog('click delete. href', href);
        var name = getFileName(href);
        var article = target.closest('article');
        confirmDelete(href, name, function() {
            flog('deleted', article);
            article.remove();
            Msg.success('Deleted ' + name);
        });
    });
}

function initCRUDFiles() {
    var tableFiles = $('#table-files');
//    $('#my-upload').mupload({
//        url: window.location.pathname,
//        buttonText: '<i class="clip-folder"></i> Upload a file',
//        oncomplete: function(data, name, href) {
//            // reload the file list
//            flog('uploaded ok, now reload file list');
//            reloadFileList();
//        }
//    });

    tableFiles.on('click', '.btn-create-folder', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var parentHref = window.location.pathname;
        showCreateFolder(parentHref, 'New folder', 'Please enter a name for the new folder', function() {
            reloadFileList();
        });
    });

    tableFiles.on('click', '.btn-upload-file', function(e) {
        e.stopPropagation();
        e.preventDefault();

        $('#modal-upload').modal('show');
    });

    $('#importFromUrl').click(function(e) {
        e.stopPropagation();
        e.preventDefault();

        flog('click');

        showImportFromUrl();
    });
}

function reloadFileList() {
    $('#table-files-body').reloadFragment({
        whenComplete: function () {
            //initPseudoClasses();
            initFilesLayout();
        }
    });
}

function initFilesLayout() {
    flog('initFiles');
    var tableFiles = $('#table-files');

    tableFiles.find('a.show-color-box').each(function(i, n) {
        var href = $(n).attr('href');
        $(n).attr('href', href + '/alt-640-360.png');
    });
    $('abbr.timeago').timeago();
}
    
function initFiles() {
    initFilesLayout();
    var tableFiles = $('#table-files');
    tableFiles.on('click', '.btn-delete-file', function(e) {
        e.preventDefault();

        var target = $(this);
        var href = target.attr('href');
        flog('click delete href: ', href);
        var name = getFileName(href);
        var tr = target.closest('tr');

        confirmDelete(href, name, function() {
            flog('deleted', tr);
            tr.remove();
            Msg.success('Deleted ' + name);
        });
    });

    tableFiles.on('click', '.btn-rename-file', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var target = $(this);
        var href = target.attr('href');
        promptRename(href, function(resp, sourceHref, destHref) {
            var sourceName = getFileName(sourceHref);
            var destName = getFileName(destHref);
            reloadFileList();
            Msg.success(sourceName + ' is renamed to ' + destName);
        });
    });

    tableFiles.on('click', '.btn-history-file', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    $('.btn-history-file').history({
        modal: $('#modal-history')
    });
}


function initAddPageModal() {
    flog('initAddPageModal', $('.btn-add-page'));

    var modal = $('#modal-add-page');

    initFuseModal(modal, function() {
        modal.find('.modal-body').css('height', getStandardModalEditorHeight());
        initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow'); // disable autogrow
    });

    modal.on('hidden.modal.fuse', function () {
        modal.find('.btn-history-page').addClass('hidden');
    });

    var form = modal.find('form');

    $('.btn-add-page').click(function(e) {
        e.preventDefault();
        flog('initAddPageModal: click');

        form.find('input[type=text], textarea,input[name=pageName]').val('');
        form.unbind();
        form.submit(function(e) {
            flog('submit clicked', this);
            e.preventDefault();
            //createPage(modal.find('form'));
            doSavePage(form, null, false);
        });
        openFuseModal(modal);
    });
}

function showEditModal(name, pageArticle) {
    flog('showEditModal', name, pageArticle);
    var modal = $('#modal-add-page');
    var form = modal.find('form');

    form.find('input[name=pageName]').val(name);
    form.find('input[type=text], textarea').val('');
    form.unbind();
    form.submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
        flog('edit submit click', this);
        doSavePage(form, pageArticle);
    });

    var btnHistoryPage = modal.find('.btn-history-page');

    btnHistoryPage.unbind().removeClass('hidden');
    btnHistoryPage.history({
        pageUrl: name,
        showPreview: false,
        afterRevertFn: function() {
            loadModalEditorContent(modal, name);
        },
        modal: $('#modal-history')
    });
    loadModalEditorContent(modal, name);
}

function doSavePage(form, pageArticle) {
    var modal = form.parents('.modal');
    flog('doSavePage', form);

    resetValidation(form);
    if (!checkRequiredFields(form)) {
        return;
    }

    var title = form.find('input[name=title]');
    var data;
    flog('check ck editors', CKEDITOR.instances);
    for (var key in CKEDITOR.instances) {
        var editor = CKEDITOR.instances[key];
        var content = editor.getData();
        flog('got ck content', key, content, editor);
        var inp = $('textarea[name=' + key + ']', form);
        if (inp) {
            inp.html(content);
            flog('updated', inp);
        }
    }
    data = form.serialize();

    var url = form.find('input[name=pageName]').val();
    if (url === null || url.length === 0) {
        url = 'autoname.new';
    }

    flog('do ajax post', form.attr('action'), data);
    try {
        form.find('button[type=submit]').attr('disabled', 'true');
        flog('set disabled', form.find('button[type=submit]'));
        form.add(modal).addClass('ajax-processing');
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            success: function(data) {
                flog('set enabled', form.find('button[type=submit]'));
                form.add(modal).removeClass('ajax-processing');
                form.find('button[type=submit]').removeAttr('disabled');
                if (data.status) {
                    var _title = title.val();
                    if (pageArticle == null) { // indicated new page
                        var pageName = getFileName(data.messages[0]);
                        var href = data.nextHref;
                        addPageToList(pageName, href, _title);
                    } else {
                        pageArticle.find('> span').text(_title);
                    }
                    closeFuseModal(modal);
                } else {
                    Msg.error('There was an error saving the page: ' + data.messages);
                }
            },
            error: function(resp) {
                form.add(modal).removeClass('ajax-processing');
                form.find('button[type=submit]').removeAttr('disabled');
                flog('error', resp);
                Msg.error('Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
    return false;
}

function loadModalEditorContent(modal, name) {
    $.ajax({
        type: 'GET',
        url: name + '?type=json',
        dataType: 'json',
        success: function(resp) {
            var data = resp.data;
            flog('resp', resp);
            var t = data.template;
            if (!t.endsWith('.html'))
                t += '.html';
            flog('select template', t, modal.find('select option[value="' + t + '"]'));            
            modal.find('select option').each(function(i, n) {
                var opt = $(n);
                //flog('compare', opt.attr('value'),t );
                if (t.startsWith(opt.attr('value'))) {
                    opt.prop('selected', true);
                } else {
                    opt.prop('selected', false);
                }
            });
            modal.find('input[name=title]').val(data.title);
            modal.find('textarea').val(data.body);
            openFuseModal(modal);
        },
        error: function(resp) {
            flog('error', resp);
            Msg.error('err: couldnt load page data');
        }
    });
}

function addPageToList(pageName, href, title) {
    var newFileName = getFileName(href);
    $('#page-list').reloadFragment();
}

function showImportFromUrl() {
    var url = prompt('Please enter a url to import files from');
    if (url) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            dataType: 'json',
            data: {
                importFromUrl: url
            },
            success: function(data) {
                flog('response', data);
                if (!data.status) {
                    Msg.error('Failed to import');
                    return;
                } else {
                    Msg.success('Importing has finished');
                    window.location.reload();
                }
            },
            error: function(resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    }
}