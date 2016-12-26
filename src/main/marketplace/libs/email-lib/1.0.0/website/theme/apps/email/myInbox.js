function initMessage(markRead, page) {
    $('abbr.timeago').timeago();
    
    if (!markRead) {
        return;
    }
    log('mark read');
    
    $.ajax({
        type: 'POST',
        url: page,
        data: 'read=true',
        success: function (resp) {
            log('set read status', resp);
        },
        error: function (resp) {
            log('Failed to set read flag', resp);
        }
    });
}
