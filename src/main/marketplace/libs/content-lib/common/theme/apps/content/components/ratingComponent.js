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
                '    <select class="krating" data-rating="'+rating+'">\n' +
                '        <option value="1">1</option>\n' +
                '        <option value="2">2</option>\n' +
                '        <option value="3">3</option>\n' +
                '        <option value="4">4</option>\n' +
                '        <option value="5">5</option>\n' +
                '    </select>\n' +
                '</div>';
        },
        initRating: function (component) {
            component.find('.kratingWrap').addClass('editing');
            component.find('.krating').barrating({
                theme: 'fontawesome-stars-o',
                readonly: false,
                initialRating: component.find('.krating').attr('data-rating'),
                onSelect:function(value, text, event){
                    component.find('.krating').attr('data-rating', value)
                }
            });
        }
    };

})(jQuery);