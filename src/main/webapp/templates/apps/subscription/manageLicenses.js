function initUpdateSubscription(){
    jQuery("form#subscriptionDetails").forms({
        onSuccess: function (resp) {
             if (resp.status) {
                 Msg.info(resp.messages);
             } else {
                 Msg.error("An error occured updating the subscription. Please check your internet connection");
             }
        },
       onError: function( resp){
         Msg.error("An error occured updating the subscriptions");
       }
    }); 
}

function initCreateLicense(){
    jQuery("form.createLicense").forms({
        onSuccess: function () {
            $.ajax({
                type: 'GET',
                url: window.location.href,
                dataType: "html",
                success: function (resp) {
                    var page = $(resp);
                    var table = page.find("#licensesTableContainer table");
                    $("#licensesTableContainer").html(table);
                    $("#addLicenseModal").modal('hide');
                },
                error: function (resp) {
                    flog('Error: ', resp);
                    $("#addLicenseModal").modal('hide');
                }
            });
        }
    });
}

function initOrgFinder() {
    $('input#orgId').entityFinder({
        useActualId: false,
        type: 'organisation'
    });
}