function initGroupAdminPortlet() {
	log('init group admin portlet');

	$(document.body).on('change', '.modal-edit-programs input[type=radio]', function () {
		log('clicked', this);

		var radioBtn = $(this);
		var modal = radioBtn.closest('.modal');
		var groupName = modal.find('h4 span').text();
		var itemHref = radioBtn.closest('article').find('a').attr('href');

		saveGroupProgram(groupName, itemHref, radioBtn, modal);
	});
}

function saveGroupProgram(groupName, itemHref, radioBtn, modal) {
    var value = radioBtn.closest('form').find('input[name="' + radioBtn.attr('name') + '"]:checked').val();
	flog(value);
    try {
        $.ajax({
            type: 'POST',
            url: itemHref,
            data: {
                group: groupName,
                enrolement: value
            },
            dataType: 'json',
            success: function(response) {
                log('saved ok', response);

	            var id = modal.attr('data-program-id');

                $('#' + id).load(window.location.pathname + ' #' + id + '> *');

	            modal.modal('hide');
            },
            error: function(resp) {
                log('error', resp);
                Msg.error('An error occured updating the enrolement information');
            }
        });          
    } catch(e) {
        log('exception in createJob', e);
    }        
}
