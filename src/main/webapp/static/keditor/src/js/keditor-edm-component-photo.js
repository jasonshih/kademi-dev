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
            flog('init "photo" settings', form);
            
            var self = this;
            return $.ajax({
                url: '/static/keditor/edmComponentPhotoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form = form.find('.form-horizontal');
                    edmEditor.initDefaultComponentControls(form, keditor, {
                        onPaddingChanged: function (dataCss, value) {
                            if (dataCss === 'padding-left' || dataCss === 'padding-right') {
                                var img = keditor.getSettingComponent().find('img');
                                self.adjustWidthForImg(img, img.hasClass('full-width'));
                            }
                        }
                    });
                    
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
                    
                    var cbbAlign = form.find('#photo-align');
                    cbbAlign.on('change', function () {
                        var img = keditor.getSettingComponent().find('img');
                        img.attr('align', this.value);
                        edmEditor.setStyles('margin-left', this.value === 'center' ? 'auto' : '', img);
                        edmEditor.setStyles('margin-right', this.value === 'center' ? 'auto' : '', img);
                    });
                }
            });
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
            var cbbAlign = form.find('#photo-align');
            
            cbbAlign.val(img.attr('align') || 'left');
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
                img.attr({
                    width: isFullWidth ? wrapperWidth : realWidth,
                    height: isFullWidth ? wrapperWidth / ratio : realHeight
                });
                img.css('display', 'block');
            });
        },
        
        onWithChanged: function (component, width, keditor) {
            var self = this;
            
            var img = component.find('img');
            self.adjustWidthForImg(img, img.hasClass('full-width'));
        }
    };
    
})(jQuery);
