(function ($) {
    $(function () {
        var components = $('.claims-list-component');
        
        if (components.length > 0) {
            initModalAddClaim();
            initClaimsTable();
        }
    });
    
    function initClaimsTable() {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        
        table.find('.chk-all').on('click', function () {
            tbody.find(':checkbox').prop('checked', this.checked);
        });
        
        tbody.find('.timeago').timeago();
        
        $('.btn-request-approval').on('click', function (e) {
            e.preventDefault();
            
            var checked = tbody.find(':checkbox:checked');
            
            if (checked.length > 0) {
                var isConfirmed = confirm('Are you that you want to request approval for ' + checked.length + ' selected ' + (checked.length > 1 ? 'claims' : 'claim') + '?');
                
                if (isConfirmed) {
                var ids = [];
                checked.each(function () {
                    ids.push(this.value);
                });
                
                $.ajax({
                    url: '/salesDataClaims/',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        requestApproval: true,
                        ids: ids.join(',')
                    },
                    success: function (resp) {
                        if (resp && resp.status) {
                            reloadClaimsList(function () {
                                Msg.success('Request approval succeed');
                            })
                        } else {
                            alert('Error in requesting approval. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Error in requesting approval: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in requesting approval', jqXHR, textStatus, errorThrown);
                    }
                });
                }
            } else {
                alert('Please select claims which you want to request approval');
            }
        });
        
        $('.btn-remove-claims').on('click', function (e) {
            e.preventDefault();
            
            var checked = tbody.find(':checkbox:checked');
            
            if (checked.length > 0) {
                var isConfirmed = confirm('Are you that you want to delete ' + checked.length + ' selected ' + (checked.length > 1 ? 'claims' : 'claim') + '?');
                
                if (isConfirmed) {
                var ids = [];
                checked.each(function () {
                    ids.push(this.value);
                });
                
                $.ajax({
                    url: '/salesDataClaims/',
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteClaims: true,
                        ids: ids.join(',')
                    },
                    success: function (resp) {
                        if (resp && resp.status) {
                            reloadClaimsList(function () {
                                Msg.success('Deleted');
                            })
                        } else {
                            alert('Error in deleting. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Error in deleting: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in deleting', jqXHR, textStatus, errorThrown);
                    }
                });
                }
            } else {
                alert('Please select claims which you want to delete');
            }
        });
    }
    
    function initModalAddClaim() {
        flog('initModalAddClaim');
        
        var modal = $('#modal-add-claim');
        var form = modal.find('.form-new-claim');
        
        form.find('.date-time-picker').each(function () {
            var input = $(this);
            var format = input.attr('data-format') || 'DD/MM/YYYY';
            
            input.datetimepicker({
                format: format
            });
        });
        
        form.find('#attributedTo').entityFinder({
            url: '/custs',
            useActualId: true
        });
        
        form.forms({
            onSuccess: function () {
                reloadClaimsList(function () {
                    Msg.success('New claim is created!');
                    modal.modal('hide');
                });
            }
        });
    }
    
    function reloadClaimsList(callback) {
        $('#table-claims-body').reloadFragment({
            whenComplete: function () {
                $('.timeago').timeago();
                callback();
            }
        });
    }
    
})(jQuery);