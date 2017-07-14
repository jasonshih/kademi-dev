function initManageAutoEmails() {
    initModalAddEmailTrigger();
    initFolderDragDrop();
    initDefaultDragDrop();
    initCategoryButtons();
    initDeleteEmail();
    initAutoEmailTable();
    initReportDateRange();

    loadAnalytics();

    flog('init dup', $('#email-trigger-wrapper'));

    $('body').on('click', '.btn-dup-email', function (e) {
        e.preventDefault();
        var name = $(e.target).attr('href');
        duplicate(name);
    });
}

function initAutoEmailTable() {
    $('table.autotriggertable').DataTable({
        searching: false,
        paging: false,
        "order": [[1, 'asc']],
        "columns": [
            {"orderable": false},
            null,
            null,
            null,
            null,
            null,
            null,
            {"orderable": false}
        ]
    });

    $('#email-trigger-wrapper').DataTable({
        searching: false,
        paging: false,
        "order": [[1, 'asc']],
        "columns": [
            {"orderable": false},
            null,
            null,
            null,
            null,
            null,
            null,
            {"orderable": false}
        ]
    });
}

var searchData = {
    startDate: null,
    endDate: null
}

function initReportDateRange() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        searchData.startDate = startDate;
        searchData.endDate = endDate;
        loadAnalytics();
    });
}

function loadAnalytics() {
    flog("loadAnalytics");
    $('#summaryCsv').attr('href', 'summary.csv?' + $.param(searchData));
    var href = "?triggerHistory&" + $.param(searchData);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;

            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }

            flog('response', json);
            handleData(json);
        }
    });
    href = "?emailStats&" + $.param(searchData);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        success: function (resp) {
            flog("emailstats", resp);
            initPies(resp.aggregations);
        }
    });

}

function handleData(resp) {
    var aggr = (resp !== null ? resp.aggregations : null);

    initHistogram(aggr);
}

function initPies(aggr) {
    initPie("pieDevice", aggr.deviceCategory);
    initPie("pieClient", aggr.userAgentType);
    initPie("pieDomain", aggr.domain);
}

function initPie(id, aggr) {
    flog("initPie", id, aggr);

    $('#' + id + ' svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
                .x(function (d) {
                    return d.key
                })
                .y(function (d) {
                    return d.doc_count
                })
                .donut(true)
                .donutRatio(0.35)
                .showLabels(true)
                .showLegend(false)
                .labelType("percent");


        d3.select("#" + id + " svg")
                .datum(aggr.buckets)
                .transition().duration(350)
                .call(chart);

        return chart;
    });
}

function initHistogram(aggr) {
    $('#chart_histogram svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
                .options({
                    showLegend: true,
                    showControls: false,
                    noData: "No Data available for histogram",
                    margin: {
                        left: 40,
                        bottom: 60
                    }
                });

        chart.xAxis
                .axisLabel("Date")
                .rotateLabels(-45)
                .tickFormat(function (d) {
                    return moment(d).format("DD MMM");
                });

        chart.yAxis
                .axisLabel("Triggered")
                .tickFormat(d3.format('d'));

        var myData = [];
        var conditionsTrue = {
            values: [],
            key: "Trigger",
            color: "#7777ff",
            area: true
        };

        var conditionsFalse = {
            values: [],
            key: "Failed Trigger",
            color: "#d9534f",
            area: true
        };

        var delayedTriggers = {
            values: [],
            key: "Delayed Trigger",
            color: "#5bc0de",
            area: true
        };

        myData.push(conditionsTrue);
        myData.push(conditionsFalse);
        myData.push(delayedTriggers);

        var trueHits = (aggr !== null ? aggr.triggerTrue.firedAt.buckets : []);
        var falseHits = (aggr !== null ? aggr.triggerFalse.firedAt.buckets : []);
        var delayedHits = (aggr !== null ? aggr.delayedTriggers.createdAt.buckets : []);

        for (var i = 0; i < trueHits.length; i++) {
            var bucket = trueHits[i];
            conditionsTrue.values.push(
                    {x: bucket.key, y: bucket.doc_count});
        }

        for (var i = 0; i < falseHits.length; i++) {
            var bucket = falseHits[i];
            conditionsFalse.values.push(
                    {x: bucket.key, y: bucket.doc_count});
        }

        for (var i = 0; i < delayedHits.length; i++) {
            var bucket = delayedHits[i];
            delayedTriggers.values.push(
                    {x: bucket.key, y: bucket.doc_count});
        }

        d3.select('#chart_histogram svg')
                .datum(myData)
                .transition().duration(500)
                .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function initModalAddEmailTrigger() {
    var modal = $('#modal-add-trigger');
    flog('initModalAddEmail', modal);
    modal.find('form').forms({
        validate: function (form) {
            flog('manageEmail.js: check radio', form);
            return checkRadio('eventId', form);
        },
        callback: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment({
                whenComplete: function () {
                    initDefaultDragDrop();
                }
            });
        }
    });
}

function initDefaultDragDrop() {
    $('#email-trigger-wrapper .email-row').draggable({
        helper: 'clone',
        revert: 'invalid',
        axis: 'y',
        start: function (event, ui) {
            ui.helper.css('background', '#f9f9f9');
            ui.helper.css('z-index', '999');
        }
    });

    $('#email-trigger-wrapper').droppable({
        accept: '.email-row',
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: 'relative', top: '', left: ''});
            var seriesName = row.data('seriesname');
            categoryAjax(seriesName, 'changeCategory=changeCategory', seriesName, function (name, resp) {
                //window.location.reload();
            });
            var folder = row.parents('.category');
            var dtFolder = row.parents('table').DataTable();
            dtFolder.row(row).remove().draw();
            folder.find('.series-count').text(dtFolder.page.info().recordsTotal);
            $(this).DataTable().rows.add(row).draw();
        }
    });
}

