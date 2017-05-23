$(function () {
    initProposalDetailsForm();
});

function initProposalDetailsForm() {
    var form = $('.proposal-details-form');
    if (form.length > 0) {
        form.find('.proposal-customer').entityFinder({
            url: '/custs',
            useActualId: true,
            type: 'profile'
        });
        
        form.forms({
            onSuccess: function (resp) {
                flog(resp, '=================')
            }
        });
    }
}
