function initManageRepoHistory() {
	initEvents();
}

function initEvents() {
	$('abbr.timeago').timeago();

	$('.btn-restore-repo').click(function (e) {
		var node = $(e.target);
		var hash = node.attr('rel');
		confirmRevert(hash, null, {
			getPageUrl: function () {
				return '.'
			},
			afterRevertFn: function () {
				window.location.reload();
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
				window.location.reload();
			} else {
				alert('An error occured updating the branch: ' + data.messages);
			}
		},
		error: function (resp) {
			alert('Sorry, couldnt update public access: ' + resp);
		}
	});
}
            