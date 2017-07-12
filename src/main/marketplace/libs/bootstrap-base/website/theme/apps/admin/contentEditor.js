var win = $(window);
var contentEditor = true;

$(document).on({
    'show.bs.modal': function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    },
    'hidden.bs.modal': function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    }
}, '.modal');

function initContentEditorPage(options) {
    flog('initContentEditorPage fileName=' + options.fileName);
    
    initKEditor(options);
    initSaving(options.fileName);
    initPropertiesModal();
    initNavbar();
    
    // Confirm before closed tab or window
    window.onbeforeunload = function (e) {
        if ($(document.body).hasClass('content-changed')) {
            e.returnValue = 'Are you sure you would like to leave the editor? You will lose any unsaved changes';
        }
    };
}

function initNavbar() {
    var nav = $('.content-editor-nav');
    
    $('.content-editor-toggle').on('click', function (e) {
        e.preventDefault();
        
        nav.toggleClass('closed');
        this.setAttribute('title', nav.hasClass('closed') ? 'Open navbar' : 'Close navbar');
    });
}

function initPropertiesModal() {
    var modal = $('#modal-page-properties');
    
    modal.find('form').forms({
        onSuccess: function () {
            $('#file-title').reloadFragment({
                url: window.location.href,
                whenComplete: function () {
                    modal.modal('hide');
                    Msg.success('Properties are saved');
                }
            });
        }
    });
    
    modal.find('.btn-add-meta').on('click', function (e) {
        e.preventDefault();
        
        addMetaTag('', '');
    });
    
    modal.on('click', '.btn-remove-meta', function (e) {
        e.preventDefault();
        
        $(this).closest('.meta').remove();
    });
    
    modal.find('.btn-add-param').on('click', function (e) {
        e.preventDefault();
        
        addParam('', '');
    });
    
    modal.on('click', '.btn-remove-param', function (e) {
        e.preventDefault();
        
        $(this).closest('.param').remove();
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

function initKEditor(options) {
    var themeCss = $('head link[href^="/--theme--less--bootstrap.less"]');
    if (typeof themeCssFiles !== 'undefined') {
        
        if (themeCss.length > 0) {
            themeCssFiles.push(themeCss.attr('href'));
        }
        themeCssFiles.push('/static/bootstrap/ckeditor/bootstrap-ckeditor.css');
    }
    
    $.getScriptOnce('/static/jquery.contentEditor/1.0.0/jquery.contentEditor-1.0.0.js', function () {
        var timer;
        win.on('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var paddingTop = $(document.body).css('padding-top');
                if (paddingTop) {
                    paddingTop = paddingTop.replace('px', '');
                    $('#content-area .keditor-content-area').css('min-height', win.height() - paddingTop);
                }
            }, 100);
        });
        
        var basePath = window.location.pathname.replace('contenteditor', '');
        $('#content-area').contentEditor({
            snippetsUrl: options.snippetsUrl,
            snippetsHandlersUrl: options.snippetsHandlersUrl,
            allGroups: options.allGroups,
            basePath: basePath,
            pagePath: basePath,
            onReady: function () {
                win.trigger('resize');
                setTimeout(function () {
                    hideLoadingIcon();
                    $('#editor-loading').addClass('loading').find('.loading-text').html('Saving...');
                }, 150);
            }
        });
    });
    
    // Stop prevent reloading page or redirecting to other pages
    $(document.body).on('click', '.keditor-component-content a', function (e) {
        var a = $(this);
        
        if (a.is('[data-slide]') || a.is('[data-slide-to]')) {
        
        } else {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    });
}

function initSaving(fileName) {
    flog('initSaving', fileName);
    
    var btnSaveFile = $('.btn-save-file');
    btnSaveFile.on('click', function (e) {
        e.preventDefault();
        
        $('[contenteditable]').blur();
        showLoadingIcon();
        var fileContent = $('#content-area').contentEditor('getContent');
        
        $.ajax({
            url: fileName,
            type: 'POST',
            data: {
                body: fileContent
            },
            dataType: 'json',
            success: function () {
                $(document.body).removeClass('content-changed');
                Msg.success('File is saved!');
                hideLoadingIcon();
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingIcon();
            }
        })
    });
    
    win.on({
        keydown: function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                btnSaveFile.trigger('click');
            }
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}