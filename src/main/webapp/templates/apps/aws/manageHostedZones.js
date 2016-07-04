(function () {

    function initCreateHostedZone() {
        $('body').on('click', '.btn-create-hz', function (e) {
            e.preventDefault();

            var domainName = prompt('Please enter the full domain name, e.g. example.com');
            if (domainName !== null && domainName.length > 0) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        createHostedDomain: domainName
                    },
                    success: function (resp, textStatus, jqXHR) {
                        Msg.info(resp.messages);
                        refreshZoneTable();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        flog('error', textStatus, errorThrown);
                    }
                });
            }
        });
    }

    function initDeleteHostedZone() {
        $('body').on('click', '.btn-delete-hz', function (e) {
            e.preventDefault();

            var btn = $(this);
            var href = btn.attr('href');
            var name = btn.data('name');

            confirmDelete(href, name, function () {
                refreshZoneTable();
            });
        });
    }

    function refreshZoneTable() {
        $('#zone-tbody').reloadFragment();
    }

    $(function () {
        initCreateHostedZone();
        initDeleteHostedZone();
    });
})();