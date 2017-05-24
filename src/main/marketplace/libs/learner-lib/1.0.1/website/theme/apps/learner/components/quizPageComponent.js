/**
 * Created by Anh on 7/18/2016.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['quizPage'] = {
        settingEnabled: true,

        settingTitle: 'Quiz Page Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "quizPage" component', form, keditor);

            return $.ajax({
                url: '_components/quizPage?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    //form.find('[name=showCourseBody]').on('click', function(e){
                    //    var component = keditor.getSettingComponent();
                    //    var dynamicElement = component.find('[data-dynamic-href]');
                    //    component.attr('data-show-course-body', this.value === 'true');
                    //    keditor.initDynamicContent(dynamicElement);
                    //});
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "quizPage" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            //form.find('[name=showCourseBody][value='+dataAttributes['data-show-course-body']+']').prop('checked', true);
        }
    };

})(jQuery);