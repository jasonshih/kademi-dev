function initManageExperiments() {
    initCreateExperiment();
    initDeleteExperiments();
}

function initManageExperiment() {
    initUpdateExperiment();
    initDeleteVariants();
}

function initUpdateExperiment() {
    $('form.updateExperiment').forms({
        onSuccess: function (resp) {
            $('#experimentTableContainer').reloadFragment({
                whenComplete: function () {
                    Msg.success('The operation was successfully');
                    $('#addExperimentModal').modal('hide');
                }
            });
        },
        error: function (resp) {
            flog('Error: ', resp);
            $('#addExperimentModal').modal('hide');
        }
    });
    
    $('form.createVariant').forms({
        onSuccess: function (resp) {
            $('#experimentTableContainer').reloadFragment({
                whenComplete: function () {
                    Msg.success('The operation was successfully');
                    $('#addVariantModal').modal('hide');
                }
            });
        },
        error: function (resp) {
            flog('Error: ', resp);
            $('#addVariantModal').modal('hide');
        }
    });
    
    $('body').on('click', '.btn-edit-variant', function (e) {
        e.preventDefault();
        var btn = $(this);
        var id = btn.data('id');
        var perc = btn.closest('tr').find('.variant-perc').text();
        var newPerc = prompt('Please enter the new percentage for this variant', perc);
        if (newPerc) {
            updateVariant(id, newPerc);
        }
        
    });
}

function initCreateExperiment() {
    $('form.createExperiment').forms({
        onSuccess: function (resp) {
            flog('The operation was successfully', resp);
            Msg.success('The operation was successfully');
            $('#experimentTableContainer').reloadFragment();
            $('#addExperimentModal').modal('hide');
        },
        error: function (resp) {
            flog('Error: ', resp);
            $('#addExperimentModal').modal('hide');
        }
    });
}

function initDeleteVariants() {
    flog('initDeleteVariants');
    $('body').on('click', '.btn-delete-variants', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.variant-check:checked').each(function () {
            var s = $(this);
            var id = s.data('id');
            listToDelete.push(id);
        });
        flog('List To Delete', listToDelete.join(','));
        if (listToDelete.length > 0 && confirm('Are you sure you want to delete ' + listToDelete.length + ' variants?')) {
            deleteElements(listToDelete.join(','), function (data) {
                if (data.status) {
                    Msg.info(data.messages);
                    $('#experimentTableContainer').reloadFragment();
                } else {
                    Msg.error('An error occured deleting the variants. Please check your internet connection');
                }
            });
        }
    });
}


function initDeleteExperiments() {
    $('body').on('click', '.btn-delete-experiments', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.experiment-check:checked').each(function () {
            var s = $(this);
            var id = s.data('id');
            listToDelete.push(id);
        });
        flog('List To Delete', listToDelete.join(','));
        if (listToDelete.length > 0 && confirm('Are you sure you want to delete ' + listToDelete.length + ' experiments?')) {
            $('body').find('.check-all').check(false).change();
            deleteElements(listToDelete.join(','), function (data) {
                flog(data);
                if (data.status) {
                    Msg.info(data.messages);
                    $('#experimentTableContainer').reloadFragment();
                } else {
                    Msg.error('An error occured deleting the experiments. Please check your internet connection');
                }
            });
        } else {
            Msg.error('Please select the experiments you want to remove by clicking the checkboxes on the right');
        }
    });
    
    $('body').on('change', '.check-all', function (e) {
        flog($(this).is(':checked'));
        var checkedStatus = this.checked;
        $('body').find(':checkbox.experiment-check').each(function () {
            $(this).prop('checked', checkedStatus);
        });
    });
}

function deleteElements(listToDelete, callback) {
    var oldUrl = window.location.pathname;
    var newUrl = oldUrl.substr(0, oldUrl.lastIndexOf('/'));
    
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            toDelete: listToDelete,
        },
        success: function (resp) {
            callback(resp);
        },
        error: function (resp) {
            Msg.error('An error occured on the delete.');
        }
    });
}

function updateVariant(id, perc) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            variantId: id,
            percent: perc
        },
        success: function (data) {
            if (data.status) {
                $('#experimentTableContainer').reloadFragment({
                    whenComplete: function () {
                        Msg.info(data.messages);
                    }
                });
            } else {
                Msg.error('An error occured');
            }
        },
        error: function (resp) {
            Msg.error('An error occured');
        }
    });
}
