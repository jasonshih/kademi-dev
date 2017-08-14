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
        initFileNoteEdit();
        
        if (typeof Dropzone === 'undefined') {
            $.getStyleOnce('/static/dropzone/4.3.0/downloads/css/dropzone.css');
            $.getScriptOnce('/static/dropzone/4.3.0/downloads/dropzone.min.js', function () {
                initFileUploads();
            });
        } else {
            initFileUploads();
        }
    }
    
    function initFileUploads() {
        flog('initFileUploads');
        
        Dropzone.autoDiscover = false;
        $('#lead-files-upload').dropzone({
            paramName: 'file',
            maxFilesize: 2000.0, // MB
            addRemoveLinks: true,
            parallelUploads: 1,
            uploadMultiple: true,
            init: function () {
                this.on('success', function (file) {
                    flog('added file', file);
                    reloadFileList();
                });
                this.on('error', function (file, errorMessage) {
                    Msg.error('An error occured uploading: ' + file.name + ' because: ' + errorMessage);
                });
            }
        });
    }
    
    function initFileNoteEdit() {
        var noteModal = $('#editFileNoteModal');
        var noteForm = noteModal.find('form');
        
        $('body').on('click', '.edit-file-note', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var span = btn.closest('td').find('span');
            var leadId = btn.attr('href');
            
            noteForm.attr('action', window.location.pathname + leadId);
            noteForm.find('textarea[name=updateNotes]').val(span.html());
            
            noteModal.modal('show');
        });
        
        noteForm.forms({
            onSuccess: function () {
                reloadFileList();
                noteModal.modal('hide');
            }
        });
    }
    
    function reloadFileList() {
        $('#files-body').reloadFragment();
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
        
        $(document.body).on("click", "#assignToMenu a", function (e) {
            e.preventDefault();
            
            var name = $(e.target).attr("href");
            var href = $(this).closest('ul').data('href');
            
            $.ajax({
                type: 'POST',
                url: href || window.location.pathname,
                data: {
                    assignToName: name
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        Msg.info("The assignment has been changed.");
                        
                        $("#assignedBlock").reloadFragment({
                            url: href || window.location.pathname
                        });
                    } else {
                        Msg.error("Sorry, we couldnt change the assignment");
                    }
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('Sorry couldnt change the assigned person ' + resp);
                }
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