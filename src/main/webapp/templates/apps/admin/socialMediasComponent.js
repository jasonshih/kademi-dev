(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['socialMedias'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, keditor) {
            // Do nothing
        },
        socialNetworks: ['facebook', 'twitter', 'googleplus', 'linkedin', 'youtube', 'instagram', 'pinterest', 'github', 'tumblr'],
        settingEnabled: true,
        settingTitle: 'Social Medias Settings',
        initSettingForm: function (form, keditor) {
            var self = this;

            $.ajax({
                url: '/_components/edm/socialMedias?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var socialNetworksWrapper = form.find('.social-networks');

                    for (var i = 0, socialNetwork; socialNetwork = self.socialNetworks[i]; i++) {
                        var str = '';
                        str += '<div class="checkbox">';
                        str += '    <div style="padding-left: 20px;">';
                        str += '        <input type="checkbox" name="' + socialNetwork + '-enable" />';
                        str += '        <div class="input-group input-group-sm" style="margin-bottom: 5px;">';
                        str += '            <span class="input-group-addon" style="width: 45px;">Text</span>';
                        str += '            <input type="text" class="form-control" placeholder="Username" name="' + socialNetwork + '-text" />';
                        str += '        </div>';
                        str += '        <div class="input-group input-group-sm">';
                        str += '            <span class="input-group-addon" style="width: 45px;">Link</span>';
                        str += '            <input type="text" class="form-control" placeholder="Username" name="' + socialNetwork + '-link" />';
                        str += '        </div>';
                        str += '    </div>';
                        str += '</div>';

                        socialNetworksWrapper.append(str);
                    }
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "recent points" component');

            //var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            //form.find('.socialMediasBucket').val(dataAttributes['data-bucket']);
            //form.find('.socialMediasDays').val(dataAttributes['data-days']);
            //form.find('.socialMediasHeight').val(dataAttributes['data-height']);
        },
        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);