/**
 * Created by m.elkhoudary on 4/7/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['quotesList'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "quotesList" component', component);

            //var options = keditor.options;

            var componentContent = component.find('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href="_components/quotesList"]');
            var quotesList = componentContent.find('.quotesList');

            if (quotesList.length === 0) {
                quotesList = $('<div class="quotesList"></div>');
                dynamicElement.after(quotesList);
            }

            if (!quotesList.attr('id')) {
                quotesList.attr('id', keditor.generateId('component-quotesList'));
            }
            
            quotesList.prop('contenteditable', false);

            var editor = quotesList.ckeditor(keditor.options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
            });
        },

        settingEnabled: true,
        settingTitle: 'Quotes List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "quotesList" component', form, keditor);

            return $.ajax({
                url: '_components/quotesList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('[name=formPath]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-path', this.value);
                        keditor.initDynamicContent(dynamicElement);

                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "quotesList" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=formPath]').val(dataAttributes['data-form-path']);
        }
    };

})(jQuery);