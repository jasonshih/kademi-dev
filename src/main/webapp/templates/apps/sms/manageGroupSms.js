function initCreateSMS(){ 
    jQuery("form.createSMS").forms({
        onSuccess: function (resp) {
            flog("done", resp);
            Msg.success($('#smsTitle').val() + " is created");
            $("#modal-add-sms").modal('hide');
            reloadTBody();
        },
        onError: function () {
            Msg.error("Oops! Something went wrong!");
        }
    });
}

function initJobButtons() {
    $('body').on('click', 'a.btn-delete-sms', function (e) {
        e.preventDefault();
        var btn = $(e.target);
        flog('do it', btn);

        var href = btn.attr('href');
        var name = href;

        confirmDelete(href, name, function () {
            flog('remove', btn);
            btn.closest('tr').remove();
            reloadTBody();
            Msg.success(href + ' is deleted!');
        });
    });
}

function reloadTBody(){
    $("#smsTbody").reloadFragment({
        onComplete : function(){
            initJobButtons();
        }
    });
}