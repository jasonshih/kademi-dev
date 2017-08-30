(function ($) {
    function initKToolbarInlineBtns() {
        var htmleditor = $('.htmleditor');
        var ktoolbar = $('#ktoolbar');
        var btnEditInline = ktoolbar.find('.btn-inline-edit');
        var btnSave = ktoolbar.find('.btn-inline-edit-save');
        var btnDone = ktoolbar.find('.btn-inline-edit-done');
        var body = $(document.body);
        
        if (htmleditor.length) {
            btnEditInline.removeClass('hide');
        }
        
        btnSave.on('click', function (e) {
            e.preventDefault();
            
            $.ajax({
                url: window.location.pathname,
                type: 'post',
                dataType: 'json',
                data: {
                    body: htmleditor.keditor('getContent')
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        flog('inline editing saved', resp);
                        body.removeClass('content-changed');
                        Msg.success('Saved');
                        if (btnSave.hasClass('keditor-needs-destroy')) {
                            btnSave.removeClass('keditor-needs-destroy');
                            btnDone.trigger('ktoolbar.done');
                        }
                    } else {
                        flog('inline editing error saving', resp);
                        Msg.error('Could not save your changes. Please try again');
                    }
                },
                error: function (err) {
                    flog('inline editing error saving', err);
                    Msg.error('Could not save your changes. Please try again');
                }
            })
        });
        
        btnDone.on('click', function (e) {
            e.preventDefault();
            
            if (body.hasClass('content-changed')) {
                var c = confirm('Would you like to save changes before leaving the editor?');
                if (c) {
                    btnSave.addClass('keditor-needs-destroy').trigger('click');
                } else {
                    btnDone.trigger('ktoolbar.done');
                }
            } else {
                btnDone.trigger('ktoolbar.done');
            }
            
        });
        
        btnDone.on('ktoolbar.done', function () {
            // Todo: call Keditor destroy or disable method here
            // Just a workaround
            setTimeout(function () {
                window.location.href = window.location.href;
            }, 500);
        });
    }
    
    function initKToolbarToggler() {
        var ktoolbar = $('#ktoolbar');
        var ktoolbarToggle = ktoolbar.find('.ktoolbarToggle');
        
        ktoolbarToggle.on('click', function (e) {
            e.preventDefault();
            
            ktoolbar.toggleClass('showed');
        });
    }
    
    function initKToolbarSideBar() {
        var sidebar = $('#ktoolbar-sidebar');
        $('.btn-edit-variables').on('click', function (e) {
            e.preventDefault();
            
            sidebar.toggleClass('showed');
        });
        
        $('.color-picker').each(function () {
            var colorPicker = $(this);
            colorPicker.wrap('<div class="input-group"></div>');
            var wrapper = colorPicker.parent();
            wrapper.wrap('<div class="colorpicker-container"></div>');
            colorPicker.before('<span class="input-group-addon"><i></i></span>');
            var previewer = wrapper.find('i');
    
            wrapper.colorpicker({
                format: 'hex',
                container: wrapper.parent(),
                component: '.input-group-addon',
                align: 'left',
                colorSelectors: {
                    'transparent': 'transparent'
                }
            }).on('changeColor.colorpicker', function () {
                if (!colorPicker.val() || colorPicker.val().trim().length === 0) {
                    previewer.css('background-color', '');
                }
            });
            
        });
        
        var form = sidebar.find('form')
        form.forms({
            onSuccess: function () {
                var themeLess = $('head link[href^="/--theme--less--bootstrap.less"]');
                if (themeLess.length > 0) {
                    Msg.success('Theme variables are saved! Reloading styles...');
                    var href = themeLess.attr('href');
                    href = href.replace(/\?.*|$/, '?' + (new Date).getTime());
                    themeLess.attr('href', href);
                } else {
                    Msg.success('Theme variables are saved! Reloading page...');
                    window.location.reload();
                }
            }
        });
        
        sidebar.find('.btn-save').on('click', function (e) {
            e.preventDefault();
            
            form.trigger('submit');
        });
        
        sidebar.find('.btn-close').on('click', function (e) {
            e.preventDefault();
            
            sidebar.removeClass('showed');
        });
    }
    
    $(function () {
        initKToolbarInlineBtns();
        initKToolbarToggler();
        initKToolbarSideBar();
        
        window.onbeforeunload = function () {
            var body = $("body");
            if (body.hasClass('content-changed')) {
                return 'Are you sure to leave the editor? You will lose any unsaved changes';
            }
        };
    });
    
})(jQuery);

