(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['countdown'] = {
        settingEnabled: true,
        settingTitle: 'Countdown Settings',
        init: function (contentArea, container, component, keditor) {
            var self = this;
            setTimeout(function () {
                self.initCountdown(component);
            }, 2000);
        },
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "countdown" component');
            var self = this;
            return $.ajax({
                url: '_components/countdown?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    $.getScriptOnce('/static/inputmask/min/inputmask/inputmask.min.js', function () {
                        $.getScriptOnce('/static/inputmask/min/inputmask/inputmask.date.extensions.min.js', function () {
                            $.getScriptOnce('/static/inputmask/min/inputmask/jquery.inputmask.min.js', function () {
                                form.find('.date').inputmask("dd/mm/yyyy");
                            });
                        });
                    });

                    form.find('.date').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-date', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initCountdown(component);
                        });
                    });

                    form.find('.clock-face').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-clock-face', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initCountdown(component);
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "countdown" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('input.date').val(dataAttributes['data-date']);
            form.find('.clock-face').val(dataAttributes['data-clock-face']);
        },
        initCountdown: function (component) {
            $.getScriptOnce('/theme/apps/content/flipclock.min.js', function () {
                var date = component.find('.kcountdown').attr('data-date');
                var face = component.find('.kcountdown').attr('data-clock-face');
                var options = {
                    countdown: true
                };
                if (face){
                    options.clockFace = face;
                }
                var clock = component.find('.kcountdown').FlipClock(new Date(date),options);
            })


        }
    };

})(jQuery);