(function ($) {
    
    $(function () {
        initTagClaim();
        initTagClaimFilter()
    });
    
    function initTagClaim() {
        
        $('.tagClaim').on('click', function (e) {
            var salesDataId = $(this).data('salesdataid')
            
            var confirmationDialog = confirm("Are you sure you want to claim this record?");
            if (confirmationDialog == true) {
                $.ajax({
                    url: '/salesDataClaimsProducts/tagClaim',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        salesDataId: salesDataId
                    },
                    success: function (resp) {
                        flog('RESP ', resp);
                        Msg.success("Claim tagged successfully");
                        reloadUnclaimedSalesRecords()
                    },
                    error: function (jqXHR, textStatus, errorThrown) {                                                            
                        flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                        Msg.error("Something went wrong !");
                    }
                });
            }
        });
    }
    
    function initTagClaimFilter(){
        $('.filter-claims-option').on('click', function(e){
        	//console.log( $(this).text())
        	var filter = $(this).text()
        	filterUnclaimedSalesRecords(filter)
        })
    }
    
    function reloadUnclaimedSalesRecords(callback) {
        $('#pending-claims').reloadFragment({
            url: window.location.pathname,
            whenComplete: function () {
                initTagClaim() 
            }
        });
    }
    
    function filterUnclaimedSalesRecords(filter, callback) {
        var currentTab = "pending-claims"
        if($('#post-claims').length){
            currentTab = "post-claims"
        }
        $('#claims-table').reloadFragment({
            url: window.location.pathname + '?tab='+ currentTab + '&filter=' + filter,
            whenComplete: function () {
                initTagClaim() 
            }
        });
    }
    
})(jQuery);