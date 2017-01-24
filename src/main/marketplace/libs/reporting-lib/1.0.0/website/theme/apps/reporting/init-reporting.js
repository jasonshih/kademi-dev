$(function () {
    flog("init-reporting");

    var panels = $(".panel-query-table");
    panels.each(function (i, n) {
        var panel = $(n);
        initPanel(panel);
    });

    function initPanel(panel) {
        var queryName = panel.data("queryname");
        var queryType = panel.data("querytype")
        if (!queryName) {
            panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
            return;
        }
        if (queryType === 'queryTable') {
            $.ajax({
                url: '/queries/' + queryName + '/?as=json',
                dataType: 'json',
                success: function (resp) {
                    var tbody = '';
                    var numRows = resp.numRows;
                    if( numRows == 0 ) {
                        numRows = resp.rows.length;
                    }
                    if (numRows > 0) {
                        for (var i = 0; i < resp.rows.length; i++) {
                            tbody += renderRow(resp.rows[i]);
                        }
                        panel.find('table tbody').html(tbody);
                    }
                },
                error: function (resp) {
                    panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
                }
            })
        } else {
            $.ajax({
                url: '/queries/' + queryName.replace('.query.json', '') + '/?run',
                dataType: 'json',
                success: function (resp) {
                    var tbody = '';
                    var hits = resp.hits;
                    if (hits.total > 0) {
                        for (var i = 0; i < hits.hits.length; i++) {
                            tbody += renderRowRawES(hits.hits[i], panel);
                        }
                        panel.find('table tbody').html(tbody);
                    }
                },
                error: function (resp) {
                    panel.find('table tbody').html('<tr><td align="center" colspan="999">No result</td></tr>');
                }
            })
        }
    }

    function renderRow(row) {
        var rowStr = '<tr>';
        for (var i in row) {
            rowStr += '<td>' + row[i] + '</td>';
        }
        rowStr += '</tr>';
        return rowStr;
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

});