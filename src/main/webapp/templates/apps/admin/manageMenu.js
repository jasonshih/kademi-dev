function initManageMenu() {
    initMenuBuilder();
    initMenuModal();
    initCRUDMenu();
}

var MENU_ITEM_SPLITTER = '\r\n';

function initMenuBuilder() {
    var txtMenu = $('#menu');
    var menuItems = txtMenu.val().split(MENU_ITEM_SPLITTER);

    // Insert after txtMenu menu-wrapper
    txtMenu.after(
        '<div id="menu-wrapper" class="clearfix">' +
        '</div>'
    );
    var menuWrapper = $('#menu-wrapper');
    buildMenu(menuWrapper, menuItems);
    txtMenu.hide();
    menuWrapper.sortable({
        update: function (e, ui) {
            updateMenuText();
        }
    });

    // Add `Add menu` button
    txtMenu.before('<p><a href="" class="btn btn-sm btn-info btn-add-menu"><i class="fa fa-plus"></i> Add menu</a></p>');
}

function buildMenu(menuWrapper, menuItems) {
    var menuString = '';

    for (var i = 0, menuItem; menuItem = menuItems[i]; i++) {
        menuString += genMenuItem.apply(this, menuItem.split(','));
    }

    menuWrapper.html(menuString);
}

function genMenuItem(link, text) {
    return (
        '<li class="menu-item" data-link="' + link + '">' +
            '<span>' + text + '</span>' +
            '<aside>' +
                '<a href="" class="btn btn-xs btn-success btn-edit-menu"><i class="fa fa-edit"></i></a>' +
                '<a href="" class="btn btn-xs btn-danger btn-delete-menu"><i class="fa fa-times"></i></a>' +
            '</aside>' +
        '</li>'
    );
}

function updateMenuText() {
    var txtMenu = $('#menu');
    var menuWrapper = $('#menu-wrapper');
    var items = [];

    menuWrapper.children().each(function () {
        var item = $(this);
        var link = item.attr('data-link');
        var text = item.find('span').text();

        items.push(link + ',' + text);
    });

    txtMenu.val(items.join(MENU_ITEM_SPLITTER));
}

function initMenuModal() {
    var modal = $('#modal-menu');
    var form = modal.find('form');

    form.forms({
        allowPostForm: false,
        onValid: function() {
            var isEdit = modal.hasClass('edit');

            var menuWrapper = $('#menu-wrapper');

            var text = $('#menu-text').val();
            var link = $('#menu-link').val();

            if (isEdit) {
                var editingItem = menuWrapper.find('.editing');
                editingItem.attr('data-link', link);
                editingItem.find('span').html(text);
            } else {
                menuWrapper.append(genMenuItem(link, text));
            }

            showConfirmMessage(form, 'Saved OK!');
            updateMenuText();
            modal.modal('hide');
        }
    });
}

function openMenuModal(link, text) {
    var modal = $('#modal-menu');

    if (link) {
        modal.addClass('edit');
        $('#menu-text').val(text);
        $('#menu-link').val(link);
    }

    modal.modal('show');

    modal.on('hidden.bs.modal', function () {
        modal.removeClass('edit');
        modal.find('input').val('');
        modal.find('.alert').remove();
        $('#menu-wrapper').find('.editing').removeClass('editing');
    });
}

function initCRUDMenu() {
    var menuWrapper = $('#menu-wrapper');

    $('.btn-add-menu').on('click', function (e) {
        e.preventDefault();

        openMenuModal();
    });

    menuWrapper.on('click', '.btn-edit-menu', function (e) {
        e.preventDefault();

        var menuItem = $(this).closest('li');
        var link = menuItem.attr('data-link');
        var text = menuItem.find('span').text();
        menuItem.addClass('editing');

        openMenuModal(link, text);
    });

    menuWrapper.on('click', '.btn-delete-menu', function (e) {
        e.preventDefault();

        $(this).closest('li').remove();
        updateMenuText();
    });
}