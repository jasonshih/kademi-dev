$(function () {
    
    function initOrgFinder() {
        $('input#orgId').entityFinder({
            useActualId: false,
            type: 'organisation'
        });
    }
    
    function initCreateSubscription(){
        jQuery("form.createSubscription").forms({
            callback: function () {
                $.ajax({
                    type: 'GET',
                    url: window.location.href,
                    dataType: "html",
                    success: function (resp) {
                        var page = $(resp);
                        var table = page.find("#subscriptionsTableContainer table");
                        $("#subscriptionsTableContainer").html(table);
                        $("#addSubscriptionModal").modal('hide');
                    },
                    error: function (resp) {
                        flog('Error: ', resp);
                        $("#addSubscriptionModal").modal('hide');
                    }
                });
            }
        });
    }
    
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
    
    function initDeleteSubscriptions(){
        $('body').on('click', '.btn-delete-subscriptions', function (e) {
            e.preventDefault();
            var listToDelete = [];
            $('body').find(':checkbox.subscription-check:checked').each(function () {
                var s = $(this);
                var id = s.data("id");
                listToDelete.push(id);
            });
            flog("List To Delete", listToDelete.join(','));
            if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " subscriptions?")) {
                $('body').find('.check-all').check(false).change();
                deleteSubscriptions(listToDelete.join(','));
            } else {
                Msg.error('Please select the subscriptions you want to remove by clicking the checkboxes on the right');
            }
        });
        
        $('body').on('change', '.check-all', function (e) {
            flog($(this).is(":checked"));
            var checkedStatus = this.checked;
            $('body').find(':checkbox.subscription-check').each(function () {
                $(this).prop('checked', checkedStatus);
            });
        });
    }
    
    function deleteSubscriptions(listToDelete) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: window.location.pathname,
            data: {
                deleteSubscriptions: listToDelete,
            },
            success: function (data) {
                if (data.status) {
                    Msg.info(data.messages);
                    $("#subscriptionsTableBody").reloadFragment();
                } else {
                    Msg.error("An error occured deleting the subscriptions. Please check your internet connection");
                }
            },
            error: function (resp) {
                Msg.error("An error occured deleting the subscriptions");
            }
        });
    }
    
    function initManageSubscriptions(){
        initCreateSubscription();
        initDeleteSubscriptions();
    }
    
    initOrgFinder();
});