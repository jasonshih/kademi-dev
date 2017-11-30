function initHtmlEditor(form) {
    initHtmlEditors(form.find('.htmleditor'), getStandardEditorHeight() + 'px', null, null, 'autogrow', function (editor) {
        editor.config.pagePath = window.location.pathname;
    });
}

function initDateRange() {
    flog('initDateRange');
    
    var inputStartTime = $('[name=startTime]');
    var inputEndTime = $('[name=endTime]');
    var inputPlaceholder = $('#availableFromTo');
    var startTime = inputStartTime.val();
    var endTime = inputEndTime.val();
    var availableTime = '';
    if (startTime && endTime) {
        startTime = moment(startTime).format('DD/MM/YYYY');
        endTime = moment(endTime).format('DD/MM/YYYY');
        availableTime = startTime + ' - ' + endTime;
    }
    
    inputPlaceholder.val(availableTime).attr('data-date', availableTime);
    inputPlaceholder.daterangepicker({
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        ranges: {
            'In 7 Days': [moment(), moment().add('days', 6)],
            'In 15 Days': [moment(), moment().add('days', 14)],
            'In 30 Days': [moment(), moment().add('days', 29)]
        }
    }, function (start, end) {
        flog('onChange', start, end);
        var isValid = moment(inputPlaceholder.val().trim(), 'DD/MM/YYYY - DD/MM/YYYY', true).isValid();
        
        if (isValid) {
            inputStartTime.val(start.toISOString());
            inputEndTime.val(end.toISOString());
            inputPlaceholder.attr('data-date', inputPlaceholder.val().trim())
        } else {
            inputPlaceholder.val(inputPlaceholder.attr('data-date'));
        }
    });
    
    if (!startTime || !endTime) {
        var currentValue = inputPlaceholder.val().trim();
        var isValid = moment(currentValue, 'DD/MM/YYYY - DD/MM/YYYY', true).isValid();
        
        if (isValid) {
            currentValue = currentValue.split(' - ');
            inputStartTime.val(moment(currentValue[0], 'DD/MM/YYYY').toISOString());
            inputEndTime.val(moment(currentValue[1], 'DD/MM/YYYY').toISOString());
            inputPlaceholder.attr('data-date', inputPlaceholder.val().trim())
        }
    }
}

function initDetailForm(form) {
    flog('initDetailForm');
    
    var answerContainer = $('#answer-container');
    var txtPoints = $('#point');
    
    txtPoints.on('input', function () {
        var points = txtPoints.val().trim();
        
        if (isNaN(points) || +points <= 0) {
            txtPoints.val(1);
        }
    });
    
    $('.btn-save-poll').on('click', function (e) {
        e.preventDefault();
        
        form.trigger('submit');
    });
    
    form.forms({
        validate: function () {
            var result = {
                error: 0,
                errorFields: [],
                errorMessages: []
            };
            
            var answers = answerContainer.find('.answer');
            if (answers.length < 2) {
                result.errorMessages.push('Your poll must have at least 2 answers!');
                result.error++;
                result.errorFields.push(answerContainer.find('[name=answers]'))
            }
            
            return result;
        },
        onSuccess: function (resp) {
            if (resp && resp.status) {
                Msg.success('Poll detail is saved!');
            } else {
                flog('Error when saving poll detail', resp);
                Msg.error('Error when saving poll detail. Please contact your system administrator for support.')
            }
        }
    });
}

function initTimeAgo() {
    $('.timeago').timeago();
}

function initGroupModal() {
    flog('initGroupModal');
    
    $('#modal-groups input:checkbox').on('click', function (e) {
        var input = $(this);
        var isChecked = input.is(':checked');
        var name = input.attr('name');
        
        $.ajax({
            url: window.location.pathname,
            data: {
                group: name,
                isAdd: isChecked
            },
            type: 'POST',
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    $('#group-list').reloadFragment({
                        whenComplete: function () {
                            Msg.success('Add/remove group is saved!');
                        }
                    });
                } else {
                    flog('Error when adding/removing group', resp);
                    Msg.error('Error when adding/removing group. Please contact your system administrator for support.');
                    input.prop('checked', !isChecked);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error when adding/removing group', jqXHR, textStatus, errorThrown);
                Msg.error('Error when adding/removing group. Please contact your system administrator for support.');
                input.prop('checked', !isChecked);
            }
        });
    });
}

function initAnswerersClearer() {
    flog('initAnswerersClearer');
    
    var btn = $('.btn-clear-answerers');
    btn.on('click', function (e) {
        e.preventDefault();
        
        if (confirm('Are you sure that you want to clear all answerers of this poll?')) {
            $.ajax({
                url: window.location.pathname,
                data: {
                    clearAnswerers: true
                },
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        $('#statistic').reloadFragment({
                            whenComplete: function (resp) {
                                var newDom = $('<div />').html(resp);
                                $('#table-answerers').html(newDom.find('#table-answerers').html());
                                Msg.success('Answerers list is cleared!');
                            }
                        });
                    } else {
                        flog('Error when clearing answerers list', resp);
                        Msg.error('Error when clearing answerers list. Please contact your system administrator for support.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error when clearing answerers list', jqXHR, textStatus, errorThrown);
                    Msg.error('Error when clearing answerers list. Please contact your system administrator for support.');
                }
            });
        }
    });
}

function initManagePoll() {
    flog('initManagePoll');
    
    var form = $('#form-poll');
    
    initTimeAgo();
    initHtmlEditor(form);
    initAnswersList();
    initDateRange();
    initDetailForm(form);
    initGroupModal();
    initAnswerersClearer();
}
