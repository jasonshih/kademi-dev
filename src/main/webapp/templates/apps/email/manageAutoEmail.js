function initManageEmailTrigger() {
	initModalAddEmailTrigger();
	initFormTriggers();
}

function initModalAddEmailTrigger() {
	var modal = $('#modal-add-trigger');

	modal.find('form').forms({
		callback: function(resp) {
			log("resp", resp);
			modal.modal('hide');
			window.location.reload();
		}
	});
}

function initFormTriggers() {
	$(".form-triggers").forms({
		callback: function() {
			window.location.reload();
		}
	});
}