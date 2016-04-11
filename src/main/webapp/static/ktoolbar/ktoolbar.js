$(function () {
    var htmleditor = $('.htmleditor');
    var ktoolbar = $('#ktoolbar');
    var btnEditInline = ktoolbar.find('.btn-inline-edit');
    var btnSave = ktoolbar.find('.btn-inline-edit-save');
    var btnDone = ktoolbar.find('.btn-inline-edit-done');
    var body = $(document.body);
    var head = $('head');

    if (htmleditor.length) {
        btnEditInline.removeClass('hide');
    }

    btnEditInline.on('click', function (e) {
        e.preventDefault();

        flog('Initializing edit inline');

        var count = 0;

        function f() {
            count++;

            if (count === 6) {
                btnSave.removeClass('hide');
                btnDone.removeClass('hide');
                btnEditInline.addClass('hide');
                htmleditor.keditor({
                    snippetsUrl: '/_components/web/snippets.html',
                    onContentChanged: function () {
                        if (!body.hasClass('content-changed')) {
                            body.addClass('content-changed');
                        }
                    }
                });
            }
        }

        var styles = [
            '/static/keditor/1.1.0/dist/css/keditor-1.1.0.min.css',
            '/static/keditor/1.1.0/dist/css/keditor-components-1.1.0.min.css',
            '/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.css'
        ];
        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];

            if (head.find('[href="' + style + '"]').length === 0) {
                head.append('<link href="' + style + '" rel="stylesheet" type="text/css" />');
            }
        }

        if (head.find('#inlineStyle').length === 0) {
            head.append('<style type="text/css" id="inlineStyle">#keditor-sidebar { top: 80px; } .keditor-content-area { padding: 0; margin: 0 !important; }</style>');
        }

        $.getScriptOnce('/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.js', f);
        $.getScriptOnce('/static/jquery-ui/1.11.4/jquery-ui.min.js', function () {
            $.getScriptOnce('/static/keditor/1.1.0/dist/js/keditor-1.1.0.min.js', function () {
                $.getScriptOnce('/static/keditor/1.1.0/dist/js/keditor-components-1.1.0.min.js', f);
                $.getScriptOnce('/_components/web/handlers.js', f);
            });
        });
        $.getScriptOnce('/theme/toolbars.js', f);
        $.getScriptOnce('/static/ckeditor456/ckeditor.js', function () {
            $.getScriptOnce('/static/ckeditor456/adapters/jquery.js', f);
        });
        $.getScriptOnce('/static/nicescroll/3.6.6/jquery.nicescroll.min.js', f);
    });

    btnSave.on('click', function(e){
        e.preventDefault();

        $.ajax({
            url: window.location.pathname,
            type: 'post',
            dataType: 'json',
            data: {
                body: htmleditor.keditor('getContent')
            },
            success: function (resp) {
                if(resp && resp.status){
                    flog('inline editing saved', resp);
                    body.removeClass('content-changed');
                    Msg.success('Saved');
                    if(btnSave.hasClass('keditor-needs-destroy')){
                        btnSave.removeClass('keditor-needs-destroy');
                        btnDone.trigger('ktoolbar.done');
                    }
                }else{
                    flog('inline editing error saving', resp);
                    Msg.error('Could not save your changes. Please try again');
                }
            },
            error: function(err){
                flog('inline editing error saving', err);
                Msg.error('Could not save your changes. Please try again');
            }
        })
    });

    btnDone.on('click', function(e) {
        e.preventDefault();

        if(body.hasClass('content-changed')){
            var c = confirm('Would you like to save changes before leaving the editor?');
            if(c){
                btnSave.addClass('keditor-needs-destroy').trigger('click');
            } else{
                btnDone.trigger('ktoolbar.done');
            }
        }else{
            btnDone.trigger('ktoolbar.done');
        }

    });

    btnDone.on('ktoolbar.done', function(){
        // Todo: call Keditor destroy or disable method here
        // Just a workaround
        setTimeout(function(){
            window.location.href = window.location.href;
        },500);
    });

    window.onbeforeunload = function () {
        if(body.hasClass('content-changed')){
            return 'Are you sure to leave the editor? You will lose any unsaved changes';
        }
    };
});