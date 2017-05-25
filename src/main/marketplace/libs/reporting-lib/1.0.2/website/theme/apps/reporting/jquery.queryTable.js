(function ($) {
    $.fn.queryTable = function () {
        var container = this;

        flog("queryTable", container.length);
        container.each(function (i, n) {
            var panel = $(n);
            initPanel(panel);
            $(document).on('pageDateChanged', function (e, startDate, endDate) {
                flog("queryTable date change", e, startDate, endDate);
                initPanel(panel);
            });

            function initPanel(panel) {
                var queryName = panel.data("queryname");
                var queryType = panel.data("querytype");
                if (!queryName) {
                    panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
                    return;
                }

                if (queryType === 'queryTable') {
                    loadQueryTable(panel);
                } else if (queryType === 'query') {
                    loadQuery(panel);
                    initRawESCSV(panel);
                }
            }
            function loadQuery(panel) {
                var queryName = panel.attr('data-queryname');
                var from = panel.attr('data-from');
                var size = panel.attr('data-items-per-page');
                if (!from) {
                    from = 0;
                }
                if (!size) {
                    size = 100;
                }
                $.ajax({
                    url: '/queries/' + queryName + '/?run&from=' + from + '&size=' + size,
                    dataType: 'json',
                    success: function (resp) {
                        var tbody = '';
                        var hits = resp.hits;
                        if (hits.total > 0) {
                            for (var i = 0; i < hits.hits.length; i++) {
                                tbody += renderRowRawES(hits.hits[i], panel);
                            }
                            panel.find('table tbody').html(tbody);
                            renderPagination(panel, resp, from, size);
                        }
                    },
                    error: function (resp) {
                        panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
                    }
                })
            }
            function loadQueryTable(panel) {
                var queryName = panel.attr('data-queryname');
                var from = panel.attr('data-from');
                var size = panel.attr('data-items-per-page');
                if (!from) {
                    from = 0;
                }
                if (!size) {
                    size = 100;
                }
                $.ajax({
                    url: '/queries/' + queryName + '/?as=json&from=' + from + '&size=' + size,
                    dataType: 'json',
                    success: function (resp) {
                        var tbody = '';
                        var numRows = resp.numRows;
                        if (numRows > 0) {
                            for (var i = 0; i < resp.rows.length; i++) {
                                tbody += renderRow(resp.rows[i]);
                            }
                            panel.find('table tbody').html(tbody);
                            renderPagination(panel, resp, from, size);
                        }
                    },
                    error: function (resp) {
                        panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
                    }
                })
            }

            function renderPagination(panel, resp, from, size) {
                var queryType = panel.data("querytype");
                var totalPages;
                if (queryType == 'queryTable') {
                    if (resp.numRows <= size) {
                        panel.find('.panel-footer .pagination').html('').parent().addClass('hide');
                        return;
                    }
                    totalPages = Math.ceil(resp.numRows / size);
                } else if (queryType == 'query') {
                    if (!resp.hits.total || resp.hits.total <= size) {
                        panel.find('.panel-footer .pagination').html('').parent().addClass('hide');
                        return;
                    }
                    totalPages = Math.ceil(resp.hits.total / size);
                }

                var maxDisplayPages = 10;

                if (!from) {
                    from = 0;
                }
                var hasNext = false;
                var hasPrev = false;
                var currentPage = Math.ceil(from / size + 1);
                if (totalPages > (currentPage + maxDisplayPages)) {
                    hasNext = true;
                }

                if (currentPage > 1) {
                    hasPrev = true;
                }
                var html = '';
                var to = currentPage + maxDisplayPages;
                if (to > totalPages) {
                    to = totalPages + 1;
                }
                if (to - currentPage < maxDisplayPages) {
                    currentPage = to - maxDisplayPages;
                    if (currentPage < 1) {
                        currentPage = 1;
                    }
                }
                for (var i = currentPage; i < to; i++) {
                    if ((i - 1) * size == from) {
                        html += '<li class="active pageItem"><a data-from="' + ((i - 1) * size) + '" href="#">' + i + '</a></li>';
                    } else {
                        html += '<li class="pageItem"><a data-from="' + ((i - 1) * size) + '" href="#">' + i + '</a></li>';
                    }
                }
                if (hasNext) {
                    html += '<li><a class="next" href="#"><span aria-hidden="true">&raquo;</span></a></li>';
                }
                if (hasPrev) {
                    html = '<li><a class="prev" href="#"><span aria-hidden="true">&laquo;</span></a></li>' + html;
                }
                panel.find('.panel-footer .pagination').html(html);

                panel.off('click').on('click', '.pagination a', function (e) {
                    e.preventDefault();

                    var from = +$(this).attr('data-from');
                    panel.attr('data-from', $(this).attr('data-from'));
                    if ($(this).hasClass('next')) {
                        from = +panel.find('.panel-footer .pagination li.pageItem').last().find('a').attr('data-from');
                        from += size;
                        panel.attr('data-from', from);
                    }
                    if ($(this).hasClass('prev')) {
                        from = +panel.find('.panel-footer .pagination li.pageItem').first().find('a').attr('data-from');
                        from -= size;
                        if (from < 0) {
                            from = 0;
                        }
                        panel.attr('data-from', from);
                    }
                    panel.attr('data-from', from);

                    if (queryType == 'queryTable') {
                        loadQueryTable(panel);
                    } else if (queryType == 'query') {
                        loadQuery(panel);
                    }
                })
            }

            function renderRow(row) {
                var rowStr = '<tr>';
                for (var i in row) {
                    var val = row[i];
                    if( !isFunction(val)) {
                        rowStr += '<td>' + val + '</td>';
                    }
                }
                rowStr += '</tr>';
                return rowStr;
            }

            function isFunction(functionToCheck) {
                var getType = {};
                return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
            }

            function renderRowRawES(row, panel) {
                var rowStr = '<tr>';
                var ths = panel.find('table thead th');
                ths.each(function () {
                    var f = $(this).attr('data-field');
                    if (row.fields[f]) {
                        rowStr += '<td>' + row.fields[f][0] + '</td>';
                    } else {
                        rowStr += '<td>&nbsp;</td>';
                    }
                });

                rowStr += '</tr>';
                return rowStr;
            }

            function initRawESCSV(panel) {
                panel.find('.btnDownloadCSV').on('click', function (e) {
                    e.preventDefault();

                    var panel = $(this).parents('.panel');

                    var arr = [];
                    var csvHeader = [];
                    panel.find('table thead tr th').each(function () {
                        csvHeader.push($(this).text());
                    });
                    arr.push(csvHeader);

                    var url = $(this).attr('href');
                    $.ajax({
                        url: url,
                        dataType: 'json',
                        success: function (resp) {
                            var hits = resp.hits;
                            if (hits.total > 0) {
                                for (var i = 0; i < hits.hits.length; i++) {
                                    var childArr = [];
                                    for (var j = 0; j < csvHeader.length; j++) {
                                        var hit = hits.hits[i];
                                        var field = csvHeader[j];
                                        if (hit.fields[field] && hit.fields[field].length) {
                                            childArr.push(hit.fields[field][0]);
                                        } else {
                                            childArr.push('');
                                        }
                                    }
                                    arr.push(childArr);
                                }
                            }
                            var csvContent = "data:text/csv;charset=utf-8,";
                            arr.forEach(function (infoArray, index) {
                                dataString = infoArray.join(",");
                                csvContent += index < arr.length ? dataString + "\n" : dataString;
                            });

                            var encodedUri = encodeURI(csvContent);
                            var link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "data.csv");
                            document.body.appendChild(link); // Required for FF

                            link.click(); // This will download the data file named "data.csv".
                        },
                        error: function (resp) {
                            Msg.error('Error when generating CSV content');
                        }
                    });
                })
            }
        });
    };

    $(function () {
        var panels = $(".panel-query-table");
        panels.queryTable();
    });
})(jQuery);



