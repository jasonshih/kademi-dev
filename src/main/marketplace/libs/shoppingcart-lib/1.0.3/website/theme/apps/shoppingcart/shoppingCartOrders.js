$(function () {
    var panels = $('.panel-shoppingcart-orders');
    var searchOptions = {
        startDate: null,
        endDate: null
    };
    if (panels.length > 0) {
        panels.find('abbr.timeago').timeago();
        
        panels.each(function () {
            var panel = $(this);
            var chkAll = panel.find('.check-all');
            
            chkAll.on('change', function () {
                panel.find(':checkbox.cart-check').prop('checked', this.checked);
            });
            
            panel.on('change', '.cbb-fulfillment', function () {
                doSearch(panel);
            });
            
            panel.find('.deleteCart').on('click', function (e) {
                e.preventDefault();
                
                var listToDelete = getCheckedOrders(panel, 'carthref');
                if (listToDelete.length > 0) {
                    if (confirm('Are you sure you want to delete ' + listToDelete.length + ' shopping carts?')) {
                        chkAll.prop('checked', false).trigger('change');
                        deleteCarts(listToDelete, panel);
                    }
                } else {
                    Msg.error('Please select shopping carts yuo want to delete');
                }
            });
            
            panel.find('.markFulfilled').on('click', function (e) {
                e.preventDefault();
                
                var listToFulfill = getCheckedOrders(panel, 'cartid');
                if (listToFulfill.length > 0) {
                    if (confirm('Are you sure you want to mark ' + listToFulfill.length + ' shopping carts as fulfilled?')) {
                        chkAll.prop('checked', false).trigger('change');
                        markFulfilled(listToFulfill.join(','), panel);
                    }
                } else {
                    Msg.error('Please select shopping carts yuo want to mark as fulfilled');
                }
            });
        });
        
        $(document.body).on('pageDateChanged', function (e, startDate, endDate, text, trigger, initial) {
            if (initial) {
                flog('Ignore initial');
                return;
            }
            
            searchOptions.startDate = startDate;
            searchOptions.endDate = endDate;
            
            panels.each(function () {
                doSearch($(this));
            });
        });
    }
    
    function getCheckedOrders(panel, dataType) {
        var checkedOrders = [];
        panel.find(':checkbox.cart-check:checked').each(function () {
            checkedOrders.push($(this).data(dataType));
        });
        
        return checkedOrders;
    }
    
    function deleteCarts(listToDelete, panel) {
        for (var i = 0; i < listToDelete.length; i++) {
            deleteFile(listToDelete[i]);
            panel.find('input[data-carthref="' + listToDelete[i] + '"]').closest('tr').remove()
        }
        Msg.info('Successfully deleted ' + listToDelete.length + ' carts');
    }
    
    function markFulfilled(listToFulfill, panel) {
        $.ajax({
            type: 'POST',
            url: '/shopping-carts/',
            data: {
                fulfill: listToFulfill
            },
            success: function () {
                doSearch(panel);
            }
        });
    }
    
    function doSearch(panel) {
        var fulfillment = panel.find('.cbb-fulfillment').val();
        var href = '?';
        if (searchOptions.searchFulfillment !== null && searchOptions.searchFulfillment !== '') {
            href = href + 'fulfillment=' + fulfillment;
        }
        if (searchOptions.startDate !== null && searchOptions.startDate !== '') {
            href = href + '&startDate=' + searchOptions.startDate;
        }
        if (searchOptions.endDate !== null && searchOptions.endDate !== '') {
            href = href + '&finishDate=' + searchOptions.endDate;
        }
        panel.find('.btn-download-csv').attr('href', '/shopping-carts/carts.csv' + href);
        
        $.ajax({
            type: 'GET',
            url: window.location.pathname,
            dataType: 'html',
            data: {
                fulfillment: fulfillment
            },
            success: function (content) {
                var dynamicElement = panel.closest('[data-dynamic-href="_components/shoppingCartOrders"]');
                var newDom = $('<div />').html(content);
                var newContent = newDom.find('#' + dynamicElement.attr('id')).find('.panel-shoppingcart-orders tbody').html();
                panel.find('tbody').html(newContent);
                panel.find('abbr.timeago').timeago();
            }
        });
    }
    
});