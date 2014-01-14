(function (Bob, $, win, doc, undefined) {
	function showErrors($result, errors) {
		var $table = $result.find('table'),
			$tbody = $table.find('tbody');

		$tbody.html('');

		$.each(errors, function(i, row) {
			log('error:', row);

			var $tr = $('<tr>');

			$tr.append('<td>' + row + '</td>');
			$tbody.append($tr);
		});

		$result.show();
	}

	function showUnmatched($result, unmatched) {
		var $table = $result.find('table'),
			$tbody = $table.find('tbody');

		$tbody.html('');

		$.each(unmatched, function(i, row) {
			log('unmatched', row);

			var $tr = $('<tr>');

			$.each(row, function(ii, field) {
				$tr.append('<td>' + field + '</td>');
			});
			$tbody.append($tr);
		});

		$result.show();
	}

	var ModalEditOrg = {
		init: function () {
			var self = this;
			self.$modal = $('#modal-edit-org').modal({
				show: false
			});
			self.$form = self.$modal.find('form');
			self.$inputs = self.$form.find('input');
			self.$selects = self.$form.find('select');

			self.$form.forms({
				callback: function(resp) {
					log('done', resp);
					alert('Saved ok. Please refresh to see changes');
					self.hide();
				}
			});
		},
		show: function (href) {
			var self = this,
				$modal = self.$modal,
				$form = self.$form,
				$inputs = self.$inputs,
				$selectes = self.$selects;

			if (href) {
				$form.attr('action', href);
			} else {
				$form.attr('action', win.location.pathname + '?newOrg');
			}

			$inputs.val('');
			$selectes.val('');
			log('select', $selectes.val());
			resetValidation($modal);

			if (href) {
				$.ajax({
					type: 'GET',
					url: href,
					dataType: 'json',
					success: function(response) {
						log('success', response);
						for (var key in response.data) {
							$modal.find('[name="' + key + '"]').val(response.data[key]);
							$modal.modal('show');
						}
					},
					error: function(response) {
						alert('err');
					}
				});
			} else {
				$modal.modal('show');
			}
		},
		hide: function () {
			this.$modal.modal('hide');
		}
	};

	Bob.onDOMReady(function () {
		var $body = $(doc.body);

		ModalEditOrg.init();

		$body.on('click', '.btn-delete-org', function (e) {
			e.preventDefault();

			var href = $(this).attr('href');

			confirmDelete(href, getFileName(href), function () {
				win.location.reload();
			});
		});

		$body.on('click', '.btn-edit-org', function(e) {
			e.preventDefault();

			ModalEditOrg.show($(this).attr('href'));
		});

		$('.btn-add-org').on('click', function (e) {
			e.preventDefault();

			ModalEditOrg.show(null);
		});

		// Upload CSV
		var $modalUploadCsv = $('#modal-upload-csv'),
			$resultUploadCsv = $modalUploadCsv.find('.upload-results');
		$('#do-upload-csv').mupload({
			buttonText: 'Upload spreadsheet',
			url: 'orgs.csv',
			useJsonPut: false,
			oncomplete: function(data, name, href) {
				log('oncomplete:', data.result, name, href);
				if (data.result.status) {
					$resultUploadCsv.find('.num-update').text(data.result.data.numUpdated);
					$resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
					showUnmatched($resultUploadCsv, data.result.data.unmatched);
					alert('Upload completed. Please review any unmatched organisations below, or refresh the page to see the updated list of organisations');
				} else {
					alert('There was a problem uploading the organisations: ' + data.result.messages);
				}
			}
		});
		var $formUploadCsv = $modalUploadCsv.find('form');
		$('#allow-inserts').on('click', function(e) {
			log('click', e.target);
			if (this.checked) {
				$formUploadCsv.attr('action', 'orgs.csv?insertMode=true');
			} else {
				$formUploadCsv.attr('action', 'orgs.csv');
			}
		});

		// Upload OrgId CSV
		var $modalUploadOrgidCsv = $('#modal-upload-orgid-csv'),
			$resultUploadOrgidCsv = $modalUploadOrgidCsv.find('.upload-results');
		$('#do-upload-orgid-csv').mupload({
			buttonText: 'Upload OrgIDs spreadsheet',
			url: 'orgIds.csv',
			useJsonPut: false,
			oncomplete: function(data, name, href) {
				log('oncomplete:', data.result, name, href);
				if (data.result.status) {
					$resultUploadOrgidCsv.find('.num-update').text(data.result.data.numUpdated);
					$resultUploadOrgidCsv.find('.num-errors').text(data.result.data.errors.length);
					showErrors($resultUploadOrgidCsv, data.result.data.errors);
					alert('Upload completed. Please review any unmatched organisations below, or refresh the page to see the updated list of organisations');
				} else {
					alert('There was a problem uploading the organisations: ' + data.result.messages);
				}
			}
		});
	});
})(Bob, jQuery, window, document);