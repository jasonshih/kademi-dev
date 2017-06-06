(function ($) {
    var searchOptions = {
        startDate: null,
        endDate: null,
        query: null,
        displayedItems: 0
    };
    
    $(function () {
        $('.top-skus-wrapper').each(function () {
            initTopSkus($(this));
        });

        $('#prodCategories').on('change', function () {
            $(document.body).trigger('topSkusCatQueryChanged', (this.value || '').trim());
        })
    });
    
    function initTopSkus(container) {
        var displayedItems = +container.attr('data-display');
        searchOptions.displayedItems = displayedItems;
        
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
                tbodyStr += '    <td>' + bucket.skuCategory.hits.hits[0]._source.category + '</td>';
                tbodyStr += '    <td>' + resp.skuMap[bucket.key] + '</td>';
                tbodyStr += '    <td class="text-right">' + bucket.totalPoints.value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) + '</td>';
                tbodyStr += '</tr>';
                
                totalPoints += +bucket.totalPoints.value;
            }
            tfootStr += '<tr>';
            tfootStr += '    <th></th>';
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
        
        try {
            table.unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
                .removeClass('tablesorter')
                .find('thead th')
                .unbind('click mousedown')
                .removeClass('header headerSortDown headerSortUp');

            if (table.find('tbody').children().length>0){
                setTimeout(function () {
                    table.tablesorter({
                        headers: { 2: { sorter: 'fancyNumber'}},
                        sortList: [[2, 1]]
                    });
                }, 200);
            }
        } catch (e) {
        }
    }
    
    function initTopSkusChart(container) {
        $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
            $.ajax({
                type: 'get',
                url: '/getTopSkusChart',
                data: {
                    startDate: startDate,
                    endDate: endDate
                },
                dataType: 'json',
                success: function (resp) {
                    initChart(container, resp);
                }
            });
        });
    }
    
    function initChart(container, resp) {
        var chartCategory = container.find('.chart-category-share');
        var chartSkus = container.find('.chart-skus-share');
        
        var dataCategory = [];
        var totalCategory = 0;
        
        var searchRes = resp.searchResults;
        
        if (searchRes && searchRes.aggregations && searchRes.aggregations.skuCategoryShare && searchRes.aggregations.skuCategoryShare.buckets && searchRes.aggregations.skuCategoryShare.buckets.length > 0) {
            for (var i = 0; i < searchRes.aggregations.skuCategoryShare.buckets.length; i++) {
                var bucket = searchRes.aggregations.skuCategoryShare.buckets[i];
                dataCategory.push({
                    key: bucket.key,
                    doc_count: bucket.totalPoints.value
                });
                
                totalCategory += bucket.totalPoints.value;
            }
        }
        drawChart(chartCategory, dataCategory, totalCategory);
        
        var dataSkus = [];
        var totalSkus = 0;
        if (searchRes && searchRes.aggregations && searchRes.aggregations.skuCodeShare && searchRes.aggregations.skuCodeShare.buckets && searchRes.aggregations.skuCodeShare.buckets.length > 0) {
            for (var i = 0; i < searchRes.aggregations.skuCodeShare.buckets.length; i++) {
                if (i < 5) {
                    var bucket = searchRes.aggregations.skuCodeShare.buckets[i];
                    dataSkus.push({
                        key: resp.skuMap[bucket.key],
                        doc_count: bucket.totalPoints.value
                    });
                    
                    totalSkus += bucket.totalPoints.value;
                }
            }
        }
        drawChart(chartSkus, dataSkus, totalSkus);
    }
    
    function drawChart(container, data, total) {
        var svg = container.find('svg');
        svg.empty();
        
        nv.addGraph(function () {
            flog('Data to rendering pieChart', data);
            
            var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key;
                })
                .y(function (d) {
                    return d.doc_count;
                })
                .valueFormat(function (val) {
                    return round((val / total * 100), 2) + '% (' + val.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) + ')';
                })
                .labelType('value')
                .showLabels(false)
                .labelThreshold(0.10)
                .showLegend(false)
                .color(['#555555', '#bbbbbb', '#888888', '#f5bf00'])
                .margin({top: 0, right: 0, bottom: 0, left: 0});
            
            flog('Chart object', chart, svg.get(0));
            d3.select(svg.get(0))
                .datum(data)
                .transition().duration(350)
                .call(chart);
            
            nv.utils.windowResize(chart.update);
            
            return chart;
        });
        
        flog('Done in drawing pieChart');
    }
    
})(jQuery);