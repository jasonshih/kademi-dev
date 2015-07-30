function initHtmlEditorPage(fileName, cssPaths) {
    flog("initHtmlEditorPage");
    initLoadingOverlay();
    var h = $(window).height() - 180;
    initHtmlEditors($("#editor"), h, null, "", standardRemovePlugins + ",autogrow");

    var btnSave = $('.btn-save-file');

    btnSave.on('click', function (e) {
        e.preventDefault();

        var editor = CKEDITOR.instances["editor"];
        var fileContent = editor.getData();

        showLoadingOverlay();

        $.ajax({
            url: fileName,
            type: 'POST',
            data: {
                body: fileContent
            },
            success: function () {
                Msg.success('File is saved!');
                hideLoadingOverlay();
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingOverlay();
            }
        })
    });
    
    $(window).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === keymap.S) {
            e.preventDefault();
            btnSave.trigger('click');
        }
    });

    $(window).resize(function () {
        $("#cke_1_contents").css("height", ($(window).height() - 180) + "px");
    });

}


function initLoadingOverlay() {
    if (!findLoadingOverlay()[0]) {
        $('.main-content').children('.container').prepend('<div class="loading-overlay hide"></div>');
    }
}

function findLoadingOverlay() {
    return $('.main-content').children('.container').find('.loading-overlay');
}

function showLoadingOverlay() {
    findLoadingOverlay().removeClass('hide');
}

function hideLoadingOverlay() {
    findLoadingOverlay().addClass('hide');
}