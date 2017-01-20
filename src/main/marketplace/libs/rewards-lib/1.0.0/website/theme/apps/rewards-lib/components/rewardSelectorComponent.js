(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['rewardSelector'] = {
        settingEnabled: true,
        settingTitle: 'Reward Selector',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardSelector" component', form, keditor);

            return $.ajax({
                url: '_components/rewardSelector?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    //form.find('[name=groups]').on('click', function(e){
                    //    var component = keditor.getSettingComponent();
                    //    var dynamicElement = component.find('[data-dynamic-href]');
                    //    var groups = [];
                    //    form.find('[name=groups]:checked').each(function(){
                    //        groups.push(this.value);
                    //    });
                    //    component.attr('data-groups', groups.join(','));
                    //    keditor.initDynamicContent(dynamicElement);
                    //});

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardSelector" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            //form.find('[name=groups]').each(function(){
            //    if (dataAttributes['data-groups'].indexOf(this.value)!==-1){
            //        this.checked = true;
            //    }
            //});
        }
    };
})(jQuery);
