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

                modalForm.find('.progress').hide();
                modal.modal('hide');

                initBackgroundTask();
            },
            onProgress: function (percentComplete, form) {
                modalForm.find('.progress').show();
                modalForm.find('.progress .progress-bar')
                        .css('width', percentComplete + '%')
                        .attr('aria-valuenow', percentComplete);
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

        modal.find('.btn-select-showRemoteFields').click(function (e) {
            flog(e, this);

            var btn = $(this);
            var val = btn.find('input[name=showRemoteFields]').val();

            if (val === 'true') {
                modal.find('.backups-remote-server-field').find('input').addClass('required');
                modal.find('.backups-remote-server-field').show();
            } else {
                modal.find('.backups-remote-server-field').find('input').removeClass('required');
                modal.find('.backups-remote-server-field').hide();
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
                Kalert.confirm('You want to create a backup?', 'Ok', function () {
                    Msg.info('Processing Backup');
                    var options = $('#options [type=checkbox].option');

                    var data = {
                        startBackup: true
                    };
                    options.each(function (count, item) {
                        var t = $(item);
                        var checked = t.is(":checked");
                        if (checked) {
                            data[t.attr('name')] = checked;
                        }
                    });

                    $.ajax({
                        type: 'POST',
                        dataType: 'JSON',
                        data: data,
                        success: function (resp) {
                            Msg.success('Backup process has been submitted');
                            initBackgroundTask();
                        },
                        error: function () {
                            Msg.error('Oh No! Something went wrong!');
                        }
                    });
                });
            }
        });
    }

    // Init background task
    function initBackgroundTask() {
        initBackgroundJobStatus({
            onComplete: function () {
                $('#downloadBtn').show();
                $('#btn-restore').show();
                $('#backup-records-table').reloadFragment();
                $('#restore-records-table').reloadFragment();
            },
            onRunning: function () {
                $('#downloadBtn').hide();
                $('#btn-restore').hide();
            },
            onError: function () {
                $('#downloadBtn').show();
                $('#btn-restore').show();
            }
        });
    }

    // Run init functions
    $(function () {
        initUploadButton();
        initStartBackup();
        initBackgroundTask();
    });
})(jQuery);