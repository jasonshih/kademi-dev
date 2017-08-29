(function ($) {
    var MAIN_URL = '/salesDataClaims/';
    
    $(function () {
        var components = $('.claims-list-component');
        
        if (components.length > 0) {
            initModalAddClaim();
            initModalViewClaim();
            initClaimsTable();
        }
    });
    
    function initClaimsTable() {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        var modalAdd = $('#modal-add-claim');
        var formAdd = modalAdd.find('form');
        
        table.find('.chk-all').on('click', function () {
            tbody.find(':checkbox:enabled').prop('checked', this.checked);
        });
        
        $('.btn-add-claim').on('click', function (e) {
            e.preventDefault();
            
            formAdd.attr('action', MAIN_URL);
            modalAdd.find('.modal-action').attr('name', 'createClaim');
        });
        
        var uri = new URI(window.location.href);
        $('.select-status').on('change', function (e) {
            uri.removeSearch('status');
            
            if (this.value) {
                uri.addSearch('status', this.value);
            }
            
            window.history.pushState('', document.title, uri.toString());
            reloadClaimsList();
        });
        
        table.on('click', '.btn-view-claim', function (e) {
            e.preventDefault();
            
            var id = $(this).attr('data-id');
            var url = MAIN_URL + id + '/';
            
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        var modal = $('#modal-view-claim');
                        
                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = '<abbr class="timeago" title="' + value + '">' + value + '</abbr>';
                            }
                            
                            modal.find('.' + key).html(newValue);
                        });
                        
                        modal.find('.timeago').timeago();
                        modal.modal('show');
                    } else {
                        alert('Error in getting claim data. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in getting claim data: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in getting claim data', jqXHR, textStatus, errorThrown);
                }
            })
        });
        
        table.on('click', '.btn-edit-claim', function (e) {
            e.preventDefault();
            
            var id = $(this).attr('data-id');
            var url = MAIN_URL + id + '/';
            
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        formAdd.attr('action', url);
                        modalAdd.find('.modal-action').attr('name', 'updateClaim');
                        
                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = moment(value).format('DD/MM/YYYY HH:mm');
                            }
                            
                            modalAdd.find('[name=' + key + ']').val(newValue);
                        });
                        
                        modalAdd.modal('show');
                    } else {
                        alert('Error in getting claim data. Please contact your administrators to resolve this issue.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error in getting claim data: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                    flog('Error in getting claim data', jqXHR, textStatus, errorThrown);
                }
            })
        });
        
        tbody.find('.timeago').timeago();
        
        $('.btn-delete-claims').on('click', function (e) {
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
                        url: MAIN_URL,
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
    
    function initModalViewClaim() {
        flog('initModalViewClaim');
        
        var modal = $('#modal-view-claim');
        
        modal.on('hidden.bs.modal', function () {
            modal.find('.form-control-static').html('');
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
        
        form.forms({
            onSuccess: function () {
                reloadClaimsList(function () {
                    Msg.success('New claim is created!');
                    modal.modal('hide');
                });
            }
        });
        
        modal.on('hidden.bs.modal', function () {
            form.find('input').not('[name=soldBy], [name=soldById]').val('');
        });
    }
    
    function reloadClaimsList(callback) {
        $('#table-claims-body').reloadFragment({
            url: window.location.pathname + window.location.search,
            whenComplete: function () {
                $('.timeago').timeago();
                
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }
    
})(jQuery);