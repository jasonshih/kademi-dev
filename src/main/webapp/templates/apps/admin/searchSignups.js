function initSearchSignups() {
    initTableMembers();
    initSelectAll();
    initAddUsersToGroup();
}

function initTableMembers() {
    var table = $('#table-members');
    var trs = table.find('tbody tr');
    var counter = $('span.count');
    
    $('#show-user-select').val('').change(function () {
        var type = $(this).val();
        if (type.length > 0) {
            trs.hide();
            trs.filter('.' + type).show();
        } else {
            trs.show();
            
        }
        counter.text(trs.filter(':visible').length);
    });
    
    trs.filter('.membership').click(function (e) {
        $(this).next().toggle(300);
    });
};

function initAddUsersToGroup() {
    $('.btn-add-group').click(function (e) {
        var node = $(e.target);
        log('btn-add-group', node, node.is(':checked'));
        var checkBoxes = $('#table-members').find('tbody td input[name=toAddId]:checked');
        if (checkBoxes.length == 0) {
            Msg.error('Please select the users you want to remove by clicking the checkboxs to the right');
        } else {
            var groupName = $('#groupSelect').val();
            Kalert.confirm('Are you sure you want to add ' + checkBoxes.length + ' users to group ' + groupName + '?', function () {
                doAddUsers(checkBoxes, groupName);
            });
        }
    });
}

function doAddUsers(checkBoxes, groupName) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: 'json',
        url: '?group=' + groupName,
        success: function (data) {
            log('success', data);
            if (data.status) {
                Msg.success('Added members ok');
                $('#table-members').reloadFragment();
            } else {
                Msg.error('There was a problem adding users. Please try again and contact the administrator if you still have problems');
            }
        },
        error: function (resp) {
            Msg.error('An error occured. Please try again');
        }
    });
}          