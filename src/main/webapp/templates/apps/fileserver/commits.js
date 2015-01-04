function initManageRepoHistory() {
	initEvents();
}

function initEvents() {
    var wrapper = $('#commit-wrapper');

	$('abbr.timeago').timeago();

    wrapper.on('click', '.btn-restore-repo', function (e) {
		var node = $(e.target);
		var hash = node.attr('rel');
		confirmRevert(hash, null, {
			getPageUrl: function () {
				return '.'
			},
			afterRevertFn: function () {
                Msg.success('Reverted to ' + hash + '!');
                wrapper.reloadFragment();
			}
		});
	});

	var btnSetHash = $('.btn-set-hash');
	btnSetHash.attr('data-href', btnSetHash.attr('href'));
	btnSetHash.removeAttr('href');
	btnSetHash.click(function (e) {
		e.preventDefault();
		var link = $(e.target).closest('a');
		var newHash = prompt('Please enter a new hash');
		if (newHash != null && newHash.trim().length > 0) {
			setHash(link, newHash);
		}
	});
}

function setHash(link, newHash) {
	log('setHash', link, newHash, link);
	$.ajax({
		type: 'POST',
		data: {newHash: newHash},
		url: link.attr('data-href'),
		dataType: 'json',
		success: function (data) {
			log('done', data);
			if (data.status) {
                Msg.success('Reverted to ' + newHash + '!');
                $('#commit-wrapper').reloadFragment();
			} else {
				Msg.error('An error occured updating the branch: ' + data.messages);
			}
		},
		error: function (resp) {
			Msg.error('Sorry, couldnt update public access: ' + resp);
		}
	});
}
            