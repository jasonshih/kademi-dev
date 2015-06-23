$(function() {
	initCsvModal();
});

function showErrors($result, errors) {
    var $table = $result.find('table'),
            $tbody = $table.find('tbody');

    $tbody.html('');

    $.each(errors, function (i, row) {
        log('error:', row);

        var $tr = $('<tr>');

        $tr.append('<td>' + row + '</td>');
        $tbody.append($tr);
    });

    $result.show();
}

function initCsvModal() {
	var $modalUploadCsv = $('#csvModal');
	var $resultUploadCsv = $modalUploadCsv.find('.upload-results');
	$('#do-upload-csv').mupload(
			{
				buttonText : '<i class="clip-folder"></i> Upload CSV file',
				url : 'upload.csv',
				useJsonPut : false,
				oncomplete : function(data, name, href) {
					log('oncomplete:', data.result, name, href);
					if (data.result.status) {
						$resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
						$resultUploadCsv.find('.num-errors').text(data.result.data.errors.length);
						showErrors($resultUploadCsv, data.result.data.errors);
						Msg.success('Upload completed.');
					} else {
						Msg.error('There was a problem uploading the data: ' + data.result.messages);
					}
					$("#records-body").reloadFragment();
				}
			});	
}