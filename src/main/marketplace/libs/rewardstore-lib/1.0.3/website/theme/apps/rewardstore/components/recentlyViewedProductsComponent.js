/**
 * Created by Anh on 17/05/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['recentlyViewedProducts'] = {
        settingEnabled: true,

        settingTitle: 'Recently Viewed Products',

        init: function (contentArea, container, component, keditor) {
            flog('init "recentlyViewedProducts" component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/slick/1.5.7/slick/slick-theme.css"]').length === 0) {
                $('head').append('<link href="/static/slick/1.5.7/slick/slick-theme.css" rel="stylesheet" type="text/css" />');
            }
            if ($('[href="/static/slick/1.5.7/slick/slick.css"]').length === 0) {
                $('head').append('<link href="/static/slick/1.5.7/slick/slick.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/slick/1.5.7/slick/slick.min.js', function () {
                flog('init slick');
                self.initSlickSlider();
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "recentlyViewedProducts" component');

            return $.ajax({
                url: '_components/recentlyViewedProducts?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.number-of-products').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-products', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "recentlyViewedProducts" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.number-of-products').val(dataAttributes['data-number-of-products']);
        },
        initSlickSlider: function (){
            var slider =  $('.recentlyViewedRewardProducts');
            if (slider.length) {
                slider.not('.slick-initialized').slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    adaptiveHeight: true,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                arrows: false,
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: false,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            }
                        }
                    ]
                });
            }
        }
    };

})(jQuery);