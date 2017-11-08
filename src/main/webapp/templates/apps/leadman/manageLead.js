(function ($, window) {
    $(function () {
        initViewLeadsPage();
        initEditTaskModal();
        initImmediateUpdate();
        initLeadTimerControls();
        initExtraFieldFileUploads();
    });

    function initEditTaskModal() {
        if ($('#modalEditTask').length > 0) {
            flog('Init modalEditTask');

            $(document.body).on('click', '.btn-task-panel', function (e) {
                e.preventDefault();

                $('#modalEditTask').addClass('completeTask');
            });

            $(document.body).on('loaded.bs.modal shown.bs.modal', '#modalEditTask', function () {
                flog('Modal Loaded');

                var modal = $(this);
                var isCompleteTask = modal.hasClass('completeTask');

                $(".completeTaskDiv")[isCompleteTask ? 'show' : 'hide'](300);
                $(".hideOnComplete")[isCompleteTask ? 'hide' : 'show'](300);

                initDateTimePickers();

                var notes = modal.find('.lead-notes');
                notes.dotdotdot({
                    height: 200,
                    callback: function (isTruncated, orgContent) {
                        if (isTruncated) {
                            var currentContent = notes.html();
                            notes.html('<div class="lead-notes-inner">' + currentContent + '</div>');
                            var notesInner = notes.find('.lead-notes-inner');
                            var toggler = $('<a href="#" class="text-info">View more <i class="fa fa-angle-double-down"></i></a>');
                            notes.append(toggler);

                            toggler.click(function (e) {
                                e.preventDefault();

                                if (toggler.hasClass('opened')) {
                                    notesInner.html(currentContent);
                                    toggler.html('View more <i class="fa fa-angle-double-down"></i>');
                                    toggler.removeClass('opened');
                                } else {
                                    notesInner.html(orgContent);
                                    toggler.html('Hide <i class="fa fa-angle-double-up"></i>');
                                    toggler.addClass('opened');
                                }
                            });
                        }
                    }
                });

                var form = modal.find(".completeTaskForm");
                flog("complete task form", form);
                if (form.length > 0) {
                    form.forms({
                        onSuccess: function (resp) {
                            flog("onSuccess", resp, modal);
                            form.closest(".modal").modal("hide");
                            flog("done");
                            reloadTasks();
                        }
                    });
                }
            });


            $(document.body).on('hidden.bs.modal', '#modalEditTask', function () {
                $(this).removeClass('completeTask');
            });
        }
    }

    function initViewLeadsPage() {
        initAddTag();
        initTagsInput();
        initLeadActions();
        initCancelLeadModal();
        initCloseDealModal();
        initDateTimePickers();
        initFileNoteEdit();
        initLeadContactForm();
        initUpdateUserModal();
        initLeadOrgForm();
        initOrgSearch();
        initJobTitleSearch();
        initUnlinkCompany();
        initNewNoteForm();
        initNoteMoreLess();
        initNotesDotDotDot();
        initCancelTaskModal();
        initNewTaskModal();
        initAddQuote();
        initAssignTo();

        if (typeof Dropzone === 'undefined') {
            $.getStyleOnce('/static/dropzone/4.3.0/downloads/css/dropzone.css');
            $.getScriptOnce('/static/dropzone/4.3.0/downloads/dropzone.min.js', function () {
                initFileUploads();
            });
        } else {
            initFileUploads();
        }

        $(document.body).off("click", ".autoFillText").on("click", ".autoFillText", function (e) {
            e.preventDefault();
            var target = $(e.target).closest("a");
            var text = target.text();
            var inp = target.closest(".input-group").find("input[type=text]");
            flog("autofill", text, inp);
            inp.val(text);
        });

        $(document.body).on('hidden.bs.modal', '.modal', function () {
            $(this).removeData('bs.modal');
        });
    }

    function initExtraFieldFileUploads() {
        flog("initExtraFieldFileUploads");
        var modal = $('#uploadExtraFieldFileModal');
        var form = modal.find('form');

        $('body').on('click', '.btn-upload-file', function (e) {
            e.preventDefault();
            var name = $(this).data("name");
            if (name === undefined) {
                name = $(e.target).data("name");
            }
            flog("Extra field name: ", name);
            if (name !== undefined) {
                modal.find("#extraField").val(name);
                modal.modal('show');
            } else {
                Msg.error('There was a problem. Please refresh the page.');
            }
        });

        flog($('.btn-delete-file'));
        $('body').on('click', '.btn-delete-file', function (e) {
            e.preventDefault();
            var btn = $(this);
            var name = btn.data('name');
            var fname = btn.data('fname');
            if (confirm("Are you sure you want to delete " + fname + "?")) {

                var data = {
                    deleteExtraFieldFile: true,
                    extraField: name,
                    name: fname
                };
                flog(data);
                $.ajax({
                    url: window.location.href,
                    method: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        Msg.info('File deleted');
                        reloadFileList();
                        $(".extraFieldsUploadDetails").reloadFragment();
                    }
                });
            }
        });

        function reloadFileList() {
            var body = $('#files-body');
            if (body !== undefined) {
                $('#files-body').reloadFragment({
                    whenComplete: function () {
                        $('#files-body abbr.timeago').timeago();
                    }
                });
            }
        }

        form.forms({
            onSuccess: function (resp) {
                Msg.info('Files Uploaded');
                reloadFileList();
                $(".extraFieldsUploadDetails").reloadFragment();
                modal.modal('hide');
            }
        });
    }

    function assignLeadTo(name, href) {
        $('#findAnAssignee').siblings('.search-input').val('');

        $.ajax({
            type: 'POST',
            url: href || window.location.pathname,
            data: {
                assignToName: name
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    $("#assignedBlock").reloadFragment({
                        url: href || window.location.pathname,
                        whenComplete: function () {
                            Msg.info("The assignment has been changed.");
                        }
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
    }

    function initAssignTo() {
        $('#findAnAssignee').entityFinder({
            maxResults: 10,
            type: 'profile',
            renderSuggestions: function (data) {
                var suggestionsHtml = '';

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];

                    var userName = item.fields.userName[0];
                    var userId = item.fields.userId[0];
                    var firstName = item.fields.firstName ? item.fields.firstName[0] : '';
                    var surName = item.fields.surName ? item.fields.surName[0] : '';
                    var displayText = (firstName || surName) ? firstName + ' ' + surName : userName;
                    displayText = displayText.trim();

                    suggestionsHtml += '<li class="search-suggestion" data-id="' + userName + '" data-actual-id="' + userId + '" data-type="user" data-text="' + (displayText || userName) + '">';
                    suggestionsHtml += '    <a href="javascript:void(0);">' + displayText + '</a>';
                    suggestionsHtml += '</li>';
                }

                return suggestionsHtml;
            },
            onSelectSuggestion: function (suggestion, id, actualId, type) {
                assignLeadTo(id);
            }
        });

        $(document.body).on("click", "#assignToMenu a", function (e) {
            e.preventDefault();

            var name = $(e.target).attr("href");
            var href = $(this).closest('ul').data('href');

            assignLeadTo(name, href);
        });
    }

    function initAddQuote() {
        var modal = $('#addQuoteLeadModal');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                if (resp.nextHref && !modal.hasClass('no-redirect')) {
                    window.location.href = "/quotes/" + resp.nextHref;
                }

                $('#leadQuotesBody').reloadFragment({
                    whenComplete: function () {
                        Msg.info('Created quote');
                        modal.modal("hide");
                        form.find('input').not('[type=hidden]').val('');
                    }
                });
            }
        });

        $(document.body).off('click', '.createQuote').on('click', '.createQuote', function (e) {
            e.preventDefault();
            var href = $(e.target).closest("a").attr("href");
            form.attr("action", href);

            var leadId = $(e.target).closest("a").data("lead-id");

            $("#createQuoteLeadId").val(leadId);

            modal.modal("show");
        });
    }

    function updateField(href, fieldName, fieldValue, form) {
        var data = {};
        data[fieldName] = fieldValue;
        flog("updateField", href, data, fieldName, fieldValue);
        $.ajax({
            type: 'POST',
            url: href,
            data: data,
            dataType: 'json',
            success: function (resp) {
                var fieldLabel = fieldName;
                var label = form.find('[name=' + fieldName + ']').parents('.form-group').find('label');
                if (label.length) {
                    fieldLabel = label.text().replace(':', '');
                }
                Msg.info("Saved " + fieldLabel);
                reloadTasks();
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt save field ' + fieldName);
            }
        });
    }

    function initImmediateUpdate() {
        var onchange = function (e) {
            flog("field changed", e);
            var target = $(e.target);
            var href = target.data("href");
            var name = target.attr("name");
            var id = href + ':' + name;
            if (timers.hasOwnProperty(id)) {
                var t = timers[id];
                t = clearTimeout(t);
                timers[id] = null;
            }

            var value = target.val();
            var form = target.parents('.form-horizontal');
            var oldValue = target.data("original-value");
            if (value != oldValue) {
                updateField(href, name, value, form);
            }
        };

        var timers = {};

        $(document.body).on("keyup", ".immediateUpdate", function (e) {
            var target = $(e.target);
            var href = target.data("href");
            var name = target.attr("name");
            var id = href + ':' + name;
            if (timers.hasOwnProperty(id)) {
                var t = timers[id];
                t = clearTimeout(t);
                timers[id] = null;
            }

            timers[id] = setTimeout(function () {
                onchange(e);
            }, 1000);
        });
        $(document.body).on("change", ".immediateUpdate", function (e) {

            onchange(e);
        });
        $(document.body).on("dp.change", ".immediateUpdate", function (e) {
            onchange(e);
        });
    }

    function initNewTaskModal() {
        var modal = $("#newTaskModal");
        var form = modal.find("form");
        form.forms({
            onSuccess: function (resp) {
                Msg.info('Created new task');
                reloadTasks();
                modal.modal("hide");
            }
        });
    }

    function reloadTasks() {
        $("#tasks").reloadFragment({
            whenComplete: function (doc) {
            }
        });
    }

    function initCancelTaskModal() {
        var cancelTaskModal = $("#cancelTaskModal");
        cancelTaskModal.find("form").forms({
            onSuccess: function (resp) {
                Msg.info('Task cancelled');
                reloadTasks();
                cancelTaskModal.modal("hide");
            }
        });

        $(document.body).off('click', '.btnCancelTask').on("click", ".btnCancelTask", function (e) {
            e.preventDefault();
            var href = $(e.target).closest("a").attr("href");
            flog("set href", href);
            cancelTaskModal.find("form").attr("action", href);
            cancelTaskModal.modal("show");
        });
    }

    function initNotesDotDotDot() {
        function dotdotdotCallback(isTruncated, originalContent) {
            if (!isTruncated) {
                $("a.note-more", this).remove();
            }
        }

        $('.note-content').dotdotdot({
            height: 100,
            callback: dotdotdotCallback,
            after: 'a.note-more'
        });
    }

    function initNoteMoreLess() {
        $(document).on('click', 'a.note-more', function (e) {
            e.preventDefault();
            var btn = $(this);
            var div = btn.parents('.note-content');
            if (btn.hasClass('note-less')) {
                div.find('a.note-more').text('more').removeClass('note-less');
                initNotesDotDotDot();
            } else {
                $('.note-content').trigger('destroy').css('max-height', '');
                div.find('a.note-more').text('less').addClass('note-less');
            }

        });
    }

    function initNewNoteForm() {
        flog('initNewNoteForm');

        var modal = $('#newNoteModal');
        var form = modal.find('form');
        form.find('.newLeadForm').hide();

        $(document.body).off('click', '.createNote').on('click', '.createNote', function (e) {
            e.preventDefault();

            var href = $(e.target).closest("a").attr("href");
            form.attr("action", href);
            modal.modal("show");
        });

        form.forms({
            onSuccess: function (resp) {
                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }
                Msg.info('Created note');
                modal.modal("hide");

                var leadNotesBody = $('#leadNotesBody');
                var viewProfilePage = $('#view-profile-page');

                if (leadNotesBody.length) {
                    $('#leadNotesBody').reloadFragment({
                        whenComplete: function () {
                            initNotesDotDotDot()
                        }
                    });
                }

                if (viewProfilePage.length) {
                    viewProfilePage.reloadFragment({
                        whenComplete: function () {
                            $(document).find('abbr.timeago').timeago();
                            initNotesDotDotDot()
                        }
                    });
                }
            }
        });

        form.find('#note_newTask').on('change', function (e) {
            var btn = $(this);
            var checked = btn.is(':checked');

            if (checked) {
                form.find('.newLeadForm').show();
                form.find('.required-if-shown').addClass('required');
            } else {
                form.find('.newLeadForm').hide();
                form.find('.required-if-shown').removeClass('required');
            }
        });

        var editModal = $('#editNoteModal');
        var editForm = editModal.find('form');

        $(document.body).on('click', '.note-edit', function (e) {
            e.preventDefault();

            var btn = $(this);
            var noteId = btn.attr('href');
            var type = btn.data('type');
            var notes = btn.data('notes');

            editModal.find('[name=action]').val(type);
            editModal.find('[name=note]').val(notes);
            editModal.find('[name=editNote]').val(noteId);

            editModal.modal('show');
        });

        editForm.forms({
            onSuccess: function (resp) {
                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }
                Msg.info('Updated Note');
                editModal.modal("hide");
                $('#notes').reloadFragment({
                    whenComplete: function () {
                        $(document).find('abbr.timeago').timeago();
                        initNotesDotDotDot();
                    }
                });
            }
        });
    }

    function initOrgSearch() {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?orgSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });
        var orgTitleSearch = $('#orgTitleSearch');
        var form = orgTitleSearch.closest('.form-horizontal');
        var btnSaveCompany = form.find('.btn-save-company');

        orgTitleSearch.typeahead({
            highlight: true
        }, {
            display: 'title',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing companies were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                        '<div>'
                        + '<strong>{{title}}</strong>'
                        + '</br>'
                        + '<span>{{phone}}</span>'
                        + '</br>'
                        + '<span>{{address}}, {{addressLine2}}, {{addressState}}, {{postcode}}</span>'
                        + '</div>')
            }
        });

        var timer;
        orgTitleSearch.bind('typeahead:render', function (ev) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var ttMenu = orgTitleSearch.siblings('.tt-menu');
                var isSuggestionAvailable = ttMenu.find('.empty-message').length === 0;

                flog('typeahead:render Is suggestion available: ' + isSuggestionAvailable, ttMenu.find('.empty-message'));

                if (!isSuggestionAvailable) {
                    btnSaveCompany.html('Create new company');
                    form.find('.btn-company-details').css('display', 'none');
                    form.find('input[name=leadOrgId]').val('');
                }
            }, 50);
        });

        orgTitleSearch.bind('typeahead:select', function (ev, sug) {
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
            form.find('input[name=address]').val(sug.address);
            form.find('input[name=addressLine2]').val(sug.addressLine2);
            form.find('input[name=addressState]').val(sug.state);
            form.find('input[name=postcode]').val(sug.postcode);
            form.find('input[name=leadOrgId]').val(sug.orgId);
            form.find('[name=country]').val(sug.country);
            form.find('.btn-company-details').css('display', 'inline').attr('href', '/companies/' + sug.id);
            btnSaveCompany.html('Save details');
        });

        orgTitleSearch.on({
            input: function () {
                if (!this.value) {
                    form.find('input[name=email]').val('');
                    form.find('input[name=phone]').val('');
                    form.find('input[name=address]').val('');
                    form.find('input[name=addressLine2]').val('');
                    form.find('input[name=addressState]').val('');
                    form.find('input[name=postcode]').val('');
                    form.find('input[name=leadOrgId]').val('');
                    form.find('[name=country]').val('');
                }
            }
        });
    }

    function initJobTitleSearch() {
        var jobTitleSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname + '?jobTitle&q=%QUERY',
                wildcard: '%QUERY',
                transform: function (resp) {
                    return resp.data;
                }
            }
        });

        $('#jobTitle').typeahead({
            highlight: true
        }, {
            limit: 10,
            source: jobTitleSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing job title were found.',
                    '</div>'
                ].join('\n')
            }
        });
    }

    function initUnlinkCompany() {
        flog('initUnlinkCompany');

        $(document.body).on('click', '.btn-unlink-company', function (e) {
            e.preventDefault();

            var form = $(this).closest('.form-horizontal');
            form.find('input[name=title]').val('');
            form.find('input[name=email]').val('');
            form.find('input[name=phone]').val('');
            form.find('input[name=address]').val('');
            form.find('input[name=addressLine2]').val('');
            form.find('input[name=addressState]').val('');
            form.find('input[name=postcode]').val('');
            form.find('input[name=leadOrgId]').val('');
            form.find('[name=country]').val('');
            form.find('.btn-unlink-company').css('display', 'none');

            form.trigger('submit');
        });
    }

    function initLeadOrgForm() {
        var leadOrgDetailsForm = $('#lead-org-form');
        leadOrgDetailsForm.forms({
            onSuccess: function (resp) {
                var btnSaveCompany = $('.btn-save-company');

                $('#leadOrgDetailsPreview, #btn-company-details-wrapper').reloadFragment({
                    whenComplete: function () {
                        if (btnSaveCompany.text().trim() === 'Create new company') {
                            btnSaveCompany.html('Save details');
                            Msg.success('New company is created');
                        } else {
                            Msg.success('Company details is saved')
                        }

                        if (leadOrgDetailsForm.find('[name=title]').val() === '') {
                            leadOrgDetailsForm.find('.btn-unlink-company').css('display', 'none');
                        }
                    }
                });
            }
        });
    }

    function initUpdateUserModal() {
        var profileSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?profileSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });

        var modal = $('#modal-change-profile');
        var form = modal.find('form');

        $('#updateUserFirstName', modal).typeahead({
            highlight: true
        }, {
            display: 'firstName',
            limit: 10,
            source: profileSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing contacts were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                        '<div>'
                        + '<div>{{name}}</div>'
                        + '<div>{{phone}}</div>'
                        + '<div>{{email}}</div>'
                        + '</div><hr>')
            }
        });

        $('#updateUserFirstName', modal).bind('typeahead:select', function (ev, sug) {
            form.find('input[name=nickName]').val(sug.name);
            form.find('input[name=firstName]').val(sug.firstName);
            form.find('input[name=surName]').val(sug.surName);
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
        });

        form.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
                Msg.success(resp.messages);
                $('#profile-body').reloadFragment();
            }
        });
    }

    function initLeadContactForm() {
        var form = $('#lead-contact-form');
        form.forms({
            onSuccess: function () {
                Msg.success('Contact is saved!');
            }
        })
    }

    function initFileUploads() {
        flog('initFileUploads');

        Dropzone.autoDiscover = false;
        try {
            Dropzone.forElement("#lead-files-upload").destroy();
        } catch (e) {
        }

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
            format: 'DD/MM/YYYY HH:mm',
            keepInvalid: true,
            timeZone: window.KademiTimeZone
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

        cancelLeadModal.on('loaded.bs.modal', function () {
            cancelLeadModal.find("form").forms({
                onSuccess: function (resp) {
                    Msg.info('Lead cancelled');
                    initViewLeadsPage();
                    cancelLeadModal.modal("hide");
                }
            });
        });

        $(document.body).on("click", ".btnLeadCancelLead", function (e) {
            e.preventDefault();
            var href = $(e.target).attr("href");
            cancelLeadModal.find("form").attr("action", href);
            cancelLeadModal.modal("show");
        });
    }

    function initLeadActions() {
        $('#lead-details-form').forms({
            onSuccess: function () {
                Msg.success('Saved OK!');
            }
        });

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

    function initLeadTimerControls() {
        flog("initLeadTimerControls");
        $(document.body).on("click", ".timer-btn-stop", function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "stop"
                },
                success: function () {
                    Msg.info("Stopped timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });


        $(document.body).on("click", ".timer-btn-do-resched", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("button");
            var modal = btn.closest(".modal");
            var dateControl = modal.find(".date-time");

            var timerDate = dateControl.val();
            flog("reschdule", dateControl, timerDate);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "resched",
                    "timerDate": timerDate
                },
                success: function () {
                    Msg.info("Recheduled timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });

        $(document.body).on("click", ".timer-btn-go-next", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("a");
            var nextNodeId = btn.attr("href");
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "go",
                    "nextNodeId": nextNodeId
                },
                success: function () {
                    Msg.info("Done. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });
    }

})(jQuery, window);