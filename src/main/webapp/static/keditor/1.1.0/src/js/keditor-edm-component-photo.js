/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['photo'] = {
        init: function (contentArea, container, component, options) {
            // Do nothing
        },

        getContent: function (component, options) {
            flog('getContent "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, options) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, options) {
            flog('initSettingForm "photo" component');
            var self = this;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-alt" class="col-sm-12">Alt text</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-alt" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var photoEdit = form.find('#photo-edit');
            photoEdit.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor',''),
                onSelectFile: function(url) {
                    var img = KEditor.settingComponent.find('img');
                    img.attr('src', url);
                    self.showSettingForm(form, KEditor.settingComponent, options);
                }
            });

            var inputAlt = form.find('#photo-alt');
            inputAlt.on('change', function () {
                KEditor.settingComponent.find('img').attr('alt', this.value);
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "photo" component', component);

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(component.find('img').attr('alt') || '');
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);
