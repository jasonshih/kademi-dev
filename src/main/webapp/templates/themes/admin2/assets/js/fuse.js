(function (Bob, $, win, doc, undefined) {
	Bob.onDOMReady(function () {
		var $body = $(doc.body);
        
        $('.modal').exist(function () {
            this.each(function () {
                var $modal = $(this);
                
                $modal.find('[data-type=form-submit]').on('click', function (e) {
                    e.preventDefault();
                    
                    $modal.find('form').submit();
                });
            });
        });

		$('.modal.modal-upload').exist(function () {
			this.each(function () {
				this.setAttribute('data-width', 800);
			});
		});

		$('.modal.modal-edit').exist(function () {
			this.each(function () {
				this.setAttribute('data-edit', 400);
			});
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