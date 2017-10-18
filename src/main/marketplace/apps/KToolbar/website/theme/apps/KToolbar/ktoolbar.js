(function ($) {
    function initKToolbarInlineBtns() {
        var htmleditor = $('.content-page .htmleditor');
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

    function initHeadingColor() {
        var value = $('.headingColor').val();
        if (value && value != 'inherit'){
            $('.txtHeadingColor').prop('disabled', false);
            $('.headingColor').prop('checked', false);
        } else {
            $('.txtHeadingColor').prop('disabled', true);
            $('.headingColor').prop('checked', true);
        }
        $('.headingColor').on('click', function () {
            $('.txtHeadingColor').prop('disabled', this.checked);
            if (this.checked){
                $('.headingColor').val('');
                $('.txtHeadingColor').val('');
                $('.txtHeadingColor').parent().find('i').css('background-color', 'transparent');
            }
        })
    }
    $(function () {
        initKToolbarInlineBtns();
        initKToolbarToggler();
        initKToolbarSideBar();
        initHeadingColor();
        
        window.onbeforeunload = function () {
            var body = $("body");
            if (body.hasClass('content-changed')) {
                return 'Are you sure to leave the editor? You will lose any unsaved changes';
            }
        };
    });
    
})(jQuery);
