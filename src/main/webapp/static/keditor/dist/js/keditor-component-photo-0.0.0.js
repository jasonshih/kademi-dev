/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
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
            flog('init "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            var img = componentContent.find('img');

            img.css('display', 'inline-block');
            if (!img.css('vertical-align')){
                img.css('vertical-align', 'middle');
            }

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
            var options = keditor.options;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Align</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-align" class="form-control">' +
                '               <option value="left">Left</option>' +
                '               <option value="center">Center</option>' +
                '               <option value="right">Right</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="vertical-alignment" class="col-sm-12">V Align</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control" id="v-align">' +
                '               <option value="top">Top</option>' +
                '               <option value="middle">Middle</option>' +
                '               <option value="bottom">Bottom</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-style" class="col-sm-12">Style</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="photo-style" class="form-control">' +
                '               <option value="">None</option>' +
                '               <option value="img-rounded">Rounded</option>' +
                '               <option value="img-circle">Circle</option>' +
                '               <option value="img-thumbnail">Thumbnail</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-responsive" class="col-sm-12">Responsive</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="photo-responsive" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-width" class="col-sm-12">Width</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="photo-width" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="photo-height" class="form-control" />' +
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
                    img.wrap('<a href=""></a>');
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
                pagePath: options.pagePath,
                basePath: options.basePath,
                onSelectFile: function (url, relativeUrl, fileType, hash) {
                    var img = keditor.getSettingComponent().find('img');
                    img.attr('src', "/_hashes/files/" + hash);
                    self.showSettingForm(form, keditor.getSettingComponent(), options);
                }
            });

            var inputAlign = form.find('#photo-align');
            inputAlign.on('change', function () {
                var panel = keditor.getSettingComponent().find('.photo-panel');
                panel.css('text-align', this.value);
            });

            var inputVAlign = form.find('#v-align');
            inputVAlign.on('change', function () {
                var panel = keditor.getSettingComponent().find('.photo-panel').find('img');
                panel.css('vertical-align', this.value);
            });

            var inputResponsive = form.find('#photo-responsive');
            inputResponsive.on('click', function () {
                keditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
            });

            var cbbStyle = form.find('#photo-style');
            cbbStyle.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var val = this.value;

                img.removeClass('img-rounded img-circle img-thumbnail');
                if (val) {
                    img.addClass(val);
                }
            });

            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            inputWidth.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var newWidth = +this.value;
                var newHeight = Math.round(newWidth / self.ratio);

                if (newWidth <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newWidth;
                }

                img.css({
                    'width': newWidth,
                    'height': newHeight
                });
                inputHeight.val(newHeight);
            });
            inputHeight.on('change', function () {
                var img = keditor.getSettingComponent().find('img');
                var newHeight = +this.value;
                var newWidth = Math.round(newHeight * self.ratio);

                if (newHeight <= 0) {
                    newWidth = self.width;
                    newHeight = self.height;
                    this.value = newHeight;
                }

                img.css({
                    'height': newHeight,
                    'width': newWidth
                });
                inputWidth.val(newWidth);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var inputAlign = form.find('#photo-align');
            var inputVAlign = form.find('#v-align');
            var inputResponsive = form.find('#photo-responsive');
            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            var cbbStyle = form.find('#photo-style');
            var txtLink = form.find('#photo-link');
            var cbbTarget = form.find('#photo-target');
            var chkLinkable = form.find('#photo-linkable');

            txtLink.next().hide();
            txtLink.closest('.form-group').removeClass('has-error');

            var panel = component.find('.photo-panel');
            var img = panel.find('img');

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

            var algin = panel.css('text-align');
            if (algin !== 'right' || algin !== 'center') {
                algin = 'left';
            }

            var valign = img.css('vertical-align');

            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }
            inputAlign.val(algin);
            inputVAlign.val(valign);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.width());
            inputHeight.val(img.height());

            $('<img />').attr('src', img.attr('src')).load(function () {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        }
    };

})(jQuery);
