(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['rating'] = {
        settingEnabled: false,
        settingTitle: 'Rating Settings',
        init: function (contentArea, container, component, keditor) {
            this.initRating(component);
        },
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rating" component');
            return $.ajax({
                url: '_components/rating?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageTitle" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
        },
        getContent: function (component, keditor) {
            var rating = component.find('.krating').attr('data-rating');
            return '<div class="kratingWrap">\n' +
                '    <div class="krating" data-rating="' + rating + '">\n' +
                '    </div>\n' +
                '</div>';
        },
        initRating: function (component) {
            component.find('.kratingWrap').addClass('editing');
            component.find('.krating').rateYo({
                halfStar: true,
                rating: component.find('.krating').attr('data-rating'),
                onSet: function (rating, rateYoInstance) {
                    component.find('.krating').attr('data-rating', rating)
                }
            });
        }
    };

})(jQuery);