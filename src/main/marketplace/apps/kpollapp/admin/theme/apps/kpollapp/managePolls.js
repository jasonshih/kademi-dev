function initTimeAgo() {
    $('.timeago').timeago();
}

function initPollBtns() {
    flog('initPollBtns');

    var body = $(document.body);
    body.on('click', '.btn-delete-poll', function (e) {
        e.preventDefault();

        var btn = $(this);
        flog('On click .btn-delete-poll', btn);
        var id = btn.attr('data-id');

        if (confirm('Are you sure that you want to delete this poll?')) {
            $.ajax({
                url: '/kpoll/managePolls/',
                type: 'POST',
                data: {
                    isDelete: true,
                    pollId: id
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        btn.closest('tr').remove();
                        Msg.success('The poll is deleted!');
                    } else {
                        flog('Error when deleting poll', resp);
                        Msg.error('Error when deleting poll. Please contact your system administrator for support.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error when deleting poll', jqXHR, textStatus, errorThrown);
                    Msg.error('Error when deleting poll. Please contact your system administrator for support.');
                }
            });
        }
    });

    $('.btn-delete-polls').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);
        flog('On click .btn-delete-polls', btn);

        var selectedPolls = $('input[name=pollId]:checked');

        if (confirm('Are you sure that you want to delete ' + selectedPolls.length + ' poll(s)?')) {
            var pollId = [];
            selectedPolls.each(function () {
                pollId.push(this.value);
            });

            $.ajax({
                url: '/kpoll/managePolls/',
                type: 'POST',
                data: {
                    isDelete: true,
                    pollId: pollId.join(',')
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        $('#poll-list').reloadFragment({
                            whenComplete: function () {
                                initTimeAgo();
                                $('input:checkbox').prop('checked', false);
                                Msg.success(selectedPolls.length + ' poll(s) are deleted!');
                            }
                        });                                                
                    } else {
                        flog('Error when deleting poll', resp);
                        Msg.error('Error when deleting poll. Please contact your system administrator for support.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error when deleting poll', jqXHR, textStatus, errorThrown);
                    Msg.error('Error when deleting poll. Please contact your system administrator for support.');
                }
            });
        }
    });
}

function initPollModal() {
    flog('initPollModal');

    var modal = $('#modal-poll');
    var form = modal.find('form');

    form.forms({
        validate: function () {
            var container = $('#answer-container');
            var totalAnswers = container.find('.answer');

            if (totalAnswers.length > 1) {
                return true;
            } else {
                alert('You need at least 2 answers for this question!');

                return false;
            }
        },
        callback: function (resp) {
            Msg.success('New poll is created!');
            modal.modal('hide');
            window.location.href = '/kpoll/managePolls/' + resp.data.pollId;
        }
    });
}

function initManagePolls() {
    flog('initManagePolls');

    initTimeAgo();
    initPollBtns();
    initAnswersList();
    initPollModal();
}
