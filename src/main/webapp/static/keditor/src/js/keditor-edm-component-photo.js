/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['photo'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photo" component', component);
            
            var self = this;
            var img = component.find('img');
            self.adjustWidthForImg(img, img.hasClass('full-width'));

            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');

            var self = this;

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
                '   <div class="form-group">' +
                '       <label for="photo-width" class="col-sm-12">Linkable</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="photo-linkable" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Link</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-link" class="form-control" disabled="disabled" />' +
                '           <span class="help-block" style="display: none;">Link is invalid</span>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Open link in</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control" id="photo-target" disabled="disabled">' +
                '               <option value="" selected="selected">Current tab/window</option>' +
                '               <option value="_blank">New tab/window</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var txtLink = form.find('#photo-link');
            txtLink.on('change', function () {
                var link = this.value.trim();
                var pattern = new RegExp('^[a-zA-Z0-9_/%:/./-]+$');
                var span = txtLink.next();
                var formGroup = txtLink.closest('.form-group');

                if (pattern.test(link)) {
                    keditor.getSettingComponent().find('a').attr('href', link);
                    span.hide();
                    formGroup.removeClass('has-error');
                } else {
                    span.show();
                    formGroup.addClass('has-error');
                }
            });

            var cbbTarget = form.find('#photo-target');
            cbbTarget.on('change', function () {
                keditor.getSettingComponent().find('a').attr('target', this.value);
            });

            var chkLinkable = form.find('#photo-linkable');
            chkLinkable.on('click', function () {
                var img = keditor.getSettingComponent().find('img');

                if (chkLinkable.is(':checked')) {
                    txtLink.prop('disabled', false);
                    cbbTarget.prop('disabled', false);
                    img.wrap('<a href="" style="text-decoration: none;"></a>');
                    img.css('border', '0');
                } else {
                    txtLink.prop('disabled', true);
                    cbbTarget.prop('disabled', true);
                    img.unwrap('a');
                }
            });

            var photoEdit = form.find('#photo-edit');
            photoEdit.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: keditor.options.pagePath,
                basePath: keditor.options.basePath,
                onSelectFile: function (url, relativeUrl, fileType, hash) {
                    var img = keditor.getSettingComponent().find('img');
                    img.attr('src', "http://" + window.location.host + "/_hashes/files/" + hash);
                    self.adjustWidthForImg(img, true);
                }
            });

            var inputAlt = form.find('#photo-alt');
            inputAlt.on('change', function () {
                keditor.getSettingComponent().find('img').attr('alt', this.value);
            });

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.on('click', function () {
                var img = keditor.getSettingComponent().find('img');
                img[this.checked ? 'addClass' : 'removeClass']('full-width');
                self.adjustWidthForImg(img, this.checked);
            });
    
            form = form.find('form');
            edmEditor.initDefaultComponentControls(form, keditor);
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);
            
            edmEditor.showDefaultComponentControls(form, component, keditor);

            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.hasClass('full-width'));

            var txtLink = form.find('#photo-link');
            var cbbTarget = form.find('#photo-target');
            var chkLinkable = form.find('#photo-linkable');

            txtLink.next().hide();
            txtLink.closest('.form-group').removeClass('has-error');

            var a = img.parent('a');
            if (a.length > 0) {
                chkLinkable.prop('checked', true);
                txtLink.prop('disabled', false).val(a.attr('href'));
                cbbTarget.prop('disabled', false).val(a.attr('target'));
            } else {
                chkLinkable.prop('checked', false);
                txtLink.prop('disabled', true).val('');
                cbbTarget.prop('disabled', true).val('');
            }
        },

        adjustWidthForImg: function (img, isFullWidth) {
            flog('adjustWidthForImg', img, isFullWidth);

            img.css('display', 'none');

            $('<img />').attr('src', img.attr('src')).load(function () {
                var realWidth = this.width;
                var realHeight = this.height;
                var ratio = realWidth / realHeight;
                var wrapper = img.parent();
                if (wrapper.is('a')) {
                    wrapper = wrapper.parent();
                }
                var wrapperWidth = wrapper.width();

                setTimeout(function () {
                    img.attr({
                        width: isFullWidth ? wrapperWidth : realWidth,
                        height: isFullWidth ? wrapperWidth / ratio : realHeight
                    });

                    img.css('display', 'block');
                }, 200);
            });
        },
        
        onWithChanged: function (component, width, keditor) {
            var self = this;
    
            var img = component.find('img');
            self.adjustWidthForImg(img, img.hasClass('full-width'));
        }
    };

})(jQuery);
