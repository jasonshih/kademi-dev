$(function () {
    $(".timesheet-table").each(function (i, n) {
        var table = $(n);

        $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
            flog("reloading", table.attr("id"));
            table.reloadFragment();
        });

        table.on("change", ".timesheet-item", function (e) {
            try {
                flog("item changed");
                var node = $(e.target);
                flog("item changed2");
                var tr = node.closest("tr");
                flog("item changed3");
                tr.find("input").prop("disabled", false);
            } catch (e) {
                flog("Error: ", e);
            }
        });

        table.on("change", ".timesheet-hours", function (e) {
            var node = $(e.target);

            flog("Changed node2", node, node.data("day"));
            var hours = node.val();
            var date = node.data("day");
            var item = node.closest("tr").find(".timesheet-item").val();
            $.ajax({
                url: '/timesheets/',
                type: 'post',
                data: {
                    item: item,
                    hours: hours,
                    date: date
                },
                dataType: 'json',
                success: function (resp) {
                    flog("success");
                    if (resp && resp.status) {
                        Msg.info("Saved");
                    } else {
                        Msg.error(resp.messages.join('\n'));
                    }
                },
                error: function (resp) {
                    Msg.error("Sorry, couldnt save the times");
                }
            });
        })
    });
});



