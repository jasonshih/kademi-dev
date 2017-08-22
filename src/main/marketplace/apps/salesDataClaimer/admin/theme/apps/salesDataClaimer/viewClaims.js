(function ($) {
    var MAIN_URL = '/manageSaleDataClaimer/';
    var RECORD_STATUS = {
        NEW: 0,
        REQUESTING: 1,
        APPROVED: 2,
        REJECTED: -1
    };
    
    $(function () {
        var components = $('.claims-list-component');
        
        if (components.length > 0) {
            initModalReviewClaim();
            initClaimsTable();
            initUpdateMapping();
        }
    });
    
    function initModalReviewClaim() {
        flog('initModalReviewClaim');
        
        var modal = $('#modal-review-claim');
        var form = modal.find('form');
        var action = modal.find('.modal-action');
        
        modal.find('.btn-approve-claim').on('click', function (e) {
            e.preventDefault();
            
            action.attr('name', 'approveClaims');
            form.trigger('submit');
        });
        
        modal.find('.btn-reject-claim').on('click', function (e) {
            e.preventDefault();
            
            action.attr('name', 'rejectClaims');
            form.trigger('submit');
        });
        
        modal.on('hidden.bs.modal', function () {
            modal.find('.form-control-static').html('');
            form.find('input').val('');
        });
        
        form.forms({
            onSuccess: function () {
                reloadClaimsList(function () {
                    Msg.success('Claim is ' + (action === 'rejectClaims' ? 'rejected' : 'approved') + '!');
                    modal.modal('hide');
                });
            }
        });
    }
    
    function initUpdateMapping() {
        var btnUpdateMapping = $('.btn-update-mapping');
        
        if (btnUpdateMapping.length > 0) {
            btnUpdateMapping.on('click', function (e) {
                e.preventDefault();
                
                btnUpdateMapping.prop('disabled', true);
                $.ajax({
                    url: '/updateMappingSaleDataClaimer',
                    type: 'POST',
                    dataType: 'JSON',
                    success: function (resp) {
                        if (resp && resp.status) {
                            Msg.success('Mapping is updated');
                        } else {
                            Msg.error('Error in updating mapping. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Msg.error('Error in updating mapping: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in updating mapping', jqXHR, textStatus, errorThrown);
                    },
                    complete: function () {
                        
                        btnUpdateMapping.prop('disabled', false);
                    }
                });
            });
        }
    }
    
    function changeClaimsStatus(status) {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        
        var action;
        var actionCapitalize;
        var actionVing;
        switch (status) {
            case RECORD_STATUS.APPROVED:
                action = 'approve';
                actionCapitalize = 'Approve';
                actionVing = 'approving';
                break;
            
            case RECORD_STATUS.REJECTED:
                action = 'reject';
                actionCapitalize = 'Reject';
                actionVing = 'Rejecting';
                break;
        }
        
        var checked = tbody.find(':checkbox:checked');
        
        if (checked.length > 0) {
            var isConfirmed = confirm('Are you that you want to ' + action + ' ' + checked.length + ' selected ' + (checked.length > 1 ? 'claims' : 'claim') + '?');
            
            if (isConfirmed) {
                var ids = [];
                checked.each(function () {
                    ids.push(this.value);
                });
                
                var data = {
                    ids: ids.join(',')
                };
                data[action + 'Claims'] = true;
                
                $.ajax({
                    url: MAIN_URL,
                    type: 'POST',
                    dataType: 'JSON',
                    data: data,
                    success: function (resp) {
                        if (resp && resp.status) {
                            reloadClaimsList(function () {
                                Msg.success(actionCapitalize + ' succeed');
                            })
                        } else {
                            alert('Error in ' + actionVing + ' claims. Please contact your administrators to resolve this issue.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Error in ' + actionVing + ' claims: ' + errorThrown + '. Please contact your administrators to resolve this issue.');
                        flog('Error in ' + actionVing + ' claims', jqXHR, textStatus, errorThrown);
                    }
                });
            }
        } else {
            alert('Please select claims which you want to ' + action);
        }
    }
    
    function initClaimsTable() {
        var table = $('#table-claims');
        var tbody = $('#table-claims-body');
        var modalAdd = $('#modal-add-claim');
        var formAdd = modalAdd.find('form');
        var modalReview = $('#modal-review-claim');
        var formReview = modalReview.find('form');
        
        table.find('.chk-all').on('click', function () {
            tbody.find(':checkbox').prop('checked', this.checked);
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
        
        table.on('click', '.btn-view-claim, .btn-review-claim', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var id = btn.attr('data-id');
            var url = MAIN_URL + id + '/';
            var isReview = btn.hasClass('btn-review-claim');
            
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        $.each(resp.data, function (key, value) {
                            var newValue = value;
                            if (key === 'soldDate') {
                                newValue = '<abbr class="timeago" title="' + value + '">' + value + '</abbr>';
                            }
                            
                            modalReview.find('.' + key).html(newValue);
                        });
                        
                        modalReview.find('.timeago').timeago();
                        modalReview.find('[name=ids]').val(id);
                        modalReview.find('.btn-approve-claim, .btn-reject-claim').css('display', isReview ? 'inline-block' : 'none');
                        modalReview.find('.modal-title').html(isReview ? 'Review claim' : 'View claim details');
                        modalReview.modal('show');
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
        
        $('.btn-approve-claims').on('click', function (e) {
            e.preventDefault();
            
            changeClaimsStatus(RECORD_STATUS.APPROVED);
        });
        
        $('.btn-reject-claims').on('click', function (e) {
            e.preventDefault();
            
            changeClaimsStatus(RECORD_STATUS.REJECTED);
        });
        
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