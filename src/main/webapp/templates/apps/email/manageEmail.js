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

function initChooseGroup() {
	initChooseGroupModal();
	initRemoveRecipientGroup();
}

function initChooseGroupModal() {
	var modal = $('#modal-choose-group');

	modal.find('input:radio').on('click', function () {
		var radioBtn = $(this);

		console.log('a');

		log("radiobutton click", radioBtn, radioBtn.is(":checked"));
		setGroupRecipient(radioBtn.attr('name'), radioBtn.val());
	});
}

function setGroupRecipient(name, groupType) {
	log("setGroupRecipient", name, groupType);
	try {
		$.ajax({
			type: 'POST',
			url: window.location.href,
			data: {
				group: name,
				groupType: groupType
			},
			success: function(data) {
				log("saved ok", name);

				var blockWrapper = $('#recipients').find('.blocks-wrapper');
				blockWrapper.find('.block.' + name).remove();

				log("add to list");
				blockWrapper.filter('.' + groupType).append(
					'<span class="block ' + name + '">' +
						'<span class="block-name">' + name + '</span>' +
						'<a class="btn btn-xs btn-danger btn-remove-role" href="' + name + '" title="Remove this role"><i class="clip-minus-circle "></i></a>' +
						'</span>'
				);
			},
			error: function(resp) {
				log("error", resp);
				alert("err");
			}
		});
	} catch (e) {
		log("exception in createJob", e);
	}
}

function initRemoveRecipientGroup() {
	var blockWrapper = $('#recipients');
	log('initRemoveRecipientGroup');

	blockWrapper.on('click', '.btn-remove-role', function(e) {
		log('click', this);
		e.preventDefault();
		e.stopPropagation();

		if (confirm('Are you sure you want to remove this group?')) {
			var btn = $(this);
			log('do it', btn);

			var href = btn.attr('href');
			deleteFile(href, function() {
				btn.closest('span.block').remove();
				$('#modal-choose-group').find('input:radio').filter('[name=' + href + ']').removeAttr('checked');
			});
		}
	});
}

function initAdvanceRecipients() {
	var showAdvanced = $('#showAdvanced');
	var scriptXml = $('textarea[name=filterScriptXml]');

	if (scriptXml.val().length > 0 && !showAdvanced.is(':checked')) {
		log('show adv');
		showAdvanced.trigger('click');
	}
}

function initFormDetailEmail() {
	$('form[name=frmDetails]').forms({
		callback: function() {
			alert('Saved');
		}
	});
}