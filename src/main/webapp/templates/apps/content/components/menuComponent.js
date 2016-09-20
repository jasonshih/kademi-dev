(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['menu'] = {
        settingEnabled: true,
        settingTitle: 'Menu Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            return $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    form.find('.menuList .menuList .menuList .btnAddMenuItem').remove();

                    var basePath = window.location.pathname.replace('contenteditor', '');
                    if (keditor.options.basePath) {
                        basePath = keditor.options.basePath;
                    }
                    form.find('#logo-edit').mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: basePath,
                        basePath: basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-logo', imageUrl);
                            keditor.initDynamicContent(dynamicElement);
                            form.find('#logo-previewer').attr('src', imageUrl);
                        }
                    });
                    form.find('#logo-delete').on('click', function (e) {
                        e.preventDefault();

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-logo', this.value);
                        keditor.initDynamicContent(dynamicElement);
                        form.find('#logo-previewer').attr('src', '/static/images/photo_holder.png');
                    });

                    form.on('click', '.cbb-show-user-menu', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-user-menu', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var menuItemEditor = form.find('.editMenuItem');
                    var menuEditor = form.find('.menuEditor');

                    form.on('click', '.btnAddMenuItem', function (e) {
                        e.preventDefault();

                        var li = $(this).closest('li');
                        var ol = li.children('ol');
                        var isRootChild = li.hasClass('rootMenuItem');
                        var btnAddHtml = '';

                        if (isRootChild) {
                            btnAddHtml += '<a class="btn btn-success btnAddMenuItem" href="#">';
                            btnAddHtml += '     <span class="fa fa-plus small"></span>';
                            btnAddHtml += '</a>';
                        }

                        var newId = 'menu-custom-' + Math.floor((Math.random() * 10000));
                        ol.append(
                            '<li>' +
                            '   <div data-id="' + newId + '" class="menuItem">' +
                            '       <span class="btn-group btn-group-xs small">' + btnAddHtml +
                            '           <a class="btn btn-info btnSortMenuItem" href="#">' +
                            '               <span class="fa fa-sort small"></span>' +
                            '           </a>' +
                            '           <a class="btn btn-primary btnEditMenuItem" href="#">' +
                            '               <span class="fa fa-pencil small"></span>' +
                            '           </a>' +
                            '       </span>' +
                            '       <span class="menuItemText">Enter text</span>' +
                            '   </div>' +
                            '   <ol class="menuList" data-id="' + newId + '"></ol>' +
                            '</li>'
                        );

                        var tree = $('.menuTree ol').not('.rootMenuList');
                        try {
                            tree.sortable('destroy');
                        } catch (e) {}
                        tree.sortable({
                            handle: '.btnSortMenuItem',
                            items: '> li',
                            axis: 'y',
                            tolerance: 'pointer'
                        });
                    });

                    var editItem = null;

                    form.on('click', '.btnEditMenuItem', function (e) {
                        e.preventDefault();

                        var btn = $(this);
                        var menuItem = btn.closest('.menuItem');
                        editItem = menuItem;

                        var itemId = menuItem.attr('data-id');
                        var itemText = menuItem.find('.menuItemText').text().trim();
                        var itemHref = menuItem.attr('data-href');
                        var hidden = menuItem.attr('data-hidden');

                        menuItemEditor.find('input[name=href]').val(itemHref);
                        menuItemEditor.find('input[name=text]').val(itemText);

                        var btnVisible = menuItemEditor.find('.editMenuItemHide span');
                        btnVisible.removeClass('fa-eye-slash').removeClass('fa-eye');

                        if (hidden === 'false') {
                            btnVisible.addClass('fa-eye');
                            btnVisible.attr('title', 'Show this item');
                        } else {
                            btnVisible.addClass('fa-eye-slash');
                            btnVisible.attr('title', 'Hide this item');
                        }
                        
                        var deleteBtn = menuItemEditor.find('.editMenuItemDelete');
                        if (itemId.startsWith('menu-custom-')) {
                            deleteBtn.show();
                        } else {
                            deleteBtn.hide();
                        }

                        menuItemEditor.fshow();
                        menuEditor.fhide();
                    });

                    form.on('click', '.editMenuItemOk', function (e) {
                        e.preventDefault();

                        var newItemHref = menuItemEditor.find('input[name=href]').val();
                        var newItemText = menuItemEditor.find('input[name=text]').val();
                        newItemText = newItemText.trim();

                        editItem.attr('data-href', newItemHref);
                        editItem.find('.menuItemText').text(newItemText);
                        editItem = null;

                        menuItemEditor.fhide();
                        menuEditor.fshow();
                    });
                    
                    form.on('click', '.editMenuItemDelete', function (e) {
                        e.preventDefault();

                        editItem.closest('li').remove();

                        menuItemEditor.fhide();
                        menuEditor.fshow();
                    });
                    
                    form.on('click', '.editMenuItemHide', function (e) {
                        e.preventDefault();

                        var btn = $(this);
                        var i = btn.find('i');
                        var isHidden = !i.hasClass('fa-eye-slash');

                        editItem.attr('data-hidden', isHidden);
                        editItem = null;

                        menuItemEditor.fhide();
                        menuEditor.fshow();
                    });
                    
                    form.on('click', '.editMenuItemCancel', function (e) {
                        e.preventDefault();
                        editItem = null;
                        menuItemEditor.fhide();
                        menuEditor.fshow();
                    });

                    form.on('click', '.saveMenu', function (e) {
                        e.preventDefault();

                        var topOl = $('.menuTree ol.rootMenuList');
                        var list = [];
                        toMenuData(topOl, list);
                        var menuJson = JSON.stringify({
                            items: list
                        }, null, 4);


                        $.ajax({
                            url: '/theme/menu.json',
                            type: 'PUT',
                            data: menuJson,
                            success: function () {
                                Msg.info('Saved menu');
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                keditor.initDynamicContent(dynamicElement);
                            },
                            error: function (e) {
                                Msg.error(e.status + ': ' + e.statusText);
                            }
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var imageUrl = dataAttributes['data-logo'];
            form.find('#logo-previewer').attr('src', imageUrl ? imageUrl : '/static/images/photo_holder.png');
            form.find('[name=logo]').val(dataAttributes['data-logo']);

            form.find('.cbb-show-user-menu').prop('checked', dataAttributes['data-show-user-menu'] === 'true');


            var tree = $('.menuTree ol.menuList').not('.rootMenuList');

            try {
                tree.sortable('destroy');
            } catch (e) {}
            tree.sortable({
                handle: '.btnSortMenuItem',
                items: '> li',
                axis: 'y',
                tolerance: 'pointer'
            });
        }

    };

    function toMenuData(ol, list) {
        flog('toMenuData', ol);

        var parentId = ol.attr('data-id');

        ol.find('> li').each(function (i) {
            var li = $(this);

            flog('toMenuData - item', li);

            var menuItem = li.children('.menuItem');
            var itemId = menuItem.attr('data-id');
            var itemHref = menuItem.attr('data-href');
            var itemText = menuItem.children('.menuItemText').text().trim();
            var isCustom = itemId.startsWith('menu-custom-'); // different format to native menu items
            var isHidden = menuItem.attr('data-hidden');

            list.push({
                id: itemId,
                text: itemText,
                href: itemHref,
                ordering: i,
                parentId: parentId,
                custom: isCustom,
                hidden: isHidden
            });

            toMenuData(li.children('.menuList'), list);
        });
    }
})(jQuery);