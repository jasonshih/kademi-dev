(function (Bob, $, win, doc, undefined) {
	Bob.onDOMReady(function () {
		var body = $(doc.body);

		initLoadingOverlay();

		$('[data-toggled=display]').exist(function () {
			this.each(function () {
				var panel = $(this);
				var actor = $(panel.attr('data-actor'));
				var checkActor = function () {
					if (actor.is(':checked')) {
						panel.show();
					} else {
						panel.hide();
					}
				};

				checkActor();
				actor.on('click', function () {
					checkActor();
				});
			});
		});

		$('.date-picker').exist(function () {
			this.datepicker({
				autoclose: true
			});
		});

		$('.date-time-picker').exist(function () {
			this.datetimepicker();
		});

		$('.tabbable').exist(function () {
			this.each(function () {
				var wrapper = $(this);
				var tabHeader = wrapper.find('.nav-tabs');
				var links = tabHeader.find('a');
				var contents = wrapper.find('.tab-content').children();

				var hash = window.location.hash;

				if (hash === '') {
					links.eq(0).trigger('click');
				}

				links.each(function () {
					var link = $(this);
					link.on('click', function (e) {
						e.preventDefault();

						window.location.hash = $(this).attr('href') + '-tab';
					});
				});
			});

			$(window).on('hashchange',function () {
				var hash = window.location.hash.replace('-tab', '');
				$('.tabbable .nav-tabs a[href=' + hash + ']').trigger('click');
			}).trigger('hashchange');
		});

		$('.chk-all').exist(function () {
			this.each(function () {
				var chkAll = $(this);
				var table = chkAll.parents('table');
				var chks = table.find('tbody input:checkbox');

				chkAll.on('click', function () {
					chks.attr('checked', chkAll.is(':checked'));
				});
			});
		});

		$('.modal').exist(function () {
			this.each(function () {
				var modal = $(this);

				var dataWidth = 0;
				if (modal.hasClass('modal-lg')) {
					dataWidth = 1000;
				} else if (modal.hasClass('modal-md')) {
					dataWidth = 800;
				} else if (modal.hasClass('modal-sm')) {
					dataWidth = 600;
				} else if (modal.hasClass('modal-xs')) {
					dataWidth = 400;
				} else {
					dataWidth = 200;
				}

				modal.attr('data-witdh', dataWidth)
			});

			$(document.body).on('click', '[data-type=form-submit]', function (e) {
				e.preventDefault();

				$(this).closest('.modal').find('form').submit();
			});
		});

		// Clearer
		body.on('click', '[data-type=clearer]', function (e) {
			e.preventDefault();

			$($(this).data('target')).val('');
		});

		$('.table.table-data').exist(function () {
			this.each(function () {
				var dataTable = $(this);
				var cols = dataTable.find('colgroup col');
				var ths = dataTable.find('thead th');

				var aoColumnsSetting = [];
				cols.each(function (i) {
					var col = $(this);
					var th = ths.eq(i);

					aoColumnsSetting.push({
						"bSortable": !th.hasClass('action') && col.attr('data-sort') !== 'false'
					});
				});

				dataTable.dataTable({
					"aoColumnDefs": [
						{
							"aTargets": [0]
						}
					],
					"oLanguage": {
						"sLengthMenu": "Show _MENU_ Rows",
						"sSearch": "",
						"oPaginate": {
							"sPrevious": "",
							"sNext": ""
						}
					},
					"aaSorting": [
						[1, 'asc']
					],
					"aoColumns": aoColumnsSetting,
					"aLengthMenu": [
						[5, 10, 15, 20, -1],
						[5, 10, 15, 20, "All"]
					],
					"iDisplayLength": 10
				});

				var $wrapper = dataTable.parent();

				$wrapper.find('.dataTables_filter input').addClass("form-control input-sm").attr("placeholder", "Search");
				$wrapper.find('.dataTables_length select').addClass("m-wrap small");
				$wrapper.find('.dataTables_length select').select2();
			});
		});
	});

})(Bob, jQuery, window, document);

