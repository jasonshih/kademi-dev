$(function () {
    var aggFields = $("#aggFields");

    var fields = [];

    var TYPES = {
        "AVG": "integer",
        "MAX": "integer",
        "MIN": "integer",
        "SUM": "integer",
        "PERCENTILES": "integer",
        "GEO_BOUND": "geo_point",
        "DATE_HISTOGRAM": "date",
        "DATE_RANGE": "date",
        "RANGE": "integer"
    };

    var SIZE = {
        "TERMS": true
    };

    var FORMAT = {
        "DATE_HISTOGRAM": true,
        "DATE_RANGE": true
    };

    var INTERVAL = {
        "DATE_HISTOGRAM": true
    };

    var RANGE = {
        "RANGE": true,
        "DATE_RANGE": true
    };

    $("body").on("click", ".clearAgg", function () {
        $("#aggSize").val("");
        $("#aggFormat").val("");
        $("#aggTo").val("");
        $("#aggFrom").val("");
        $("#aggInterval").val("");
        $("#aggregationType").val("");
        $("#aggFields").val("");
    });

    $("body").on("change", "#aggregationType", function () {
        aggFields.find('option').remove();
        var aggType = $(this).find(":selected").text();
        flog("Agg Type ", aggType);

        var fieldType = TYPES[aggType];
        $(fields).each(function () {
            var field = $(this)[0];
            if (fieldType === undefined || fieldType === field.type) {
                aggFields.append($('<option>', {value: field.id, text: field.id}));
            }
        });

        var showSize = SIZE[aggType];
        var divSize = $("#aggSize").closest("div");
        flog("Show size: ", showSize);
        if (showSize) {
            $(divSize).css("display", "inline");
        } else {
            $("#aggSize").val("");
            $(divSize).css("display", "none");
        }

        var showFormat = FORMAT[aggType];
        flog("Show format ", showFormat);
        var divFormat = $("#aggFormat").closest("div");
        if (showFormat) {
            $(divFormat).css("display", "inline");
        } else {
            $("#aggFormat").val("");
            $(divFormat).css("display", "none");
        }

        var showRange = RANGE[aggType];
        flog("Show range ", showRange);
        var divRange = $("#aggTo").closest("div");
        if (showRange) {
            $(divRange).css("display", "inline");
        } else {
            $("#aggTo").val("");
            $("#aggFrom").val("");
            $(divRange).css("display", "none");
        }

        var showInterval = INTERVAL[aggType];
        flog("Show interval ", showInterval);
        var divInterval = $("#aggInterval").closest("div");
        if (showInterval) {
            $(divInterval).css("display", "inline");
        } else {
            $("#aggInterval").val("");
            $(divInterval).css("display", "none");
        }

    });

    function saveQuery() {
        var builder = $('#query-builder');
        flog("Builder: ", builder);
        var rules = builder.queryBuilder('getRules');
        var query = builder.queryBuilder('getESBool');
        flog("Save Rules: ", rules, query);
        var querySize = ($.isNumeric($("#qbbSize").val())) ? $("#qbbSize").val() : 1000;
        var aggSize = ($.isNumeric($("#aggSize").val())) ? $("#aggSize").val() : 1000;

        var data = {
            queryBuilder: true,
            qbbRules: JSON.stringify(rules),
            qbbQuery: JSON.stringify(query),
            qbbSize: querySize,
            qbbFieldsSelected: $("#fieldsSelected").val(),
            qbbAggType: $("#aggregationType").val(),
            qbbAggField: $("#aggFields").val(),
            qbbAggSize: aggSize,
            qbbAggFormat: $("#aggFormat").val(),
            qbbAggInterval: $("#aggInterval").val(),
            qbbAggTo: $("#aggTo").val(),
            qbbAggFrom: $("#aggFrom").val()
        };

        flog("Data ", data);
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (resp) {
                $("#modal-select-fields").modal("hide");
                var dateOptions = getPageDateRange();
                flog("Saved, now run", dateOptions);
                var newHref = window.location.pathname;
                if (dateOptions) {
                    newHref += "?" + $.param(dateOptions); // from queryComponents.js, injected by ReportingApp
                }
                $("#queryData").reloadFragment({
                    url: newHref,
                    whenComplete: function () {
                        initTableResults();
                        loadQueryData();
                    }
                });
                $("#modal-select-fields").reloadFragment({
                    url: newHref,
                    whenComplete: function () {
                        initModalFields();
                    }
                });

            }
        });
    }

    $(".saveRules").on("click", function () {
        saveQuery();
    });

    function initModalFields() {
        $("#saveRulesModal").on("click", function () {
            saveQuery();
        });

        $("body").off("click", ".btn-add-field").on("click", ".btn-add-field", function () {
            var field = $(this).data("text");
            var selected = $("#fieldsSelected").val();
            var newVal = "";
            if (selected.indexOf(field) > -1 || selected.indexOf(field + ",") > -1) {
                newVal = selected.replace("," + field, "");
                newVal = newVal.replace(field, "");
                $(this).addClass("btn-success");
                $(this).removeClass("btn-danger");
                $(this).find("i").addClass("fa fa-plus");
                $(this).find("i").removeClass("clip-minus-circle");
            } else {
                newVal = (selected === "") ? field : selected + "," + field
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger");
                $(this).find("i").removeClass("fa-plus");
                $(this).find("i").addClass("clip-minus-circle");
            }
            flog("{.btn-add-field} -- newVal", newVal)
            $("#fieldsSelected").val(newVal);
        });
    }

    function initTableResults() {
        $("body").on("click", ".btn-remove-th", function () {
            var field = $(this).data("text");
            flog($("#fieldsSelected"));
            var selected = $("#fieldsSelected").val();
            var newVal = selected.replace("," + field, "");
            newVal = newVal.replace(field, "");
            flog("{.btn-remove-th} -- newVal", newVal)
            $("#fieldsSelected").val(newVal);
            saveQuery();
        });
        setTab();
    }

    function loadQueryData() {
        var builder = $('#query-builder');
        flog("Loading query data...");
        $.ajax({
            url: window.location.pathname + '?fields',
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                flog("Response: ", resp);
                var builderConf = {
                    allow_empty: true,
                    plugins: ['bt-tooltip-errors'],
                    filters: resp.data.filters
                };
                fields = resp.data.filters;
                $("#fieldsSelected").val(resp.data.fields);
                flog("Query Size: ", resp.data.size);
                $("#qbbSize").val(resp.data.size);

                if (resp.data.aggregationSource !== "") {
                    flog(resp.data.aggregationSource);
                    var agg = JSON.parse(resp.data.aggregationSource);
                    $("#aggregationType").val(agg.aggType);
                    $("#aggregationType").change();
                    $("#aggFields").val(agg.aggField);
                    $("#aggSize").val(agg.aggSize);

                    if (agg.ranges !== undefined) {
                        var range = agg.ranges[0];
                        if (range.to !== undefined) {
                            $("#aggTo").val(range.to);
                        }
                        if (range.from !== undefined) {
                            $("#aggFrom").val(range.from);
                        }
                    }
                    if (agg.aggFormat !== undefined) {
                        $("#aggFormat").val(agg.aggFormat);
                    }
                    if (agg.aggInterval !== undefined) {
                        $("#aggInterval").val(agg.aggInterval);
                    }
                }

                var rulesJson = {rules: [], condition: "AND"};
                if (resp.data.rules !== "" && resp.data.rules !== "{}" && resp.data.rules !== {}) {
                    rulesJson = JSON.parse(resp.data.rules);
                }
                flog("Rules Json", rulesJson)
                builderConf.rules = rulesJson;
                flog("Builder conf", builderConf);
                builder.queryBuilder(builderConf);
            }
        });
    }

    function setTab() {
        var target = window.location.hash.replace('-tab', "");
        if (target) {
            jQuery('a[href=' + target + ']').click().parent().trigger('keydown');
        }
    }

    $.getStyleOnce('/static/query-builder/2.3.3/css/query-builder.default.min.css');
    loadQueryData();
    initTableResults();
    initModalFields();
});