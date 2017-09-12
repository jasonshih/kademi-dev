(function ($) {
    // Upload Button
    function initUploadButton() {
        var modal = $('#modal-upload-file');
        var modalForm = modal.find('form');

        modalForm.forms({
            beforePostForm: function (form, config, data) {
                var options = $('#options [type=checkbox].option');

                options.each(function (count, item) {
                    var t = $(item);
                    var checked = t.is(":checked");
                    if (checked) {
                        data.append(t.attr('name'), checked);
                    }
                });

                return data;
            },
            onSuccess: function (resp) {
                Msg.success(resp.messages);
            }
        });

        $(document).on('change', '.btn-file :file', function () {
            var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);
        });

        $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text'),
                    log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log)
                    alert(log);
            }

        });
    }

    // Backup Button
    function initStartBackup() {
        $('body').on('click', '#downloadBtn', function (e) {
            e.preventDefault();

            if ($('#options [type=checkbox].option:checked').length < 1) {
                Msg.warning("Please select at least one category to backup");
            } else {
                Msg.info('Processing Backup');
                var options = $('#options [type=checkbox].option');

                var data = {
                    
                };
                options.each(function (count, item) {
                    var t = $(item);
                    var checked = t.is(":checked");
                    if (checked) {
                        data[t.attr('name')] = checked;
                    }
                });
            }
        });
    }

    // Run init functions
    $(function () {
        initUploadButton();
        initStartBackup();
    });
})(jQuery);