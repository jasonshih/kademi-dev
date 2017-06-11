/**
 * Created by Anh on 04/04/2017.
 */
// (function ($) {
//     var KEditor = $.keditor;
//     var flog = KEditor.log;
//
//     KEditor.components['voucher'] = {
//         settingEnabled: true,
//
//         settingTitle: 'Voucher Setting',
//
//         initSettingForm: function (form, keditor) {
//             flog('initSettingForm "voucher" component');
//
//             return $.ajax({
//                 url: '_components/voucher?settings',
//                 type: 'get',
//                 dataType: 'html',
//                 success: function (resp) {
//                     form.html(resp);
//
//                     form.find('.select-voucher').on('change', function () {
//                         var component = keditor.getSettingComponent();
//                         var dynamicElement = component.find('[data-dynamic-href]');
//
//                         component.attr('data-voucher', this.value);
//                         keditor.initDynamicContent(dynamicElement);
//                     })
//                 }
//             });
//         },
//
//         showSettingForm: function (form, component, keditor) {
//             flog('showSettingForm "voucher" component');
//
//             var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
//             form.find('.select-voucher').val(dataAttributes['data-voucher'] || '');
//         }
//     };
//
// })(jQuery);
