(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    // BM: Would be nice if we can extend button, but not sure how to do that..
    KEditor.components['passwordResetLinkEDM'] = $.extend({}, KEditor.components['button'], {
        settingTitle: 'Password Reset Settings',

        initSettingForm: function (form, keditor) {
            flog('init "passwordResetLinkEDM" settings', form);

            return $.ajax({
                url: '/static/keditor/edmComponentButtonSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.button-link').remove();
                    form.find('.form-horizontal').prepend(
                        '<div class="form-group">' +
                        '   <div class="col-md-12">' +
                        '       <label>Background</label>' +
                        '       <input type="text" value="" class="txt-bg-color form-control" />' +
                        '   </div>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '   <div class="col-md-12">' +
                        '       <label>Padding (in px)</label>' +
                        '       <div class="row row-sm text-center">' +
                        '           <div class="col-xs-4 col-xs-offset-4">' +
                        '               <input type="number" value="" class="txt-padding form-control" data-css="padding-top" />' +
                        '               <small>top</small>' +
                        '           </div>' +
                        '       </div>' +
                        '       <div class="row row-sm text-center">' +
                        '           <div class="col-xs-4">' +
                        '               <input type="number" value="" class="txt-padding form-control" data-css="padding-left" />' +
                        '               <small>left</small>' +
                        '           </div>' +
                        '           <div class="col-xs-4 col-xs-offset-4">' +
                        '               <input type="number" value="" class="txt-padding form-control" data-css="padding-right" />' +
                        '               <small>right</small>' +
                        '           </div>' +
                        '       </div>' +
                        '       <div class="row row-sm text-center">' +
                        '           <div class="col-xs-4 col-xs-offset-4">' +
                        '               <input type="number" value="" class="txt-padding form-control" data-css="padding-bottom" />' +
                        '               <small>bottom</small>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>'
                    );

                    var colorPicker = form.find('.txt-bg-color');
                    edmEditor.initSimpleColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-bg-color', color);
                        form.find('.txt-bg-color').val(color);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    var buttonColorPicker = form.find('#button-color');
                    edmEditor.initSimpleColorPicker(buttonColorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-color', color);
                        form.find('.button-color').val(color);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    var txtBorderRadius = form.find('#button-border-radius');
                    txtBorderRadius.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-border-radius', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.button-inner-padding').each(function () {
                        var input = $(this);
                        var dataCss = input.attr('data-css');

                        edmEditor.initPaddingControl(input, function (value) {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-inner-' + dataCss, value);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });

                    form.find('.txt-padding').each(function () {
                        var input = $(this);
                        var dataCss = input.attr('data-css');

                        edmEditor.initPaddingControl(input, function (value) {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-' + dataCss, value);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });

                    var txtText = form.find('#button-text');
                    txtText.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-message', (this.value || '').trim());
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var buttonTextColorPicker = form.find('#button-text-color');
                    edmEditor.initSimpleColorPicker(buttonTextColorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-button-text-color', color);
                        form.find('.button-text-color').val(color);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    var txtFontSize = form.find('#button-font-size');
                    txtFontSize.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-font-size', this.value > 0 ? this.value : 0);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var cbbFontFamily = form.find('#button-font-family');
                    cbbFontFamily.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-font-family', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.btn-style').each(function () {
                        var btn = $(this);
                        var name = btn.attr('name');

                        btn.on('click', function (e) {
                            e.preventDefault();

                            var value = btn.attr('data-value');
                            if (btn.hasClass('active')) {
                                btn.removeClass('active');
                                value = '';
                            } else {
                                btn.addClass('active');
                            }

                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-' + name, value);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });

                    var btnsAlign = form.find('.btn-align');
                    btnsAlign.each(function () {
                        var btn = $(this);
                        var value = btn.attr('data-value');

                        btn.on('click', function (e) {
                            e.preventDefault();

                            if (!btn.hasClass('active')) {
                                btnsAlign.removeClass('active');
                                btn.addClass('active');

                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');

                                component.attr('data-text-align', value);
                                keditor.initDynamicContent(dynamicElement);
                            }
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "passwordResetLink2" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('#button-color').val(dataAttributes['data-color'] || 'transparent').trigger('update');
            form.find('.txt-bg-color').val(dataAttributes['data-bg-color'] || 'transparent').trigger('update');
            form.find('#button-border-radius').val(dataAttributes['data-border-radius'] || '0');

            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.val(dataAttributes['data-inner-' + name] || '0');
            });

            form.find('.txt-padding').each(function () {
                var input = $(this);
                var name = input.attr('name');

                input.val(dataAttributes['data-' + name] || '0');
            });

            form.find('#button-text').val(dataAttributes['data-message'] || '');
            form.find('#button-text-color').val(dataAttributes['data-button-text-color'] || '').trigger('update');
            form.find('#button-font-size').val(dataAttributes['data-button-font-size'] || '');
            form.find('#button-font-family').val(dataAttributes['data-button-font-family'] || '');
            form.find('.btn-bold')[dataAttributes['data-font-weight'] === 'bold' ? 'addClass' : 'removeClass']('active');
            form.find('.btn-italic')[dataAttributes['data-font-style'] === 'italic' ? 'addClass' : 'removeClass']('active');
            form.find('.btn-align').removeClass('active').filter('[data-value=' + (dataAttributes['data-text-align'] || '') + ']').addClass('active');

        }
    });

})(jQuery);