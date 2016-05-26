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
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            flog('getContent "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');

            var self = this;
            var options = keditor.options;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group photo-edit-wrapper">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group photo-alt-wrapper">' +
                '       <label for="photo-alt" class="col-sm-12">Alt text</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-alt" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-fullwidth" class="col-sm-12">Full width</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="photo-fullwidth" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var photoEdit = form.find('#photo-edit');
            var basePath = window.location.pathname.replace('edmeditor', '');
            if (keditor.options.basePath) {
                basePath = keditor.options.basePath;
            }
            photoEdit.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: basePath,
                basePath: basePath,
                onSelectFile: function (url, relativeUrl, fileType, hash) {
                    var img = keditor.getSettingComponent().find('img');
                    img.attr('src', "http://" + window.location.host + "/_hashes/files/" + hash);
                    self.showSettingForm(form, keditor.getSettingComponent(), options);
                }
            });

            var inputAlt = form.find('#photo-alt');
            inputAlt.on('change', function () {
                keditor.getSettingComponent().find('img').attr('alt', this.value);
            });

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.on('click', function () {
                var img = keditor.getSettingComponent().find('img');
                if (chkFullWidth.is(':checked')) {
                    img.attr({
                        width: '100%',
                        height: ''
                    });
                } else {
                    img.attr({
                        width: self.width,
                        height: self.height
                    });
                }
            });

            form = form.find('form');
            KEditor.initBgColorControl(keditor, form, 'after', '.photo-edit-wrapper');
            KEditor.initPaddingControls(keditor, form, 'before', '.photo-alt-wrapper');
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.attr('width') === '100%');

            $('<img />').attr('src', img.attr('src')).load(function () {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);
