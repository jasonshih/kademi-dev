jQuery(document).ready(function () {
    initFiles();
    initCRUDFiles();
    initUpload();
});


function initFiles() {
    log("initFiles");
    jQuery("abbr.timeago").timeago();
}

function initUpload() {
    if (typeof Dropzone !== 'undefined') {
        Dropzone.autoDiscover = false;
        $('#modal-upload .dropzone').dropzone({
            paramName: 'file', // The name that will be used to transfer the file
            maxFilesize: 2000.0, // MB
            addRemoveLinks: true,
            parallelUploads: 1,
            uploadMultiple: true
        });
        var uploadFileDropzone = $('#uploadFileDropzone');
        if (uploadFileDropzone.length) {
            var dz = Dropzone.forElement('#uploadFileDropzone');
            flog('dropz', Dropzone, dz, dz.options.url);
            dz.on('success', function (file) {
                flog('added file', file);
                reloadFileList();
            });
            dz.on('error', function (file, errorMessage) {
                Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
            });
        }
    }
}


function initCRUDFiles() {
    var container = $('#filesContainer');
    
    container.on('click', '.btn-create-folder', function (e) {
        e.stopPropagation();
        e.preventDefault();
        showCreateFolder(pageHref, 'New folder', 'Please enter a name for the new folder', function () {
            reloadFileList();
        });
    });
    
    container.on('click', '.btn-upload-file', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        $('#modal-upload').modal('show');
    });
}

function reloadFileList() {
    flog('reloadFileList');
    $('#table-files').reloadFragment({
        whenComplete: function () {
            //initPseudoClasses();
            initFilesLayout();
        }
    });
}

function initFiles() {
    initFilesLayout();
    var container = $('#filesContainer');
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
    
    container.on('click', '.btn-rename-file', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Call history stuff directly, so we can reload
    //var config = {
    //    'pageUrl': null,
    //    'showPreview': true,
    //    'afterRevertFn': function () {
    //        window.location.reload();
    //    },
    //    'getPageUrl': function (target) {
    //        if (target) {
    //            var href = target.attr('href');
    //            flog('getPageUrl: href', href);
    //            if (href && href.length > 0 && href !== '#') {
    //                return href;
    //            }
    //        }
    //        if (this.pageUrl !== null) {
    //            return this.pageUrl;
    //        } else {
    //            return window.location.pathname;
    //        }
    //    }
    //};
    //
    //container.on('click', '.btn-history-file', function (e) {
    //    e.stopPropagation();
    //    e.preventDefault();
    //    var link = $(e.target).closest('a');
    //    flog('show history', link);
    //    link.addClass('loading');
    //    var modal = $('#modal-history');
    //    loadHistory(modal.find('tbody'), config, link);
    //    modal.modal('show');
    //    link.removeClass('loading');
    //});
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

function move(sourceHref, destHref, callback) {
    //    ajaxLoadingOn();
    var url = '_DAV/MOVE';
    if (sourceHref) {
        var s = sourceHref;
        log('s', s);
        if (!s.endsWith('/')) {
            s += '/';
        }
        url = s + url;
    }
    log('move', sourceHref, destHref, 'url=', url);
    $('body').trigger('ajaxLoading', {
        loading: true
    });
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            destination: destHref
        },
        dataType: 'text',
        success: function (resp) {
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            if (callback) {
                callback(resp, sourceHref, destHref);
            }
        },
        error: function () {
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            alert('There was a problem creating the folder');
        }
    });
}