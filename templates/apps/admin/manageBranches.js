function initManageBranches() {
	var branchWrapper = $('#branch-wrapper');

	branchWrapper.on('click', '.btn-hide-branch', function (e) {
		e.preventDefault();

        var a = $(this);
        setVisibility(a, true);
	});

	branchWrapper.on('click', '.btn-unhide-branch', function (e) {
		e.preventDefault();

        var a = $(this);
        setVisibility(a, false);
    });
}

function setVisibility(link, hidden) {
    log('setVisibility', link, hidden);

    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        data: {
            name: link.attr('href'),
            hide: hidden
        },
        dataType: 'json',
        success: function(resp) {
            if( resp && resp.status ) {
            	Msg.success(link.closest('tr').find('td:first').text() + ' is ' + (hidden ? 'hidden' : 'shown') + '!');
                $('#branch-wrapper').reloadFragment();
            } else {
                Msg.error('Sorry, had an error - ' + resp.messages)
            }
        },
        error: function(resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt set the visibility ' + resp);
        }
    });
}