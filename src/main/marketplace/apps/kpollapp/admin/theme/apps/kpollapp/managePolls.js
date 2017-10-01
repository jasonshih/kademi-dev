function initTimeAgo() {
    $('.timeago').timeago();
}

function initPollBtns() {
    flog('initPollBtns');
    
    $('.btn-delete-polls').on('click', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        flog('On click .btn-delete-polls', btn);
        
        var selectedPolls = $('input[name=pollId]:checked');
        
        Kalert.confirm('You want to delete ' + selectedPolls.length + ' poll(s)?', function () {
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
        });
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
        onSuccess: function (resp) {
            Msg.success('New poll is created!');
            modal.modal('hide');
            window.location.href = '/kpoll/managePolls/' + resp.data.pollId;
        }
    });
}

function initMigrateBtn() {
    flog('initMigrateBtn');
    
    var btnMirage = $('.btn-migrate-kpollapp');
    btnMirage.on('click', function (e) {
        e.preventDefault();
        
        btnMirage.prop('disabled', true);
        
        $.ajax({
            url: '/migrateDataKpollApp',
            type: 'POST',
            dataType: 'JSON',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.success('Migration is done');
                } else {
                    Msg.error('Error in migrating. Please contact your administrators to resolve this issue.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Msg.error('Error in migrating: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                flog('Error in migrating', jqXHR, textStatus, errorThrown);
            },
            complete: function () {
                
                btnMirage.prop('disabled', false);
            }
        });
    });
}

function initManagePolls() {
    flog('initManagePolls');
    
    initTimeAgo();
    initPollBtns();
    initAnswersList();
    initPollModal();
    initMigrateBtn();
}
