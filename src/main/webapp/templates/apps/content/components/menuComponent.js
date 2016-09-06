(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['menu'] = {
        settingEnabled: true,
        settingTitle: 'Menu Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            var self = this;

            $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    form.find('[name=logo]').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-logo', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    var menuItemEditor = form.find(".editMenuItem");
                    var menuEditor = form.find(".menuEditor");

                    form.on("click", ".btnAddMenuItem", function (e) {
                        e.preventDefault();
                        var div = $(e.target).closest("li").find("> .menuList");
                        flog("menuList", div);
                        var ol = div.find("> ol");
                        flog("ol", ol);
                        var newId = "menu-custom-" + Math.floor((Math.random() * 10000) ); 
                        var newLi = '<li class="ui-sortable-handle">' +
                                '<a data-href="" class="editMenu" href="' + newId + '">' +
                                '<span class="fa fa-pencil"></span>' +
                                '<span class="menuItemText">' +
                                'Enter text' +
                                '</span>' +
                                '</a>' +
                                '</li>;'
                        ol.append($(newLi));
                        
                        var tree = $(".menuTree > .menuList > ol");
                        tree.sortable("destroy");
                        tree.sortable();
                    });

                    var editItem = null;

                    form.on("click", ".editMenu", function (e) {
                        e.preventDefault();
                        flog("click", e);
                        var link = $(e.target).closest("a");
                        editItem = link;
                        var itemId = link.attr("href");
                        var itemText = link.closest("li").find(".menuItemText").text().trim();
                        var itemHref = link.data("href");
                        var hidden = link.data("hidden");
                        //alert(itemId + " - " + itemText + " - " + itemHref);

                        menuItemEditor.find("input[name=href]").val(itemHref);
                        menuItemEditor.find("input[name=text]").val(itemText);
                        var vis = menuItemEditor.find(".editMenuItemHide span");
                        vis.removeClass("fa-eye-slash").removeClass("fa-eye");
                        if( hidden ) {
                            vis.addClass("fa-eye");
                            vis.attr("title", "Show this item");
                        } else {
                            vis.addClass("fa-eye-slash");
                            vis.attr("title", "Hide this item");
                        }
                        
                        var deleteBtn = menuItemEditor.find(".editMenuItemDelete");
                        if( itemId.startsWith("menu-custom-")) {
                            deleteBtn.show();
                        } else {
                            deleteBtn.hide();
                        }

                        menuItemEditor.show(200);
                        menuEditor.hide(200);
                    });
                    form.on("click", ".editMenuItemOk", function (e) {
                        e.preventDefault();

                        var newItemHref = menuItemEditor.find("input[name=href]").val();
                        var newItemText = menuItemEditor.find("input[name=text]").val();
                        newItemText = newItemText.trim();

                        editItem.data("href", newItemHref);
                        editItem.closest("li").find(".menuItemText").text(newItemText);
                        editItem = null;

                        menuItemEditor.hide(200);
                        menuEditor.show(200);
                    });
                    
                    form.on("click", ".editMenuItemDelete", function (e) {
                        e.preventDefault();

                        editItem.closest("li").remove();

                        menuItemEditor.hide(200);
                        menuEditor.show(200);
                    });
                    
                    form.on("click", ".editMenuItemHide", function (e) {
                        e.preventDefault();

                        var isHidden = editItem.data("hidden");
                        isHidden = !isHidden;
                        var isHidden = editItem.data("hidden", isHidden);

                        menuItemEditor.hide(200);
                        menuEditor.show(200);
                    });
                    
                    form.on("click", ".editMenuItemCancel", function (e) {
                        e.preventDefault();
                        editItem = null;
                        menuItemEditor.hide(200);
                        menuEditor.show(200);
                    });
                    form.on("click", ".saveMenu", function (e) {
                        e.preventDefault();
                        var topOl = $(".menuTree > ol")
                        var list = new Array();
                        toMenuData(topOl, list);
                        flog("saving menu", list);
                        var menuConfigList = {
                            items: list
                        };
                        var menuJson = JSON.stringify(menuConfigList, null, 4);

                        var xhr = new XMLHttpRequest();
                        var url = "/theme/menu.json";
                        xhr.open("PUT", url, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                Msg.info("Saved menu");
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                keditor.initDynamicContent(dynamicElement);

                            }
                        };
                        xhr.send(menuJson);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=logo]').val(dataAttributes['data-logo']);
            var tree = $(".menuTree > .menuList > ol");
            tree.sortable();
        }

    };

    function toMenuData(ol, list) {        
        var parentId = ol.data("id");        
        var lis = ol.find("> li");
        flog("toMenuData", ol);
        $.each(lis, function (i, n) {
            var li = $(n);
            flog("toMenuData - item", li);
            var link = li.find("a");
            var itemId = link.attr("href");
            var itemHref = link.data("href");
            var itemText = li.find("> a .menuItemText").text().trim();
            var isCustom = itemId.startsWith("menu-custom-"); // different format to native menu items
            var isHidden = link.data("hidden");
            var menuConfigItem = {
                id: itemId,
                text: itemText,
                href: itemHref,
                ordering: i,
                parentId: parentId,
                custom : isCustom,
                hidden : isHidden
            };
            list.push(menuConfigItem);
            var subOl = li.find("> .menuList > ol");
            toMenuData(subOl, list);
        });
    }
})(jQuery);