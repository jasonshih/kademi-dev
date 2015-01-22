/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function initManageSms() {
    initCreateSmsForm()
    initJobButtons()
}

function initCreateSmsForm() {
    $("#SmsForm").forms({
        callback: function (resp) {
            flog("done", resp);
            Msg.success($('#Smsname').val() + " is created");
            reloadTBody();
        },
        error: function () {
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
        var name = getFileName(href);

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