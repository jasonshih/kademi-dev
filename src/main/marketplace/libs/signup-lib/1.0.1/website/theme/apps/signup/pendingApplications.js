$(function () {
    var panels = $('.panel-pending-applications');
    var isEditorPage = $(document.body).hasClass('content-editor-page');
    
    if (panels.length > 0 && !isEditorPage) {
        panels.find('abbr.timeago').timeago();
        
        panels.find('button.accept, button.reject').click(function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var isEnabled = btn.hasClass('accept');
            
            if (isEnabled || (!isEnabled && confirm('Are you sure you want to reject this application?'))) {
                var tbody = btn.closest('tbody');
                var appId = tbody.find('input[name=appId]').val();
                var fields = tbody.find(':input');
                var ajaxData = {
                    applicationId: appId,
                    enable: isEnabled
                };
                fields.each(function () {
                    if (this.name) {
                        ajaxData[this.name] = this.value;
                    }
                });
                
                flog('Set status of application="' + appId + '" enabled=' + isEnabled);
                
                $.ajax({
                    type: 'POST',
                    url: '/pendingApps', // Post to orgfolder/pendingApps
                    dataType: 'json',
                    data: ajaxData,
                    success: function (data) {
                        log('response', data);
                        if (!data.status) {
                            Msg.error('An error occurred processing the request. Please refresh the page and try again: ' + data.messages);
                            return;
                        }
                        tbody.remove();
                        $('.det-' + appId).remove();
                    },
                    error: function (resp) {
                        log('error', resp);
                        Msg.error('An error occurred processing the request. Please refresh the page and try again');
                    }
                });
            }
        });
        
        panels.find('.collapse').on({
            'hidden.bs.collapse': function (e) {
                $(e.currentTarget.parentNode).hide();
            },
            'show.bs.collapse': function (e) {
                $(e.currentTarget.parentNode).show();
            }
        });
    }
});