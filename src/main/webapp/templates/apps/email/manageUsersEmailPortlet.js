function initManagerUserEmailPortlet() {
    var modal = $('#modal-compose-email');
    var form = modal.find('form');
    
    initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow');
    
    form.forms({
        onSuccess: function (resp) {
            modal.modal('hide');
            $('#emailHistoryBody').reloadFragment();
        }
    });
    
    $(document.body).on('hidden.bs.modal', '#modal-compose-email', function () {
        form.trigger('reset');
    });
    
    var receivedCheckbox = $('input[type="checkbox"].icheck.received');
    receivedCheckbox.iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red',
        increaseArea: '10%' // optional
    });
    
    receivedCheckbox.on('ifToggled', function (e) {
        var btn = $(this);
        var checked = btn.is(':checked');
        
        if (checked) {
            $('tr.email-received').show();
        } else {
            $('tr.email-received').hide();
        }
    });
    
    var sentCheckbox = $('input[type="checkbox"].icheck.sent');
    
    sentCheckbox.iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green',
        increaseArea: '10%'
    });
    
    sentCheckbox.on('ifToggled', function (e) {
        var btn = $(this);
        var checked = btn.is(':checked');
        if (checked) {
            $('tr.email-sent').show();
        } else {
            $('tr.email-sent').hide();
        }
    });
}