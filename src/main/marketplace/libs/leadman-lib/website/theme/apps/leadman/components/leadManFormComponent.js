/**
 * Created by m.elkhoudary on 4/7/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['leadManForm'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "leadManForm" component', component);

            //var options = keditor.options;

            var componentContent = component.find('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href="_components/leadManForm"]');
            var leadManForm = componentContent.find('.leadManForm');

            if (leadManForm.length === 0) {
                leadManForm = $('<div class="leadManForm"></div>');
                dynamicElement.after(leadManForm);
            }

            if (!leadManForm.attr('id')) {
                leadManForm.attr('id', keditor.generateId('component-leadManForm'));
            }
            
            leadManForm.prop('contenteditable', false);

            /*leadManForm.prop('contenteditable', false);
            
            leadManForm.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });*/

            var editor = leadManForm.ckeditor(keditor.options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                /*
                 if (typeof options.onComponentReady === 'function') {
                 options.onComponentReady.call(contentArea, component, editor);
                 }*/
            });
        },

        /*getContent: function (component, keditor) {
         flog('getContent "leadManForm" component', component);
         
         var componentContent = component.find('.keditor-component-content');
         var leadManForm = componentContent.find('.leadManForm');
         
         var id = leadManForm.children().attr('id');
         var editor = CKEDITOR.instances[id];
         
         if (editor) {
         leadManForm.html('<div class="leadManForm clearfix">' + editor.getData() + '</div>');
         }
         
         return componentContent.html();
         },
         
         destroy: function (component, keditor) {
         flog('destroy "leadManForm" component', component);
         
         var id = component.find('.leadManForm').attr('id');
         var editor = CKEDITOR.instances[id];
         if (editor) {
         editor.destroy();
         }
         },*/

        settingEnabled: true,
        settingTitle: 'LeadMan Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "leadManForm" component', form, keditor);

            return $.ajax({
                url: '_components/leadManForm?settings',
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
            flog('showSettingForm "leadManForm" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=formPath]').val(dataAttributes['data-form-path']);
        }
    };

})(jQuery);