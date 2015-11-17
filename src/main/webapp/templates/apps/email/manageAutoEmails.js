function initManageAutoEmails() {
    initModalAddEmailTrigger();
    initFolderDragDrop();
    initDefaultDragDrop();
    initCategoryButtons();
    initDeleteEmail();

    flog('init dup', $('#email-trigger-wrapper'));
    
    $('body').on('click', '.btn-dup-email', function (e) {
        e.preventDefault();
        var name = $(e.target).attr('href');
        duplicate(name);
    });
}

function initModalAddEmailTrigger() {
    var modal = $('#modal-add-trigger');
    flog('initModalAddEmail', modal);
    modal.find('form').forms({
        validate: function (form) {
            flog('manageEmail.js: check radio', form);
            return checkRadio('eventId', form);
        },
        callback: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment({
                whenComplete: function () {
                    initDefaultDragDrop();
                }
            });
        }
    });
}

function initDefaultDragDrop() {
    $('#email-trigger-wrapper .email-row').draggable({
        helper: 'clone',
        revert: 'invalid',
        axis: 'y',
        start: function (event, ui) {
            c.helper = ui.helper;
        }
    });

    $('#email-trigger-wrapper').droppable({
        accept: '.email-row',
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: 'relative', top: '', left: ''});
            var seriesName = row.data('seriesname');
            categoryAjax(seriesName, 'changeCategory=changeCategory', seriesName, function (name, resp) {
                //window.location.reload();
            });
            $(this).find('tbody').append(row);

            $(c.helper).remove();
        }
    });
}

function initFolderDragDrop() {
    $('.category').droppable({
        accept: '.email-row',
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: 'relative', top: '', left: ''});
            var seriesName = row.data('seriesname');
            var categoryID = $(this).attr('id');
            categoryAjax(seriesName, 'changeCategory=changeCategory&categoryID=' + categoryID, seriesName, function (name, resp) {
                //window.location.reload();
            });
            $(this).find('tbody').append(row);

            $(c.helper).remove();
        }
    });

    $('#category-wrapper .email-row').draggable({
        helper: 'clone',
        revert: 'invalid',
        axis: 'y',
        start: function (event, ui) {
            c.helper = ui.helper;
        }
    });
}

function initCategoryButtons() {
    var body = $(document.body);

    body.on('click', '.btn-add-category', function (e) {
        var categoryTitle = prompt('Please enter a category title', '');
        flog(categoryTitle);
        if (categoryTitle !== null && categoryTitle.trim() !== '') {
            categoryAjax(categoryTitle, 'createCategory=createCategory&categoryTitle=' + categoryTitle.trim(), null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    body.on('click', '.btn-rename-category', function (e) {
        e.preventDefault();
        var catTitle = $(this).data('catname');
        var catID = $(this).attr('href');
        var categoryTitle = prompt('Please enter a category title', catTitle);
        if (categoryTitle != null || categoryTitle != '') {
            categoryAjax(categoryTitle, 'updateCategory=updateCategory&categoryTitle=' + categoryTitle + '&categoryID=' + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    body.on('click', '.btn-delete-category', function (e) {
        e.preventDefault();
        var catID = $(this).attr('href');
        var catTitle = $(this).data('catname');
        var categoryTitle = confirm('Are you sure you want to delete ' + catTitle);
        if (categoryTitle) {
            categoryAjax(categoryTitle, 'deleteCategory=deleteCategory&categoryID=' + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });
}

function categoryAjax(name, data, url, callback) {
    var body = $(document.body);

    $.ajax({
        type: 'POST',
        url: window.location.pathname + (url || ''),
        data: data,
        success: function (resp) {
            body.trigger('ajaxLoading', {
                loading: false
            });
            if (callback) {
                callback(name, resp);
            }
        },
        error: function (resp) {
            log('error', resp);
            body.trigger('ajaxLoading', {
                loading: false
            });

            if (resp.status === 400) {
                alert('Sorry, the category could not be created. Please check if a category with that name already exists');
            } else {
                alert('There was a problem creating the folder');
            }
        }
    });
}
