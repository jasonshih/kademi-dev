(function (w) {
    function initModalForm() {
        var modal = $('#modalInven');
        var form = modal.find('form');
        
        form.forms({
            onSuccess: function (data) {
                $('#table-body-inven').reloadFragment({
                    whenComplete: function () {
                        modal.modal('hide');
                        Msg.success('Inventory is saved');
                    }
                });
            }
        });
        
        modal.on('bs.modal.hidden', function () {
            form.trigger('reset');
        });
    }
    
    function initAddInven() {
        $('.btn-add-inven').on('click', function (e) {
            e.preventDefault();
            
            var modal = $('#modalInven');
            modal.find('[name=action]').val('create');
            modal.modal('show');
        });
    }
    
    function initEditInven() {
        $(document.body).on('click', '.btn-rename-inven', function (e) {
            e.preventDefault();
            
            
            var btn = $(this);
            var id = btn.attr('data-id');
            var name = btn.attr('data-name');
            var title = btn.attr('data-title');
            
            var modal = $('#modalInven');
            modal.find('[name=action]').val('edit');
            modal.find('[name=id]').val(id);
            modal.find('[name=newName]').val(name);
            modal.find('[name=newTitle]').val(title);
            modal.modal('show');
        });
    }
    
    function initDeleteInven() {
        $('.btn-delete-inven').on('click', function (e) {
            e.preventDefault();
            
            var checkedChk = $('.chk-inven:checked');
            if (checkedChk.length > 0) {
                var ids = [];
                checkedChk.each(function () {
                    ids.push(this.getAttribute('data-id'));
                });
                
                if (confirm('Are you sure to delete ' + ids.length + ' inventories?')) {
                    $.ajax({
                        url: '.',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: 'delete',
                            ids: ids.join(',')
                        },
                        success: function(resp) {
                            if (resp && resp.status) {
                                $('#table-body-inven').reloadFragment({
                                    whenComplete: function () {
                                        Msg.success('Deleted');
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                alert('Please select inventories which you want to delete');
            }
        });
    }
    
    w.initManageInventory = function () {
        initModalForm();
        initAddInven();
        initEditInven();
        initDeleteInven();
    };
})(window);