function initManageRepos() {
    log('initManageRepositories');

	var modal = $('#modal-new-repo');

	$('.btn-add-repo').on('click', function (e) {
		e.preventDefault();

		modal.modal('show');
	});

	modal.find('form').forms({
        callback: function(resp) {
            window.location.reload();
	        modal.modal('hide');
        }
    });
    
    $('a.btn-delete-repo').click(function(e) {
        e.preventDefault();
        var node = $(e.target);
        var href = node.attr('href');
        var name = getFileName(href);
        confirmDelete(href, name, function() {
            alert('Repository deleted');
            window.location.reload();
        });
    });

	$('td.public label').on('click', function(e) {
		e.preventDefault();

		var label = $(this);
		var wrapper = label.parents('.make-switch');

		setTimeout(function () {
			var isChecked = wrapper.find('input:checked').val() === 'true';

			setRepoPublicAccess(wrapper, isChecked);
		}, 0);
	});
}

function setRepoPublicAccess(wrapper, isPublic) {
    $.ajax({
        type: 'POST',
        data: {isPublic: isPublic},
        url: wrapper.attr('data-href'),
        success: function(data) {
        },
        error: function(resp) {
	        wrapper.find('label').trigger('click');
            alert('Sorry, couldnt update public access: ' +resp);
        }
    });       
}