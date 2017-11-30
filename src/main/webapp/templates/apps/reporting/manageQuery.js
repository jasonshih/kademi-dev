$(document).ready(function () {
    Msg.singletonForCategory = true;

    var editor = ace.edit("queryText");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    function save(callback) {
        var json = editor.getValue();
        flog("save", json);
        $.ajax({
            type: 'POST',
            data: {
                query: json
            },
            dataType: "json",
            url: "",
            success: function (data) {
                flog("done save");
                Msg.info("Saved", "runningQuery");
                if (callback) {
                    callback();
                }
            },
            error: function (resp) {
                Msg.error("An error occured while saving", "runningQuery");
            }
        });
    }

    var heightUpdateFunction = function () {

        // http://stackoverflow.com/questions/11584061/
        var newHeight =
                editor.getSession().getScreenLength()
                * editor.renderer.lineHeight
                + editor.renderer.scrollBar.getWidth();

        if (newHeight.toString() === undefined || newHeight.toString() === "" || newHeight.toString() === "0") {
            flog("Default Height: 360px");
            $('#queryText').height("360px");
        } else {
            flog("New Height", newHeight.toString());
            $('#queryText').height(newHeight.toString() + "px");
        }


        // This call is required for the editor to fix all of
        // its inner structure for adapting to a change in size
        editor.resize();
    };

    // Set initial size to match initial content
    heightUpdateFunction();

    // Whenever a change happens inside the ACE editor, update
    // the size again
    editor.getSession().on('change', heightUpdateFunction);

    $("body").on("click", ".runQuery", function (e) {
        flog("Save, then run");
        save(function () {
            var dateOptions = getPageDateRange();
            flog("Saved, now run", dateOptions);
            var newHref = window.location.pathname;
            if (dateOptions) {
                newHref += "?" + $.param(dateOptions); // from queryComponents.js, injected by ReportingApp
            }
            flog("Saved, now run2", newHref);
            Msg.info("Running..", "runningQuery", newHref);
            $("#queryResults").reloadFragment({
                url: newHref,
                whenComplete: function () {
                    flog("Finished");
                    Msg.info("Query executed", "runningQuery");
                }
            });
        });
    });

    $(document).on('pageDateChanged', function (e, startDate, endDate) {
        flog("page date changed", startDate, endDate);
        var dateOptions = {
            startDate: startDate,
            endDate: endDate
        };
        var newHref = window.location.pathname + "?" + $.param(dateOptions); // from queryComponents.js, injected by ReportingApp
        Msg.info("Running...", "runningQuery", newHref);
        $("#queryResults").reloadFragment({
            url: newHref,
            whenComplete: function () {
                Msg.info("Query executed", "runningQuery");
            }
        });
    });

    $("body").on("click", ".saveQuery", function (e) {
        save();
    });
});
