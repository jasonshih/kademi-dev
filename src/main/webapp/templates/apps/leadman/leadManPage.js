(function (w) {

    var searchOptions = {
        team: null,
        query: '',
        leadType: null
    };

    var dataTable = null;

    function initDataTable(hits) {
        if (dataTable !== null) {
            dataTable.clear(false);
        }

        $('#leadBody').empty();

        var editor = new $.fn.dataTable.Editor({
            ajax: {
                url: '/leads/?updateLead&leadId=_id_'
            },
            table: '#leadTable',
            idSrc: 'leadId',
            fields: [{
                    label: 'Deal Amount',
                    name: 'dealAmount'
                },
                {
                    label: 'Stage',
                    name: 'stageName',
                    type: 'select'
                }
            ]
        });

        $('#leadTable').on('click', 'tbody td', function (e) {
            editor.inline(this, {
                submitOnBlur: true
            });
        });

        dataTable = $('#leadTable').DataTable({
            paging: false,
            searching: false,
            destroy: true,
            info: false,
            order: [
                [7, 'desc']
            ],
            columns: [
                {
                    data: 'organisation.title',
                    name: 'orgTitle',
                    defaultContent: ""
                },
                {
                    data: 'profile.firstName',
                    defaultContent: ""
                },
                {
                    data: 'profile.surName',
                    defaultContent: ""
                },
                {
                    data: 'profile.email',
                    defaultContent: ""
                },
                {
                    data: 'stageName',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'source',
                    defaultContent: ""
                },
                {
                    data: 'dealAmount',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'assignedToProfile',
                    defaultContent: "",
                    render: function (d) {
                        flog('Render ', d);
                        if (typeof d !== 'undefined' && d !== null) {
                            var f = d.firstName || '';
                            var s = d.surName || '';
                            return (f + ' ' + s).trim();
                        }
                        return '';
                    }
                },
                {
                    data: 'createdDate',
                    defaultContent: "",
                    render: function (d) {
                        if (typeof d !== 'undefined' && d !== null) {
                            return moment(d).format('DD/MM/YYYY') + '<br/>' + moment(d).format('h:mm:ss a');
                        }
                        return '';
                    }
                },
                {
                    data: 'leadId',
                    "orderable": false,
                    render: function (data, type, full, meta) {
                        flog(data, type, full, meta);
                        return '<a class="btn btn-info" href="' + data + '"><i class="fa fa-eye"></i></a>';
                    }
                }
            ]
        });

        var stages = [];

        for (var i in hits.hits) {
            var hit = hits.hits[i];
            dataTable.row.add(hit._source);
            $.ajax({
                url: '/leads/?stageNames=' + hit._source.leadId,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    if (data.status) {
                        $.each(data.data, function (i, el) {
                            if ($.inArray(el, stages) === -1)
                                stages.push(el);
                        });
                        editor.field('stageName').update(stages);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        }
        dataTable.draw();
    }


    function initOrgSelect() {
        $('body').on('click', '.btn-select-org', function (e) {
            e.preventDefault();

            var btn = $(this);
            var b = btn.closest('div').find('.aggr-title');
            b.html(btn.html());

            var href = btn.attr('href');
            if (href === '#') {
                searchOptions.team = null;
            } else {
                searchOptions.team = href;
            }

            doSearch();
        });
    }

    function initSearchField() {

        var txt = $('#leadQuery');
        txt.on({
            input: function () {
                typewatch(function () {
                    var text = txt.val().trim();

                    searchOptions.query = text;
                    doSearch();

                }, 500);
            }
        });

        var clearBtn = $('#lead-query-clear');
        clearBtn.on('click', function(e){
            e.preventDefault();
            txt.val('');
            searchOptions.query = '';
            doSearch();
        });
    }

    function initLeadTypeSelect() {
        $('body').on('change', 'input[name=leadType]', function (e) {
            var btn = $(this);
            var type = btn.attr('id');
            searchOptions.leadType = type;

            doSearch();
        });
    }

    function doSearch() {
        $.ajax({
            url: window.location.pathname + '?sLead&' + $.param(searchOptions),
            dataType: 'JSON',
            success: function (data, textStatus, jqXHR) {
                $('#LeadTotal').html(data.hits.total);
                $('#LeadSumValue').html(data.aggregations.dealAmountTotal.value || 0);
                $('#leadAvgValue').html(data.aggregations.dealAmountAvg.value || 0);

                updateSourcesPie(data.aggregations.sources.buckets);
                updateStagesPie(data.aggregations.stages.buckets);
                initDataTable(data.hits);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('error', jqXHR, textStatus, errorThrown);
            }
        });
    }

    function updateSourcesPie(buckets) {
        $('#stagesPie svg').empty();
        //Donut chart
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(false)
                    .showLegend(false)
                    .margin({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    })
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("value")   //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                    ;

            d3.select("#stagesPie svg")
                    .datum(buckets)
                    .transition().duration(350)
                    .call(chart);

            return chart;
        });
    }

    function updateStagesPie(buckets) {
        $('#sourcesPie svg').empty();
        //Donut chart
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(false)
                    .showLegend(false)
                    .margin({
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    })
                    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                    .labelType("value")   //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                    ;

            d3.select("#sourcesPie svg")
                    .datum(buckets)
                    .transition().duration(350)
                    .call(chart);

            return chart;
        });
    }

    w.initLeadManPage = function () {
        Handlebars.registerHelper('NotEmpty', function (conditional, options) {
            if (typeof conditional !== 'undefined' && typeof conditional.length !== 'undefined') {
                if (conditional.length > 0) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper('formatTime', function (object) {
            var d = new moment(object);

            return d.format('MMMM Do YYYY, h:mm:ss a');
        });

        initOrgSelect();
        initSearchField();
        initLeadTypeSelect();
        doSearch();
    };
})(this);