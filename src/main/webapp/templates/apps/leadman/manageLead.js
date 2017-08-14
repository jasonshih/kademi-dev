(function ($, window) {
    $(function () {
        initViewLeadsPage();
    });
    
    function initViewLeadsPage() {
        initAddTag();
        initTagsInput();
        initLeadActions();
        initCancelLeadModal();
        initCloseDealModal();
        initDateTimePickers();
    }
    
    function initDateTimePickers() {
        flog('initDateTimePickers');
        
        var pickers = $('.date-time');
        flog("pickers", pickers);
        pickers.datetimepicker({
            format: 'DD/MM/YYYY HH:mm'
        });
    }
    
    function initCloseDealModal() {
        var closeDealModal = $("#closeDealModal");
        closeDealModal.on('shown.bs.modal', function () {
            closeDealModal.find("form").forms({
                onSuccess: function (resp) {
                    $('#lead-details').reloadFragment({
                        whenComplete: function () {
                            Msg.info('Deal marked as closed');
                            initViewLeadsPage();
                            closeDealModal.modal('hide');
                        }
                    });
                }
            });
        });
    }
    
    function initCancelLeadModal() {
        var cancelLeadModal = $("#modalCancelLead");
        cancelLeadModal.find("form").forms({
            onSuccess: function (resp) {
                $('#lead-details').reloadFragment({
                    whenComplete: function () {
                        Msg.info('Lead cancelled');
                        initViewLeadsPage();
                        cancelLeadModal.modal("hide");
                    }
                });
            }
        });
    }
    
    function initLeadActions() {
        $(document.body).off('click', '.btn-reopen').on('click', '.btn-reopen', function (e) {
            e.preventDefault();
            
            Kalert.confirm('You want to reopen this lead?', function () {
                $.ajax({
                    type: 'POST',
                    data: {
                        reopenDeal: true
                    },
                    dataType: 'json',
                    success: function (resp) {
                        if (resp.status) {
                            $('#lead-details').reloadFragment({
                                whenComplete: function () {
                                    initViewLeadsPage();
                                }
                            });
                        }
                    },
                    error: function () {
                        Msg.error('Oh no! Something went wrong!');
                    }
                });
            });
        });
    }
    
    function initAddTag() {
        $('body').on('click', '.addTag a', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var groupName = btn.attr('href');
            
            doAddToGroup(groupName);
        });
    }
    
    function doAddToGroup(groupName) {
        $('#view-lead-tags').tagsinput('add', {id: groupName, name: groupName});
    }
    
    function reloadTags() {
        $('#membershipsContainer').reloadFragment({
            whenComplete: function () {
                initTagsInput();
            }
        });
    }
    
    function initTagsInput() {
        var tagsSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads/?asJson&tags&q=%QUERY',
                wildcard: '%QUERY'
            }
        });
        
        tagsSearch.initialize();
        
        $("#view-lead-tags").tagsinput({
            itemValue: 'id',
            itemText: 'name',
            typeaheadjs: {
                name: tagsSearch.name,
                displayKey: 'name',
                source: tagsSearch.ttAdapter()
            }
        });
        
        try {
            var data = JSON.parse($("#view-lead-tags").val());
            
            $.each(data, function (key, element) {
                $('#view-lead-tags').tagsinput('add', {id: element.id, name: element.name}, {preventPost: true});
            });
        } catch (e) {
            flog("Could not parse tags JSON " + e);
        }
        
        
        $("#view-lead-tags").on('beforeItemRemove', function (event) {
            if (event.options !== undefined && event.options.preventPost !== undefined && event.options.preventPost === true) {
                return;
            }
            
            var tag = event.item.id;
            
            if (confirm('Are you sure you want to remove this tag?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        deleteTag: tag
                    },
                    success: function (resp) {
                        if (resp.status) {
                            reloadTags();
                        } else {
                            Msg.error("Couldnt remove tag: " + resp.messages);
                            
                            reloadTags();
                        }
                    },
                    error: function (e) {
                        Msg.error(e.status + ': ' + e.statusText);
                        
                        reloadTags();
                    }
                });
            } else {
                event.cancel = true;
                return false;
            }
        });
        
        $('#view-lead-tags').on('beforeItemAdd', function (event) {
            if (event.options !== undefined && event.options.preventPost !== undefined && event.options.preventPost === true) {
                return;
            }
            
            var tag = event.item;
            
            $("#membershipsContainer .twitter-typeahead input").data("adding", true);
            
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    addTag: tag.id
                },
                success: function (resp) {
                    $("#membershipsContainer .twitter-typeahead input").data("adding", false);
                    
                    if (resp.status) {
                        reloadTags();
                    } else {
                        Msg.error("Couldnt add tag: " + resp.messages);
                        
                        reloadTags();
                    }
                },
                error: function (e) {
                    $("#membershipsContainer .twitter-typeahead input").data("adding", false);
                    
                    Msg.error(e.status + ': ' + e.statusText);
                    
                    reloadTags();
                }
            });
        });
        
        
        $("#membershipsContainer .twitter-typeahead input").on("keyup", function (event) {
            if (event.keyCode !== 13 || $(this).data("adding") === true) {
                return;
            }
            
            if (confirm('Are you sure you want to add this tag?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: $(this).val()
                    },
                    success: function (resp) {
                        if (resp.status) {
                            Msg.info(resp.messages);
                            reloadTags();
                        } else {
                            Msg.error("Couldnt add tag: " + resp.messages);
                            
                            reloadTags();
                        }
                    },
                    error: function (e) {
                        Msg.error(e.status + ': ' + e.statusText);
                        
                        reloadTags();
                    }
                });
            }
        });
        
        $("#membershipsContainer .twitter-typeahead").focus();
    }
    
})(jQuery, window);