$(function () {
    initProposalDetailsForm();
});

function initProposalDetailsForm() {
    var modal = $("#addQuoteInProposalModal");

    if (modal.length > 0) {
        var form = modal.find("form");

        form.forms({
            callback: function (resp) {
                flog("done", resp);
                modal.modal('hide');
                Msg.success('Quote is created!');
                reloadQuoteTable();
            }
        });

        form.find("#supplier").entityFinder({
            url: '/custs',
            useActualId: true
        });
    }

    var form = $('.proposal-details-form');

    if (form.length > 0) {
        form.find('.proposal-customer').entityFinder({
            url: '/custs',
            useActualId: true,
            type: 'profile'
        });

        form.forms({
            onSuccess: function (resp) {
                if (resp.nextHref) {
                    Msg.success('Proposal is created successfully. Redirecting to details page...');
                    window.location.href = resp.nextHref;
                } else {
                    Msg.success('Details is saved');
                }
            }
        });

        $('.btn-quick-add-line-item').on('click', function (e) {
            e.preventDefault();

            $('.add-quote-line-item-wrapper').toggle();
        });

        var ddlStatus = $('.proposal-status');
        if (ddlStatus.length > 0) {
            ddlStatus.find('a').on('click', function (e) {
                e.preventDefault();

                var a = $(this);
                var status = a.attr('href').replace('#', '');

                $.ajax({
                    url: window.location.pathname,
                    type: 'post',
                    data: {
                        status: status
                    },
                    dataType: 'json',
                    success: function (resp) {
                        if (resp && resp.status) {
                            $('#proposal-status').html(status);
                            ddlStatus.find('.fa-check').removeClass('fa-check');
                            a.find('.fa').addClass('fa-check');
                        } else {
                            Msg.error('Can\'t update status. Please contact your administrator to resolve this issue');
                            flog('Error when updating status', resp);
                        }
                    }
                });
            });
        }
    }

    function reloadQuoteTable() {
        var href = window.location.pathname;

        $('#quotesTable').reloadFragment({
            url: href,
            whenComplete: function () {
                $('abbr.timeago').timeago();
            }
        });
    }
}
