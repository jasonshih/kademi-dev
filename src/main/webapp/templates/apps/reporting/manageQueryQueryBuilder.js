$(function () {
    Msg.singletonForCategory = true;

    var fields = [],
            TYPES = {
                "AVG": "integer",
                "MAX": "integer",
                "MIN": "integer",
                "SUM": "integer",
                "PERCENTILES": "integer",
                "GEO_BOUND": "geo_point",
                "DATE_HISTOGRAM": "date",
                "DATE_RANGE": "date",
                "RANGE": "integer"
            },
            SIZE = {
                "TERMS": true
            },
            FORMAT = {
                "DATE_HISTOGRAM": true,
                "DATE_RANGE": true
            },
            INTERVAL = {
                "DATE_HISTOGRAM": true
            },
            RANGE = {
                "RANGE": true,
                "DATE_RANGE": true
            };

    function saveQuery() {
        $('#aggregationForm').submit();
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
            newVal = newVal.replace(field + ",", "");
            flog("{.btn-remove-th} -- newVal", newVal)
            $("#fieldsSelected").val(newVal);
            saveQuery();
        });
        setTab();
    }

    function loadQueryData() {
        Msg.info("Running...", "runningQuery");
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

                if (resp.data.aggregationsSource !== "") {
                    var aggs = resp.data.aggregationsSource;
                    var ul = $('#aggregations-ul');
                    for (var i = 0; i < aggs.length; i++) {
                        var li;
                        if (i == 0) {
                            li = ul.find('li:first');
                        } else {
                            li = createNewAggRule();
                            li.appendTo(ul);
                        }
                        var agg = aggs[i];
                        flog("Agg: ", agg);
                        flog("Li: ", li);

                        li.find(".aggregationType").val(agg.aggType);
                        li.find(".aggregationType").change();
                        li.find(".aggFields").val(agg.aggField);
                        li.find(".aggSize").val(agg.aggSize);

                        if (agg.ranges !== undefined) {
                            var range = agg.ranges[0];
                            if (range.to !== undefined) {
                                li.find(".aggTo").val(range.to);
                            }
                            if (range.from !== undefined) {
                                li.find(".aggFrom").val(range.from);
                            }
                        }
                        if (agg.aggFormat !== undefined) {
                            li.find(".aggFormat").val(agg.aggFormat);
                        }
                        if (agg.aggInterval !== undefined) {
                            li.find(".aggInterval").val(agg.aggInterval);
                        }
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
                initLoadAggregations();
                var editor = ace.edit("queryText");
                editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode("ace/mode/javascript");
            }
        });
    }

    function setTab() {
        var target = window.location.hash.replace('-tab', "");
        if (target) {
            jQuery('a[href=' + target + ']').click().parent().trigger('keydown');
        }
    }

    function createNewAggRule() {
        var ul = $('#aggregations-ul');
        var newLi = ul.find('li:first').clone(true);
        var elementId = "li-" + ul.find("li").size();
        newLi.attr("id", elementId);
        newLi.find(".clearAgg").attr("data-li", elementId)
        return newLi;
    }

    function initLoadAggregations() {

        $('#aggregationForm').forms({
            beforePostForm: function (form, config, data) {
                var builder = $('#query-builder');
                flog("Builder: ", builder);
                var rules = builder.queryBuilder('getRules');
                var query = builder.queryBuilder('getESBool');
                flog("Save Rules: ", rules, query);
                var querySize = ($.isNumeric($("#qbbSize").val())) ? $("#qbbSize").val() : 1000;
                data = data + "&queryBuilder=true&qbbRules=" + JSON.stringify(rules) + "&qbbQuery=" + JSON.stringify(query) + "&qbbSize=" + querySize + "&qbbFieldsSelected=" + $("#fieldsSelected").val();
                flog("BeforePostForm", data);
                return data;
            },
            onSuccess: function (resp, form) {
                flog('aggregationForm :: ', resp);
                $("#modal-select-fields").modal("hide");
                var dateOptions = getPageDateRange();
                flog("Saved, now run", dateOptions);
                var newHref = window.location.pathname;
                if (dateOptions) {
                    newHref += "?" + $.param(dateOptions); // from queryComponents.js, injected by ReportingApp
                }
                Msg.info("Saved.", "runningQuery");
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

        function toggleDiv(show, div, input) {
            flog("Show ", $(input).attr("name"), ": ", show);
            if (show) {
                $(div).css("display", "inline");
            } else {
                $(input).val("");
                $(div).css("display", "none");
            }
        }

        $("body").on("change", ".aggregationType", function () {
            var li = $(this).closest("li");
            flog("Changed: ", li, $(this).val());
            // Field
            var aggFields = li.find(".aggFields");
            aggFields.find('option').remove();
            // Size
            var aggSize = li.find(".aggSize");
            var divSize = aggSize.closest("div");
            // Format
            var aggFormat = li.find(".aggFormat");
            var divFormat = aggFormat.closest("div");
            // Range
            var aggTo = li.find(".aggTo");
            var aggFrom = li.find(".aggFrom");
            var divRange = aggTo.closest("div");
            // Interval
            var aggInterval = li.find(".aggInterval");
            var divInterval = aggInterval.closest("div");

            var showSize = false, showFormat = false, showRange = false, showInterval = false;

            if ($(this).val() !== -1 && $(this).val() !== "-1") {
                var aggType = $(this).find(":selected").text();
                flog("Agg Type ", aggType);
                var fieldType = TYPES[aggType];
                $(fields).each(function () {
                    var field = $(this)[0];
                    if (fieldType === undefined || fieldType === field.type) {
                        aggFields.append($('<option>', {value: field.id, text: field.id}));
                    }
                });
                showSize = SIZE[aggType];
                showFormat = FORMAT[aggType];
                showRange = RANGE[aggType];
                showInterval = INTERVAL[aggType];
            }

            toggleDiv(showSize, divSize, aggSize);
            toggleDiv(showFormat, divFormat, aggFormat);
            toggleDiv(showRange, divRange, aggTo);
            toggleDiv(showRange, divRange, aggFrom);
            toggleDiv(showInterval, divInterval, aggInterval);
        });

        function clearAggLi(li) {
            $(li).find("input").val("");
            $(li).find(".aggregationType").val("-1").trigger("change");
            $(li).find(".aggFields").find('option').remove();
        }

        $("body").on("click", ".clearAgg", function () {
            var li = $(this).data("li");
            flog("clear", li);
            if (li === undefined) {
                clearAggLi($(this).closest("li"));
            } else {
                $("#" + li).remove();
            }
        });

        $("body").off("click", ".addAgg").on("click", ".addAgg", function () {
            var newLi = createNewAggRule();
            var ul = $('#aggregations-ul');
            newLi.appendTo(ul);
            var elementId = "li-" + ul.find("li").size();
            clearAggLi($("#" + elementId));
        });
    }

    $.getStyleOnce('/static/query-builder/2.3.3/css/query-builder.default.min.css');
    loadQueryData();
    initTableResults();
    initModalFields();
    initLoadAggregations();
});