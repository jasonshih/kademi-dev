function initGroupAdminPortlet() {
	log('init group admin portlet');

	$(document.body).on('change', 'input[type=radio]', function () {
		log('clicked', this);

		var radioBtn = $(this);
		var modal = radioBtn.closest('.modal');
		var groupName = modal.find('h4 span').text();
		var itemHref = radioBtn.closest('article').find('a').attr('href');

		console.log(groupName, itemHref, radioBtn, modal);

		saveGroupProgram(groupName, itemHref, radioBtn, modal);
	});
}

function saveGroupProgram(groupName, itemHref, radioBtn, modal) {
    var value = radioBtn.closest('form').find('input[name="' + radioBtn.attr('name') + '"]:checked').val();
	console.log(value);
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

	            var groupDiv = modal.closest('[data-role="group-programs"]');
	            var groupId = groupDiv.attr('id');
                groupDiv.load(window.location.pathname + ' #' + groupId + '> *');

	            modal.modal('hide');
            },
            error: function(resp) {
                log('error', resp);
                alert('An error occured updating the enrolement information');
            }
        });          
    } catch(e) {
        log('exception in createJob', e);
    }        
}