(function ($) {
    var timer;
    
    $(function () {
        initMultiLingual();
    });
    
    function initMultiLingual () {
        flog('initMultiLingual');
        
        initModalTranslate();
        
        $('.select-lang').on('click', function (e) {
            e.preventDefault();
            
            var langCode = $(this).attr('href');
            flog('Selected lang: ' + langCode);
            
            $.cookie('selectedLangCode', langCode, {
                expires: 360, path: '/'
            });
            window.location.reload();
        });
        
        $(document.body).on({
            'focus mouseenter': function () {
                showTranslateButton($(this));
            },
            'blur mouseleave': function () {
                hideTranslateButton();
            }
        }, '.translatable');
        
        $(document.body).on({
            'focus mouseenter': function () {
                clearTimeout(timer);
            },
            'blur mouseleave': function () {
                hideTranslateButton();
            }
        }, '#btn-translate');
    }
    
    function showTranslateButton(target) {
        flog('showTranslateButton', target);
        
        clearTimeout(timer);
        
        var btn = $('#btn-translate');
        if (btn.length === 0) {
            btn = $('<button class="btn btn-linnk btn-xs" id="btn-translate"><i class="fa fa-language"></i> Edit translation</button>');
            btn.css({
                position: 'absolute',
                'z-index': 999999
            });
            $(document.body).append(btn);
        }
        
        btn.off('click').on('click', function (e) {
            e.preventDefault();
            
            showModalTranslate(target);
        });
        
        var position;
        if (target.is('.htmleditor')) {
            position = $('#cke_' + target.attr('id')).offset();
        } else {
            position = target.offset();
        }
        
        position.top = position.top - btn.innerHeight();
        btn.css(position).show();
    }
    
    function initModalTranslate() {
        flog('initModalTranslate');
        
        var modal = $(
            '<div id="modal-translate" class="modal fade" tabindex="-1">' +
            '     <div class="modal-dialog modal-sm">' +
            '        <div class="modal-content">' +
            '            <div class="modal-header">' +
            '                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
            '                <h4 class="modal-title">Save translated text</h4>' +
            '            </div>' +
            '            <form method="POST" class="form-horizontal" action="/translations/">' +
            '                <div class="modal-body">' +
            '                    <p class="form-message alert alert-danger" style="display: none;"></p>' +
            '                    <input type="hidden" name="sourceType" value="" />' +
            '                    <input type="hidden" name="sourceId" value="" />' +
            '                    <input type="hidden" name="sourceField" value="" />' +
            '                    <input type="hidden" name="langCode" value="" />' +
            '                    <div class="form-group">' +
            '                        <label for="translated" class="control-label col-md-3">Translated text</label>' +
            '                        <div class="col-md-9">' +
            '                            <input type="text" class="form-control" name="translated" placeholder="Enter translated text here..." disabled="disabled" style="display: none" />' +
            '                            <textarea type="text" class="form-control" name="translated" placeholder="Enter translated text here..." disabled="disabled" rows="3" style="display: none"></textarea>' +
            '                            <div class="htmleditor-wrapper" style="display: none;"><textarea type="text" class="form-control htmleditor" disabled="disabled" name="translated" placeholder="Enter translated text here..."></textarea></div>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '                <div class="modal-footer">' +
            '                    <button class="btn btn-sm btn-default" data-dismiss="modal" type="button">Close</button>' +
            '                    <button class="btn btn-sm btn-primary" type="submit" type="submit">Save</button>' +
            '                </div>' +
            '            </form>' +
            '        </div>' +
            '     </div>' +
            '</div>'
        );
        $(document.body).append(modal);
        initHtmlEditors(modal.find('.htmleditor'));
        
        modal.find('form').forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    Msg.info("Translated text is saved");
                    modal.modal('hide');
                } else {
                    Msg.error("There was a problem saving the translation " + resp.messages);
                }
            }
        });
        
        modal.on('hidden.bs.modal', function () {
            modal.find('[name=translated]').prop('disabled', true).removeClass('required').hide();
            modal.find('.htmleditor-wrapper').hide();
            modal.find('.form-message').html('').hide();
            var ckeditor = CKEDITOR.instances[modal.find('.htmleditor').attr('id')];
            ckeditor.setReadOnly(true);
        });
        
        return modal;
    }
    
    function showModalTranslate(target) {
        flog('showTranslateButton', target);
        
        var modal = $('#modal-translate');
        if (modal.length === 0) {
            modal = initModalTranslate();
        }
        
        var sourceType = target.data("source-type");
        if (sourceType == null) {
            sourceType = target.closest("form").data("source-type");
        }
        var sourceId = target.data("source-id");
        if (sourceId == null) {
            sourceId = target.closest("form").data("source-id");
        }
        var sourceField = target.data("source-field");
        var langCode = $.cookie('selectedLangCode');
        
        modal.find('[name=sourceType]').val(sourceType);
        modal.find('[name=sourceId]').val(sourceId);
        modal.find('[name=sourceField]').val(sourceField);
        modal.find('[name=langCode]').val(langCode);
        
        $.ajax({
            url: '/translations',
            dataType: 'json',
            type: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                sourceType: sourceType,
                sourceId: sourceId,
                sourceField: sourceField,
                langCode: langCode,
                asJson: true
            },
            success: function (resp) {
                var translatedText = '';
                if (resp && resp.status && resp.data.length > 0) {
                    translatedText = resp.data[0].translated || '';
                }
                
                var modalSize = 'modal-md';
                var translatedTextboxes = modal.find('[name=translated]');
                var destinationTextbox;
                if (target.is('textarea.htmleditor')) {
                    modalSize = 'modal-lg';
                    destinationTextbox = translatedTextboxes.filter('textarea.htmleditor');
                    modal.find('.htmleditor-wrapper').show();
                    
                    var ckeditor = CKEDITOR.instances[destinationTextbox.attr('id')];
                    ckeditor.setReadOnly(false);
                    ckeditor.setData(translatedText);
                } else if (target.is('input')) {
                    destinationTextbox = translatedTextboxes.filter('input');
                } else {
                    destinationTextbox = translatedTextboxes.filter('textarea').not('.htmleditor');
                }
                
                destinationTextbox.prop('disabled', false).addClass('required').not('.htmleditor').show();
                destinationTextbox.val(translatedText);
                
                modal.find('.modal-dialog').attr('class', 'modal-dialog ' + modalSize);
                modal.modal('show');
            }
        });
    }
    
    function hideTranslateButton() {
        timer = setTimeout(function () {
            $('#btn-translate').hide();
        }, 400);
    }
    
})(jQuery);