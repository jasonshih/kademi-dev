function initManageFiles() {
    initPublishingMenu('');
    initFiles();
    initImport();
    initCRUDFiles();
    initCopyCutPaste();
    initUpload();
    initUploadZip();
}

function initUpload() {
    Dropzone.autoDiscover = false;
    $("#modal-upload .dropzone").dropzone({
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 2000.0, // MB
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false
    });
    var dz = Dropzone.forElement("#uploadFileDropzone");
    flog("dropz", Dropzone, dz, dz.options.url);
    dz.on("success", function (file) {
        flog("added file", file);
        reloadFileList();
    });
    dz.on("error", function (file, errorMessage) {
        Msg.error("An error occured uploading: " + file.name + " because: " + errorMessage);
    });
}

function initUploadZip() {
    Dropzone.autoDiscover = false;
    $("#modal-upload-zip .dropzone").dropzone({
        paramName: "zip", // The name that will be used to transfer the file
        maxFilesize: 2000.0, // MB
        addRemoveLinks: true,
        parallelUploads: 1,
        uploadMultiple: false,
        acceptedFiles: "application/zip,application/x-compressed,application/x-zip-compressed,multipart/x-zip"
    });
    var dz = Dropzone.forElement("#uploadZipDropzone");
    flog("dropz", Dropzone, dz, dz.options.url);
    dz.on("success", function (file) {
        flog("added file", file);
        reloadFileList();
    });
    dz.on("error", function (file, errorMessage) {
        Msg.error("An error occured uploading: " + file.name + " because: " + errorMessage);
    });
}

function initCopyCutPaste() {
    $("#table-files").cutcopy();
}

function initImport() {
    var modal = $('#modal-import');

    $('.btn-show-import').on('click', function (e) {
        e.preventDefault();

        modal.modal('show');
    });

    modal.find('form').forms({
        callback: function (resp) {
            flog('resp', resp);
            Msg.info('The importer is running')
        }
    });

    $('.btn-import-status').on('click', function (e) {
        e.preventDefault();

        $.getJSON(window.location.pathname + '?importStatus', function (data) {
            $('#import-status-result').val(data.messages).show(300);
        });
    });
}

function initCRUDFiles() {
    var container = $("#filesContainer");

    container.on('click', '.btn-create-folder', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var parentHref = window.location.pathname;
        showCreateFolder(parentHref, 'New folder', 'Please enter a name for the new folder', function () {
            reloadFileList();
        });
    });

    container.on('click', '.btn-upload-file', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('#modal-upload').modal('show');
    });

    container.on('click', '.btn-upload-zip', function (e) {
        e.stopPropagation();
        e.preventDefault();

        $('#modal-upload-zip').modal('show');
    });

    container.on('click', '.btn-new-text-file', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var name = prompt("Please enter a name for the new file");
        if (name !== null) {
            putEmptyFile(name);
        }
    });

    $('#importFromUrl').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        flog('click');

        showImportFromUrl();
    });
}

function reloadFileList() {
    flog("reloadFileList");
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

    tableFiles.find('a.show-color-box').each(function (i, n) {
        var href = $(n).attr('href');
        $(n).attr('href', href + '/alt-640-360.png');
    });
    $('abbr.timeago').timeago();
}

function initFiles() {
    initFilesLayout();
    var container = $("#filesContainer");
    container.on('click', '.btn-delete-file', function (e) {
        e.preventDefault();

        var target = $(this);
        var href = target.attr('href');
        flog('click delete href: ', href);
        var name = getFileName(href);
        var tr = target.closest('tr');

        confirmDelete(href, name, function () {
            flog('deleted', tr);
            tr.remove();
            Msg.success('Deleted ' + name);
        });
    });

    container.on('click', '.btn-rename-file', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var target = $(this);
        var href = target.attr('href');
        promptRename(href, function (resp, sourceHref, destHref) {
            var sourceName = getFileName(sourceHref);
            var destName = getFileName(destHref);
            reloadFileList();
            Msg.success(sourceName + ' is renamed to ' + destName);
        });
    });

    // Call history stuff directly, so we can reload
    var config = {
        "pageUrl": null,
        "showPreview": true,
        "afterRevertFn": function () {
            window.location.reload();
        },
        "getPageUrl": function (target) {
            if (target) {
                var href = target.attr('href');
                flog("getPageUrl: href", href);
                if (href && href.length > 0 && href !== "#") {
                    return href;
                }
            }
            if (this.pageUrl !== null) {
                return this.pageUrl;
            } else {
                return window.location.pathname;
            }
        }
    };

    container.on('click', '.btn-history-file', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var link = $(e.target).closest("a");
        flog('show history', link);
        link.addClass("loading");
        var modal = $('#modal-history');
        loadHistory(modal.find("tbody"), config, link);
        modal.modal("show");
        link.removeClass("loading");
    });
}

function showEditModal(name, pageArticle) {
    flog('showEditModal', name, pageArticle);
    var modal = $('#modal-add-page');
    var form = modal.find('form');

    form.find('input[name=pageName]').val(name);
    form.find('input[type=text], textarea').val('');
    form.unbind();
    form.submit(function (e) {
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
        afterRevertFn: function () {
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
            success: function (data) {
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
            error: function (resp) {
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
        success: function (resp) {
            var data = resp.data;
            flog('resp', resp);
            var t = data.template;
            if (!t.endsWith('.html'))
                t += '.html';
            flog('select template', t, modal.find('select option[value="' + t + '"]'));
            modal.find('select option').each(function (i, n) {
                var opt = $(n);
                //flog('compare', opt.attr('value'),t );
                if (t.startsWith(opt.attr('value'))) {
                    opt.prop('selected', true);
                } else {
                    opt.prop('selected', false);
                }
            });
            modal.find('input[name=title]').val(data.title);
            modal.find('input[name=itemType]').val(data.itemType);
            modal.find('input[name=category]').val(data.category);
            modal.find('input[name=tags]').val(data.tags);
            modal.find('textarea').val(data.body);
            openFuseModal(modal);
        },
        error: function (resp) {
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
            success: function (data) {
                flog('response', data);
                if (!data.status) {
                    Msg.error('Failed to import');
                    return;
                } else {
                    Msg.success('Importing has finished');
                    window.location.reload();
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    }
}

function putEmptyFile(name) {
    if( name.contains("/")) {
        Msg.error("File names may not contain forward slashes");
        return;
    }
    $.ajax({
        type: 'PUT',
        url: name,
        data: "",
        dataType: 'text',
        success: function (resp) {
            Msg.success('Created file ' + name);
            reloadFileList();
        },
        error: function (resp) {
            Msg.error('An error occured creating file ' + name + " - " + resp.messages);
        }
    });
}