function initFuseModal(modal, callback) {
	if (modal.hasClass('modal-fuse-editor')) {
		var id = modal.attr('id');

		modal.wrap(
			'<div id="' + id + '-wrapper" class="modal-scrollable hide" style="z-index: 1030;"></div>'
		);

		var wrapper = modal.parent();
		var backdrop = $('<div id="' + id + '-backdrop" class="modal-backdrop fade hide" style="z-index: 1020;"></div>');
		wrapper.after(backdrop);

		modal.on('click', '[data-type=modal-dismiss]', function (e) {
			e.preventDefault();
			e.stopPropagation();

			closeFuseModal(modal);
		});

		wrapper.on('click', function (e) {
			if ($(e.target).is(wrapper)) {
				closeFuseModal(modal);
			}
		});

		if (typeof callback === 'function') {
			callback.apply(this);
		}

		var heightModal = 0;

		wrapper.removeClass('hide');
		wrapper.add(modal).addClass('invi');
		modal.addClass('calculating');

		var calculate = function () {
			heightModal = modal.outerHeight();
			modal.attr('data-height', heightModal);
			wrapper.add(modal).removeClass('invi');
			wrapper.addClass('hide');
			modal.removeClass('calculating');
		};

		var editor = modal.find('.htmleditor').get(0);
		var ckEditor = null;

		for (var key in CKEDITOR.instances) {
			if (CKEDITOR.instances[key].element.$ === editor) {
				ckEditor = CKEDITOR.instances[key];
				break;
			}
		}

		if (ckEditor) {
			ckEditor.on('instanceReady', function (evt) {
				calculate();
			});
		}

		Bob.onPageResized(function () {
			adjustModal(modal);
		});
	} else {
		if (typeof callback === 'function') {
			callback.apply(this);
		}
	}
}

function adjustModal(modal) {
	var height = +modal.attr('data-height');

	if ($(window).height() < height) {
		modal.css('margin-top', 0).addClass('modal-overflow');
	} else {
		modal.css('margin-top', height / -2).removeClass('modal-overflow');
	}
}

function openFuseModal(modal, callback, time) {
	var wrapper = modal.parent();
	var backdrop = wrapper.next();

	if (modal.hasClass(('modal-fuse-editor'))) {
		if (modal.attr('data-height')) {
			adjustModal(modal);
			$(document.body).addClass('modal-open');
			wrapper.removeClass('hide');
			backdrop.removeClass('hide');
			modal.show();

			setTimeout(function () {
				modal.addClass('in');
				backdrop.addClass('in');
			}, 0);

			if (typeof callback === 'function') {
				callback.apply(this);
			}
		} else {
			time = time ? time : 0;
			var time_string = time === 0 ? '' : ' (Tried ' + time + ' time(s))';
			if (confirm('This popup is still initializing. Do you want to try to reopen this' + time_string + '?')) {
				openFuseModal(modal, callback, time + 1);
			}
		}
	} else {
		modal.modal('show');

		if (typeof callback === 'function') {
			callback.apply(this);
		}
	}

}

function closeFuseModal(modal, callback) {
	if (modal.hasClass(('modal-fuse-editor'))) {
		var wrapper = modal.parent();
		var backdrop = wrapper.next();

		backdrop.add(modal).removeClass('in');

		setTimeout(function () {
			backdrop.addClass('hide');
			modal.hide();
			wrapper.addClass('hide');
			$(document.body).removeClass('modal-open');
		}, 400);
	} else {
		modal.modal('hide');
	}

	if (typeof callback === 'function') {
		callback.apply(this);
	}
}

function initLoadingOverlay() {
	if (!findLoadingOverlay()[0]) {
		$('.main-content').children('.container').prepend('<div class="loading-overlay hide"></div>');
	}
}

function findLoadingOverlay() {
	return $('.main-content').children('.container').find('.loading-overlay');
}

function showLoadingOverlay() {
	findLoadingOverlay().removeClass('hide');
}

function hideLoadingOverlay() {
	findLoadingOverlay().addClass('hide');
}

function getStandardEditorHeight() {
	return $(window).height() - 400;
}

function getStandardModalEditorHeight() {
	return getStandardEditorHeight() + 200;
}

function getStandardModalHeight() {
	return getStandardModalEditorHeight();
}