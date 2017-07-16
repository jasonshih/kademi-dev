/**
 * Created by Anh on 4/4/2016.
 */
function initEditEventDesc(){
    $(document.body).on('click', '.btn-edit-event', function(e){
        e.preventDefault();
        $('.btn-edit-event').addClass('hide');
        $('.btn-done-editing').removeClass('hide');
        $('.btn-save-event').removeClass('hide');
        $('#event-editor').removeClass('hide');
        $('#event-display').addClass('hide');
        $('.btn-cancel-event').removeClass('hide');
    });

    $('.btn-done-editing').on('click', function(e){
        e.preventDefault();
        $('#event-display').reloadFragment({
            whenComplete: function(){
                $('.btn-edit-event').removeClass('hide');
                $('.btn-done-editing').addClass('hide');
                $('.btn-save-event').addClass('hide');
                $('#event-editor').addClass('hide');
                $('#event-display').removeClass('hide');
                initViewEvent();
            }
        });
    });
}

function initEditorFrame() {
    flog('initEditorFrame');

    var editorFrame = $('#editor-frame');
    // TODO: It'll be dynamic url like "goto=editor" or something like that
    //editorFrame.attr('src',  'http://local.loopbackdns.com:8080/Calendars/cal/contenteditor?fileName=yolo&miltonUserUrl=/users/admin&miltonUserUrlHash=c0398f2a-1326-4c36-a7f9-c0f0ce9a6245:3y1-sc08ozoHnf2fMTtbA26STqE' + '&url=' + encodeURIComponent(window.location.href.split('#')[0]));
    editorFrame.attr('src',  window.location.pathname + '?goto=editor' + '&url=' + encodeURIComponent(window.location.href.split('#')[0]));
}

function initPostMessage() {
    flog('initPostMessage');

    $(window).on('message', function (e) {
        flog('On got message', e, e.originalEvent);

        var data = $.parseJSON(e.originalEvent.data);
        if (data.isSaved) {
            Msg.info('Saved!');
            $('.manageEventForm').removeClass('dirty');
        } else {
            iframeUrl = data.url;
        }
    });
}

function initEventForm() {
    flog('initEventForm');

    var form = $('.event-editor-form');
    form.on('change switchChange', function (e) {
        flog('change', e);
        form.addClass('dirty');
    });

    form.forms({
        onSuccess: function () {
            var editorFrame = $('#editor-frame');
            var pageName = getFileName(window.location.pathname);
            var postData = {
                url: window.location.href.split('#')[0],
                triggerSave: true,
                pageName: pageName
            };

            editorFrame[0].contentWindow.postMessage(JSON.stringify(postData), iframeUrl);
        }
    });

    return form;
}

function initEventEditable(){
    initEditEventDesc();
    initEditorFrame();
    initPostMessage();
    initEventForm();
}