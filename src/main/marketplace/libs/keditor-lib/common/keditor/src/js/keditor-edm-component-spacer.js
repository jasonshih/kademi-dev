/**
 * KEditor Spacer Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['spacer'] = {
        settingEnabled: true,

        settingTitle: 'Spacer Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "spacer" component');
            form.append(
                '<div class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <label for="spacer-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="spacer-height" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '</div>'
            );
    
            form = form.find('.form-horizontal');
            edmEditor.initDefaultComponentControls(form, keditor, {
                hidePadding: true
            });

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.on('change', function () {
                keditor.getSettingComponent().find('.spacer').attr('height', this.value);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "spacer" component', component);

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.val(component.find('.spacer').attr('height'));
    
            edmEditor.showDefaultComponentControls(form, component, keditor);
        }
    };

})(jQuery);
