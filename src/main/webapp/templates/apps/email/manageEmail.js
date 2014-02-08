function initManageEmail() {
	initModalAddEmail();
	initDeleteEmail();
}

function initModalAddEmail() {
	var modal = $('#modal-add-email');

	modal.find('form').forms({
		callback: function (data) {
			log('saved ok', data);
			modal.modal('hide');
			window.location.href = data.nextHref;
		}
	});
}

function initDeleteEmail() {
	//Bind event for Delete email
	$('body').on('click', 'a.btn-delete-email', function(e) {
		e.preventDefault();
		
		var btn = $(e.target);
		log('do it', btn);

		var href = btn.attr('href');
		var name = getFileName(href);

		confirmDelete(href, name, function() {
			log('remove', btn);
			btn.closest('tr').remove();
		});
	});
}