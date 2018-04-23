$(function() {
    $(".timesheet-table").each(function(i, n){
        var table = $(n);
        table.on("change", ".timesheet-hours", function(e) {
            var node = $(e.target);

            flog("Changed node2", node, node.data("day"));
            var hours = node.val();
            var date = node.data("day");
            var item = node.closest("tr").find(".timesheet-item").val();
            $.ajax({
                url: '/timesheets/',
                type: 'post',
                data: {
                    item : item,
                    hours: hours,
                    date : date
                },
                dataType: 'json',
                success: function (resp) {
                    flog("success");
                    if (resp && resp.status ) {
                        Msg.info("Saved");
                    } else {
                        Msg.error(resp.messages.join('\n'));
                    }
                },
                error : function(resp) {
                    Msg.error("Sorry, couldnt save the times");
                }
            });
        })
    });
});



