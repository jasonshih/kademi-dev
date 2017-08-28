(function ($) {

    function initCreateTopicForm() {
        var modal = $('#modal-krecognition-create-topic');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp, form, config) {
                window.location = resp.nextHref;
            },
            onError: function () {
                Kalert.error('Oh No! Something went wrong!');
            }
        });

        modal.on('hidden.bs.modal', function (e) {
            form.trigger('reset');
        });
    }

    function initDeleteTopic() {
        $('body').on('click', '.btn-krecognition-delete-topics', function (e) {
            e.preventDefault();

            var ids = [];

            $('.chk-krecognition-topic:checked').each(function (i, item) {
                var id = $(item).val();
                ids.push(id);
            });

            if (ids.length < 1) {
                Msg.info('Please select at least one topic to delete');
            } else {
                Kalert.confirm('You want to delete ' + ids.length + ' topic' + (ids.length > 1 ? 's' : '') + '?', '', function () {
                    for (var i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        deleteFile(location.pathname + id + '/');
                    }

                    $('#table-krecognition-topics').reloadFragment();

                    Msg.info('Successfully deleted ' + ids.length + ' topic' + (ids.length > 1 ? 's' : ''));

                    $('.chk-all').attr('checked', false);
                });
            }
        });
    }

    $(function () {
        initCreateTopicForm();
        initDeleteTopic();
    });
})(jQuery);

