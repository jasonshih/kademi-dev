(function ($) {
    var searchOptions = {
        startDate: null,
        endDate: null,
        query: null,
        dataSerialName: null,
        displayedItems: 10
    };

    $(document).ready(function(){
        $('.top-skus-wrapper').each(function () {
            initTopSkus($(this));
        });
    });
    
    function initTopSkus(container) {
        var displayedItems = +container.attr('data-display');
        var dataSerialName = container.attr('data-data-series-name');
        searchOptions.displayedItems = displayedItems;
        searchOptions.dataSerialName = dataSerialName;

        $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
            searchOptions.startDate = startDate;
            searchOptions.endDate = endDate;
            doSearch(container);
        });
        
        $(document.body).on('topSkusQueryChanged', function (e, query) {
            searchOptions.query = query;
            doSearch(container);
        });

        $(document.body).on('topSkusCatQueryChanged', function (e, catQuery) {
            searchOptions.catQuery = catQuery;
            if (catQuery){
                searchOptions.displayedItems = 1000;
            } else {
                searchOptions.displayedItems = 20;
            }
            doSearch(container);
        });

        doSearch(container);
    }
    
    function doSearch(container) {
        var data = $.param(searchOptions);
        flog('doSearch: ' + data);
        
        $('.btn-download-top-skus').attr('href', '/topSkus.csv?' + data);
        
        $.ajax({
            type: 'get',
            url: '/getTopSkus',
            data: data,
            dataType: 'json',
            success: function (resp) {
                initTable(container, resp);
            }
        });
    }
    
    function initTable(container, resp) {
        var table = container.find('table');
        var tbody = table.find('tbody');
        var tfoot = table.find('tfoot');
        
        var tbodyStr = '';
        var tfootStr = '';
        var totalPoints = 0;
        var searchRes = resp.searchResults;
        if (searchRes && searchRes.aggregations && searchRes.aggregations.skuCode && searchRes.aggregations.skuCode.buckets && searchRes.aggregations.skuCode.buckets.length > 0) {
            for (var i = 0; i < searchRes.aggregations.skuCode.buckets.length; i++) {
                var bucket = searchRes.aggregations.skuCode.buckets[i];
                
                tbodyStr += '<tr>';
                // tbodyStr += '    <td>' + bucket.skuCategory.hits.hits[0]._source.category + '</td>';
                tbodyStr += '    <td>' + resp.skuMap[bucket.key] + '</td>';
                tbodyStr += '    <td class="text-right">' + bucket.totalPoints.value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) + '</td>';
                tbodyStr += '</tr>';
                
                totalPoints += +bucket.totalPoints.value;
            }
            tfootStr += '<tr>';
            // tfootStr += '    <th></th>';
            tfootStr += '    <th></th>';
            tfootStr += '    <th class="text-right">' + totalPoints.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) + '</th>';
            tfootStr += '</tr>';
        } else {
            tbodyStr += '<tr>';
            tbodyStr += '    <td colspan="3" class="text-center">No results</td>';
            tbodyStr += '</tr>';
        }
        
        tbody.html(tbodyStr);
        tfoot.html(tfootStr);
        
        // try {
        //     table.unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
        //         .removeClass('tablesorter')
        //         .find('thead th')
        //         .unbind('click mousedown')
        //         .removeClass('header headerSortDown headerSortUp');
        //
        //     if (table.find('tbody').children().length>0){
        //         setTimeout(function () {
        //             table.tablesorter({
        //                 headers: { 2: { sorter: 'fancyNumber'}},
        //                 sortList: [[[2, 1]]]
        //             });
        //         }, 200);
        //     }
        // } catch (e) {
        // }
    }
    

    
})(jQuery);