function initManageEmailTrigger() {
	initModalAddEmailTrigger();
	initFormTriggers();
}

function initModalAddEmailTrigger() {
	var modal = $('#modal-add-trigger');

	modal.find('form').forms({
		callback: function(resp) {
			log('resp', resp);
			modal.modal('hide');
			window.location.reload();
		}
	});
}

function initFormTriggers() {
	$('.form-triggers').forms({
		callback: function() {
			window.location.reload();
		}
	});
}

function initManageAutoEmail() {
	initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
	initAttachment();
	initForm();
	initIncludeUser();
	initEventType();
	initAdvanceRecipients();
	initSendTest();
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

function initSendTest() {
	$('.btn-sent-test').click(function(e) {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: window.location.pathname,
			data: 'sendTest=true',
			success: function(data) {
				alert('A test has been sent to your email address');
			},
			error: function(resp) {
				alert('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
			}
		});
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

function initEventType() {
	var eventType = $('.event-type');
	var chkEventId = $('#eventId');
	var checkEventId = function () {
		log('checkEventId');
		var eventId = chkEventId.val();
		log('changed', eventId);
		eventType.hide().find('select').attr('disabled', true);
		eventType.filter('.' + eventId).show().find('select').attr('disabled', false);
	};

	checkEventId();
	chkEventId.on('change', function () {
		checkEventId();
	});
}

function initIncludeUser() {
	var chkIncludeUser = $('#includeUser');

	chkIncludeUser.on('change', function() {
		var isIncludeUser = chkIncludeUser.is(':checked');
		log('includeUser', includeUser);
		$.ajax({
			type: 'POST',
			url: window.location.href,
			data: {
				includeUser: isIncludeUser
			},
			error: function(resp) {
				log('error', resp);
				alert('err');
			}
		});
	});
}

function initForm() {
	$('form[name=frmDetails]').forms({
		callback: function() {
			alert('Saved');
		}
	});
}

function initAttachment() {
	var attachmentsList = $('.attachments-list');

	$('.add-attachment').mupload({
		buttonText: 'Upload attachment',
		useJsonPut: false,
		oncomplete: function(data, name) {
			log('oncomplete. name=', name, 'data=', data);
			showAttachment(data, attachmentsList);
		}
	});

	attachmentsList.on('click', '.btn-delete-attachment', function(e) {
		e.preventDefault();

		var btn = $(this);
		var href = btn.attr('href');

		doRemoveAttachment(href, function() {
			btn.closest('article').remove();
		});
	});
}

function showAttachment(data, attachmentsList) {
	log('attach', data);

	var name = data.files[0].name;
	var hash = data.result.nextHref;

	attachmentsList.append(
		'<article>' +
			'<span class="article-name">' +
				'<a target="_blank" href="/_hashes/files/' + hash + '">' + name + '</a>' +
			'</span>' +
			'<aside class="article-action">' +
				'<a class="btn btn-xs btn-danger btn-delete-attachment" href="' + name + '" title="Remove"><i class="clip-minus-circle"></i></a>' +
			'</aside>' +
		'</article>'
	);
}

function doRemoveAttachment(name, callback) {
	try {
		$.ajax({
			type: 'POST',
			url: window.location.pathname,
			data: {
				removeAttachment: name
			},
			success: function(data) {
				log('saved ok', data);
				callback();
			},
			error: function(resp) {
				log('error', resp);
				alert('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
			}
		});
	} catch (e) {
		alert('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
	}
}