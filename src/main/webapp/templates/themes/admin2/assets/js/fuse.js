(function (Bob, $, win, doc, undefined) {
	Bob.onDOMReady(function () {
		var body = $(doc.body);

		$('.modal').exist(function () {
			this.each(function () {
				var modal = $(this);

				modal.on('click', '[data-type=form-submit]', function (e) {
					e.preventDefault();

					modal.find('form').submit();
				});

				var dataWidth = 0;
				if (modal.hasClass('modal-lg')) {
					dataWidth = 1000;
				} else if (modal.hasClass('modal-md')) {
					dataWidth = 800;
				} else if (modal.hasClass('modal-sm')) {
					dataWidth = 600;
				} else if (modal.hasClass('modal-xs')) {
					dataWidth = 400;
				}

				modal.attr('data-witdh', dataWidth)
			});
		});

		// Clearer
		body.on('click', '[data-type=clearer]', function (e) {
			e.preventDefault();

			$($(this).data('target')).val('');
		});

		$('.table.table-data').exist(function () {
			this.each(function () {
				var $tableData = $(this),
					col_length = $tableData.find('thead').find('th').length;

				var aoColumnsSetting = [];
				for (var i = 0; i < col_length; i++) {
					aoColumnsSetting.push({
						"bSortable": i < col_length - 1
					});
				}

				$tableData.dataTable({
					"aoColumnDefs": [{
						"aTargets": [0]
					}],
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
					"aoColumns":aoColumnsSetting,
					"aLengthMenu": [
						[5, 10, 15, 20, -1],
						[5, 10, 15, 20, "All"]
					],
					"iDisplayLength": 10
				});

				var $wrapper = $tableData.parent();

				$wrapper.find('.dataTables_filter input').addClass("form-control input-sm").attr("placeholder", "Search");
				$wrapper.find('.dataTables_length select').addClass("m-wrap small");
				$wrapper.find('.dataTables_length select').select2();
			});
		});
	});

})(Bob, jQuery, window, document);