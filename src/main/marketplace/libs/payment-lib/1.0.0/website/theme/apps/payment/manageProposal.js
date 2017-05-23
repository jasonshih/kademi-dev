$(function () {
    initProposalDetailsForm();
    initProposalQuotes();
    initQuoteModal();
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
                if (resp.nextHref) {
                    Msg.success('Proposal is created successfully. Redirecting to details page...');
                    window.location.href = resp.nextHref;
                } else {
                    Msg.success('Details is saved');
                }
            }
        });
    }
}

function initProposalQuotes() {

}

function initQuoteModal() {
    var modal = $('#modal-create-quote');
    if (modal.length > 0) {
        modal.on('hidden.bs.modal', function () {
            modal.find('input').not(':hidden').val('');
        });
        
        modal.find('form').forms({
            onSuccess: function (resp) {
                flog('=================', resp);
            }
        });
    }
}
