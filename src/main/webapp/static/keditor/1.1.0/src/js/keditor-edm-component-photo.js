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
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background</label>' +
                '           <div class="input-group color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="photo-bg-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Padding (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-top" class="form-control" />' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" id="photo-padding-left" class="form-control" />' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-right" class="form-control" />' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-bottom" class="form-control" />' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '   <div class="form-group">' +
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

            var photoPaddingTop = form.find('#photo-padding-top');
            var photoPaddingBottom = form.find('#photo-padding-bottom');
            var photoPaddingLeft = form.find('#photo-padding-left');
            var photoPaddingRight = form.find('#photo-padding-right');
            photoPaddingTop.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingBottom.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingLeft.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingRight.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-right', (this.value > 0 ? this.value : 0) + 'px');
            });

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');
                if (color && color !== 'transparent') {
                    setStyle(wrapper, 'background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    setStyle(wrapper, 'background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#photo-bg-color').val('');
                }
            });

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.on('click', function () {
                var img = KEditor.settingComponent.find('img');
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
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            var wrapper = component.find('.wrapper');
            var textPaddingTop = form.find('#text-padding-top');
            var paddingTop = wrapper.css('padding-top');
            textPaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

            var textPaddingBottom = form.find('#text-padding-bottom');
            var paddingBottom = wrapper.css('padding-bottom');
            textPaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

            var textPaddingLeft = form.find('#text-padding-left');
            var paddingLeft = wrapper.css('padding-left');
            textPaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

            var textPaddingRight = form.find('#text-padding-right');
            var paddingRight = wrapper.css('padding-right');
            textPaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.attr('width') === '100%');

            $('<img />').attr('src', img.attr('src')).load(function() {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);
