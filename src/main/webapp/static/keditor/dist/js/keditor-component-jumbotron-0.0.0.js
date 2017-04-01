/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
/**
 * KEditor Jumbotron Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['jumbotron'] = {
        settingEnabled: true,

        settingTitle: 'Jumbotron Settings',
        init: function(contentArea, container, component, keditor){
            var self = this;
            var options = self.options;

            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);

            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = componentContent.ckeditor(keditor.options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },

        getContent: function (component, keditor) {
            flog('getContent "jumbotron" component', component);

            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "jumbotron" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background Color</label>' +
                '           <div class="input-group button-color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" name="button-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Is inverse</label><br />' +
                '           <input type="checkbox" value="" class="chk-inverse" />' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label class="col-sm-12">Rounded</label>' +
                '       <div class="col-sm-12">' +
                '           <div class="radio"><label><input type="radio" name="rounded" value="true" checked> Yes</label></div>' +
                '           <div class="radio"><label><input type="radio" name="rounded" value="false"> No</label></div>' +
                '       </div>' +
                '    </div>' +
                '   <div class="form-group">' +
                '       <div class="col-md-12"><label>Inner Padding (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="padding-top" class="paddingSettings form-control"/>' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" name="padding-left" class="paddingSettings form-control"/> ' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="padding-right" class="paddingSettings form-control"/>' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div> '+
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="padding-bottom" class="paddingSettings form-control"/>' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +

                '   <div class="form-group">' +
                '       <div class="col-md-12"><label>Margins (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="margin-top" class="marginSettings form-control"/>' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" name="margin-left" class="marginSettings form-control"/> ' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="margin-right" class="marginSettings form-control"/>' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div> '+
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" name="margin-bottom" class="marginSettings form-control"/>' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            form.find('.chk-inverse').on('click', function () {
                var comp = keditor.getSettingComponent();
                comp.find('.jumbotron')[this.checked ? 'addClass': 'removeClass']('jumbotron-inverse');
            });

            form.find('[name=rounded]').on('click', function (e) {
                var comp = keditor.getSettingComponent();
                if (this.value == 'false') {
                    comp.find('.jumbotron').css('border-radius', '0');
                } else {
                    comp.find('.jumbotron').css('border-radius', '');
                }
            });

            var buttonColorPicker = form.find('.button-color-picker');
            initColorPicker(buttonColorPicker, function (color) {
                var comp = keditor.getSettingComponent();

                if (color && color !== 'transparent') {
                    comp.find('.jumbotron').css('background-color', color);
                    comp.attr('data-bgcolor', color);
                } else {
                    comp.find('.jumbotron').css('background-color', '');

                    form.find('.button-color').val('');
                }
            });

            var paddingSettings = form.find('.paddingSettings');
            paddingSettings.on('change', function () {
                var paddingValue = this.value || '';
                var component = keditor.getSettingComponent();
                var paddingProp = $(this).attr('name');
                if (paddingValue.trim() === '') {
                    component.find('.jumbotron').css(paddingProp, '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                        this.value = paddingValue;
                    }
                    component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                }
            });

            var marginSettings = form.find('.marginSettings');
            marginSettings.on('change', function () {
                var paddingValue = this.value || '';
                var component = keditor.getSettingComponent();
                var paddingProp = $(this).attr('name');
                if (paddingValue.trim() === '') {
                    component.find('.jumbotron').css(paddingProp, '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                        this.value = paddingValue;
                    }
                    component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "jumbotron" component', component);
            form.find('[name=button-color]').val(component.attr('data-bgcolor')).trigger('change');
            form.find('.paddingSettings').each(function(){
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px',''));
            });
            form.find('.marginSettings').each(function(){
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px',''));
            });
            form.find('[name=showButton][value=false]').prop('checked', component.find('a').hasClass('hide'));
            form.find('[name=rounded][value=false]').prop('checked', component.find('.jumbotron').css('border-radius').replace('px', '') === '0');
            form.find('.chk-inverse').prop('checked', component.find('.jumbotron').hasClass('jumbotron-inverse'));
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };

})(jQuery);

