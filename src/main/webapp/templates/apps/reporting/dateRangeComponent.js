(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dateRange'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "dateRange component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/daterangepicker/2.0.11/daterangepicker.css"]').length === 0) {
                $('head').append('<link href="/static/daterangepicker/2.0.11/daterangepicker.css" rel="stylesheet" type="text/css" />');
            }

            if ($('[href="/static/jquery.pageDatePicker/1.0.0/jquery.pageDatePicker-1.0.0.css"]').length === 0) {
                $('head').append('<link href="/static/jquery.pageDatePicker/1.0.0/jquery.pageDatePicker-1.0.0.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/moment/2.17.1/moment.js', function () {
                $.getScriptOnce('/static/daterangepicker/2.0.11/daterangepicker.js', function () {
                    $.getScriptOnce('/static/jquery.pageDatePicker/1.0.0/jquery.pageDatePicker-1.0.0.js', function () {
                        self.initPicker();
                    });
                });
            });
        },

        initPicker: function () {
            flog('initPicker');

            $('.pageDatePicker').each(function () {
                var pageDatePicker = $(this);

                if (!pageDatePicker.hasClass('initialized-pageDatePicker')) {
                    pageDatePicker.addClass('initialized-pageDatePicker');

                    var cls = pageDatePicker.attr('data-style');
                    var position = pageDatePicker.attr('data-position');

                    pageDatePicker.pageDatePicker({
                        extraClass: cls,
                        position: position
                    });
                }
            });
        },

        settingEnabled: true,

        settingTitle: 'Date Range Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dateRange" component');

            var self = this;
    
            return $.ajax({
                url: '_components/dateRange?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('#cbbPickerAlign').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-align', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });

                    form.find('#cbbPickerSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-picker-size', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
            
                    form.find('#cbbPickerColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-color', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
            
                    form.find('#txtPickerClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                
                        component.attr('data-picker-class', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPicker();
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dateRange" component');
    
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#cbbPickerAlign').val(dataAttributes['data-picker-align']);
            form.find('#cbbPickerSize').val(dataAttributes['data-picker-size']);
            form.find('#cbbPickerColor').val(dataAttributes['data-picker-color']);
            form.find('#txtPickerClass').val(dataAttributes['data-picker-class']);
        }
    };

})(jQuery);