function initManageDashboardMessage() {
	initHtmlEditors(jQuery('#message-template'), getStandardEditorHeight() - 100, null);

	$('#frm-message').forms({
        onSuccess: function(resp) {
			log('done save', resp);
			Msg.success('Saved');
		}
	});

	$('.btn-cancel').on('click', function (e) {
		e.preventDefault();

		window.location.reload();
	});
}