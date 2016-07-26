(function (w) {

    var searchOptions = {
        team: null,
        query: '',
        leadType: null,
        tags: []
    };

    var dataTable = null;
    editor = null;
    var stages = [];

    function initDataTable(hits) {
        if (dataTable !== null) {
            dataTable.clear(false);
        }

        $('#leadBody').empty();

        editor = new $.fn.dataTable.Editor({
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
                },
                {
                    label: 'Source',
                    name: 'source',
                    type: 'select'
                },
                {
                    label: 'Assigned To',
                    name: 'assignedToProfile',
                    type: 'select',
                    data: 'assignedToProfile',
                    placeholder: 'Select an assignment',
                    optionsPair: {
                        label: 'name',
                        value: 'userId'
                    },
                    def: 'NONE'
                }
            ]
        });

        dataTable = $('#leadTable').DataTable({
            paging: false,
            searching: false,
            destroy: true,
            info: false,
            select: true,
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
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'dealAmount',
                    defaultContent: "",
                    className: 'editable'
                },
                {
                    data: 'assignedToProfile',
                    defaultContent: "",
                    className: 'editable',
                    render: function (d, type) {
                        flog('Render Profile', d, type);
                        if (typeof d !== 'undefined' && d !== null) {
                            switch (type) {
                                case "type":
                                case "sort":
                                {
                                    return d.userId;
                                    break;
                                }
                                case "display":
                                {
                                    if (d.firstName && d.firstName.trim().length > 0) {
                                        var f = d.firstName || '';
                                        var s = d.surName || '';
                                        return (f + ' ' + s).trim();
                                    } else if (d.nickName) {
                                        return d.nickName.trim();
                                    }
                                }
                                default:
                                    return d.name;
                            }
                        }
                        return d;
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

        $('#leadTable').on('focus', 'tbody td select[id^=DTE_Field_]', function () {
            var field = $(this);
            var td = field.closest('td');
            var fieldName = field.attr('id');

            if (fieldName !== null && typeof fieldName !== 'undefined') {
                fieldName = field.attr('id').replace('DTE_Field_', '');
                var row = dataTable.row(td[0]);
                var leadId = row.data().leadId;
                switch (fieldName) {
                    case "stageName":
                        loadStageNames(leadId);
                        break;
                    case "source":
                        loadSources(leadId);
                        break;
                }
            }
        });

        $('#leadTable').on('click', 'tbody td', function (e) {

            editor.inline(this, {
                submitOnBlur: true
            });
        });

        for (var i in hits.hits) {
            var hit = hits.hits[i];
            var _source = hit._source;

            dataTable.row.add(_source);
        }

        $.ajax({
            url: '/leads/?teamUsers',
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                data.data.push({
                    name: "Clear assignment",
                    userId: 0
                });
                editor.field('assignedToProfile').update(data.data);
            }
        });

        editor.on('submitComplete', function (e, json, data) {
            doSearch();
        });

        dataTable.draw();
    }


    function loadStageNames(leadId) {
        $.ajax({
            url: '/leads/?stageNames=' + leadId,
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                var stages = [];
                $.each(data.data, function (i, el) {
                    if ($.inArray(el.name, stages) === -1) {
                        stages.push(el.name);
                    }
                });
                flog('Stages', stages);
                editor.field('stageName').update(stages);
            }
        });
    }

    function loadSources(leadId) {
        $.ajax({
            url: '/leads/?sourceNames=' + leadId,
            dataType: 'json'
        }).done(function (data) {
            if (data.status) {
                var sources = [];
                $.each(data.data, function (i, el) {
                    if ($.inArray(el, stages) === -1) {
                        sources.push(el);
                    }
                });
                flog('Sources', sources);
                editor.field('source').update(sources);
            }
        });
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

    function initTagsSelect() {
        $('#tags-selector').multiselect({
            onChange: function (option, checked) {
                var groupId = $(option).val();
                if (checked) { // Add tag
                    if (searchOptions.tags.indexOf(groupId) < 0) {
                        searchOptions.tags.push(groupId);
                    }
                } else { // Remove tag
                    while (searchOptions.tags.indexOf(groupId) > -1) {
                        var index = searchOptions.tags.indexOf(groupId);
                        if (index > -1) {
                            searchOptions.tags.splice(index, 1);
                        }
                    }
                }
                doSearch();
            }
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
        clearBtn.on('click', function (e) {
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
                var avgAmount = data.aggregations.dealAmountAvg.value || 0;
                if (avgAmount > 0) {
                    avgAmount = new Number(avgAmount).toFixed(0);
                }
                $('#leadAvgValue').html(avgAmount);

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
        $('#sourcesPie svg').empty();

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

    function updateStagesPie(buckets) {
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
        initTagsSelect();
        doSearch();
    };

    w.doSearchLeadmanPage = function () {
        searchOptions.query = '';
        doSearch();
    };

})(this);