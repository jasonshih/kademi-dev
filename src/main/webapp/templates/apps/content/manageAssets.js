(function ($) {
    $(function () {
        initSearchAsset();
        initDeleteAssets();
        initUploadModal();
    });
    
    function initUploadModal() {
        flog('initUploadModal');
        
        var modal = $('#modal-upload-file');
        var form = modal.find('form');
        var progress = form.find('.progress');
        var progressBar = progress.find('.progress-bar');
        
        form.forms({
            onValid: function () {
                progress.show();
            },
            onProgress: function (percentage) {
                var percentageStr = Math.round(percentage) + '%';
                progressBar.html(percentageStr).css('width', percentageStr);
            },
            onSuccess: function (resp) {
                if (resp && resp.status) {
                    $('#table-assets').reloadFragment({
                        whenComplete: function () {
                            modal.modal('hide');
                            Msg.info('Uploaded ok');
                        }
                    })
                } else {
                    Msg.error('An error occured uploading the resource');
                }
            }
        });
        
        modal.on('hidden.bs.modal', function () {
            progress.hide();
            progressBar.html('0%').css('width', 0);
            form.find('input').val('');
        });
    }
    
    function initSearchAsset() {
        flog('initSearchAsset');
        
        $('#query').keyup(function () {
            typewatch(function () {
                doSearchAsset();
            }, 500);
        });
    }
    
    function doSearchAsset() {
        var query = $('#query').val();
        flog('doSearchAsset query=' + query);
        
        var uri = URI(window.location);
        
        uri.setSearch('q', query);
        var newHref = uri.toString();
        
        window.history.pushState('', newHref, newHref);
        
        $.ajax({
            type: 'GET',
            url: newHref,
            success: function (data) {
                var table = $('#table-assets');
                
                var newDom = $(data);
                
                var $fragment = newDom.find('#table-assets');
                
                table.replaceWith($fragment);
                
            },
            error: function (resp) {
                Msg.error('An error occured doing the user search. Please check your internet connection and try again', 'search');
            }
        });
    }
    
    function initDeleteAssets() {
        $(document.body).on('click', '.btn-delete-assets', function (e) {
            e.preventDefault();
            var listToDelete = [];
            $(document.body).find(':checkbox.asset-check:checked').each(function () {
                var s = $(this);
                var id = s.data('id');
                listToDelete.push(id);
            });
            flog('List To Delete', listToDelete.join(','));
            
            if (listToDelete.length > 0) {
                Kalert.confirm('Are you sure you want to delete ' + listToDelete.length + ' assets?', function () {
                    deleteElements(listToDelete.join(','), function (data) {
                        flog(data);
                        if (data.status) {
                            $('#table-assets').reloadFragment({
                                whenComplete: function () {
                                    Msg.info(data.messages);
                                    $(document.body).find('.check-all').check(false).change();
                                }
                            });
                        } else {
                            Msg.error('An error occured deleting the assets. Please check your internet connection');
                        }
                    });
                });
            } else {
                Msg.error('Please select the assets you want to remove by clicking the checkboxes on the right');
            }
        });
    }
    
    function deleteElements(listToDelete, callback) {
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
    
})(jQuery);