function initFolderDragDrop() {
    $('.category').droppable({
        accept: '.email-row',
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: 'relative', top: '', left: ''});
            var seriesName = row.data('seriesname');
            var categoryID = $(this).attr('id');
            categoryAjax(seriesName, 'changeCategory=changeCategory&categoryID=' + categoryID, seriesName, function (name, resp) {

            });
            var dtFolder = row.parents('table').DataTable();
            dtFolder.row(row).remove().draw();

            var dt = $(this).find('table').DataTable();
            dt.rows.add(row).draw();
            $(this).find('.series-count').text(dt.page.info().recordsTotal);
        }
    });

    $('#category-wrapper .email-row').draggable({
        helper: 'clone',
        revert: 'invalid',
        axis: 'y',
        start: function (event, ui) {
            ui.helper.css('background', '#f9f9f9');
            ui.helper.css('z-index', '999');
        }
    });
}

function initCategoryButtons() {
    var body = $(document.body);

    body.on('click', '.btn-add-category', function (e) {
        var categoryTitle = prompt('Please enter a category title', '');
        flog(categoryTitle);
        if (categoryTitle !== null && categoryTitle.trim() !== '') {
            categoryAjax(categoryTitle, 'createCategory=createCategory&categoryTitle=' + categoryTitle.trim(), null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    body.on('click', '.btn-rename-category', function (e) {
        e.preventDefault();
        var catTitle = $(this).data('catname');
        var catID = $(this).attr('href');
        var categoryTitle = prompt('Please enter a category title', catTitle);
        if (categoryTitle != null || categoryTitle != '') {
            categoryAjax(categoryTitle, 'updateCategory=updateCategory&categoryTitle=' + categoryTitle + '&categoryID=' + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    body.on('click', '.btn-delete-category', function (e) {
        e.preventDefault();
        var catID = $(this).attr('href');
        var catTitle = $(this).data('catname');
        var categoryTitle = confirm('Are you sure you want to delete ' + catTitle);
        if (categoryTitle) {
            categoryAjax(categoryTitle, 'deleteCategory=deleteCategory&categoryID=' + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });
}

function categoryAjax(name, data, url, callback) {
    var body = $(document.body);

    $.ajax({
        type: 'POST',
        url: window.location.pathname + (url || ''),
        data: data,
        dataType: 'json',
        success: function (resp) {
            body.trigger('ajaxLoading', {
                loading: false
            });
            if (callback) {
                callback(name, resp);
            }
        },
        error: function (resp) {
            log('error', resp);
            body.trigger('ajaxLoading', {
                loading: false
            });

            if (resp.status === 400) {
                alert('Sorry, the category could not be created. Please check if a category with that name already exists');
            } else {
                alert('There was a problem creating the folder');
            }
        }
    });
}


function exampleData() {
    return [
        {
            "label": "One",
            "value": 29.765957771107
        },
        {
            "label": "Two",
            "value": 0
        },
        {
            "label": "Three",
            "value": 32.807804682612
        },
        {
            "label": "Four",
            "value": 196.45946739256
        },
        {
            "label": "Five",
            "value": 0.19434030906893
        },
        {
            "label": "Six",
            "value": 98.079782601442
        },
        {
            "label": "Seven",
            "value": 13.925743130903
        },
        {
            "label": "Eight",
            "value": 5.1387322875705
        }
    ];
}