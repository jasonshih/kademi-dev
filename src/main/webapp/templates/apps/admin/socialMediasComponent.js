(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['socialMedias'] = {
        socialNetworks: ['facebook', 'twitter', 'googleplus', 'linkedin', 'youtube', 'instagram', 'pinterest', 'github', 'tumblr'],
        settingEnabled: true,
        settingTitle: 'Social Medias Settings',
        initSettingForm: function (form, keditor) {
            var self = this;

            return $.ajax({
                url: '_components/socialMedias?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var socialNetworksWrapper = form.find('.social-networks');
                    $.each(self.socialNetworks, function (i, socialNetwork) {
                        var str = '';
                        str += '<div class="checkbox" style="margin-bottom: 10px;">';
                        str += '    <div style="padding-left: 20px;">';
                        str += '        <input type="checkbox" name="' + socialNetwork + '-enable" />';
                        str += '        <div class="input-group input-group-sm" style="margin-bottom: 5px;">';
                        str += '            <span class="input-group-addon"><i class="fa fa-fw fa-' + (socialNetwork === 'googleplus' ? 'google-plus' : socialNetwork) + '"></i></span>';
                        str += '            <input type="text" class="form-control" placeholder="Text" name="' + socialNetwork + '-text" disabled="disabled" />';
                        str += '            <input type="text" class="form-control" placeholder="Link" name="' + socialNetwork + '-link" disabled="disabled" />';
                        str += '        </div>';
                        str += '    </div>';
                        str += '</div>';

                        var socialNetworkEl = $(str);
                        var checkbox = socialNetworkEl.find('input:checkbox');
                        var txtText = socialNetworkEl.find('[name="' + socialNetwork + '-text"]');
                        var txtLink = socialNetworkEl.find('[name="' + socialNetwork + '-link"]');

                        flog(txtText);
                        flog(txtLink);

                        socialNetworkEl.find('input:checkbox').on('click', function () {
                            txtText.add(txtLink).prop('disabled', !this.checked);

                            flog(txtText);
                            flog(txtLink);

                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-' + socialNetwork + '-enable', this.checked);
                            keditor.initDynamicContent(dynamicElement);
                        });

                        txtText.on('change', function () {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-' + socialNetwork + '-text', this.value);
                            keditor.initDynamicContent(dynamicElement);
                        });

                        txtLink.on('change', function () {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-' + socialNetwork + '-link', this.value);
                            keditor.initDynamicContent(dynamicElement);
                        });

                        socialNetworksWrapper.append(socialNetworkEl);
                    });

                    form.find('.select-display').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-display', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.icon-size-wrapper').css('display', this.value === 'text' ? 'none' : 'block');
                    });

                    form.find('.select-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=icon-style]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-icon-style', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.icon-size').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 16) {
                            number = 16
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-icon-size', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "recent points" component');

            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-display').val(dataAttributes['data-display']);
            form.find('.select-align').val(dataAttributes['data-align']);
            form.find('.select-layout').val(dataAttributes['data-layout']);
            form.find('.icon-size').val(dataAttributes['data-icon-size']);
            form.find('.icon-size-wrapper').css('display', dataAttributes['data-display'] !== 'text' ? 'block' : 'none');
            form.find('[name=icon-style][value="' + dataAttributes['data-icon-style'] + '"]').prop('checked', true);

            for (var i = 0, socialNetwork; socialNetwork = self.socialNetworks[i]; i++) {
                form.find('[name=' + socialNetwork + '-enable]').prop('checked', dataAttributes['data-' + socialNetwork + '-enable'] === 'true');
                form.find('[name=' + socialNetwork + '-text]').val(dataAttributes['data-' + socialNetwork + '-text']).prop('disabled', dataAttributes['data-' + socialNetwork + '-enable'] !== 'true');
                form.find('[name=' + socialNetwork + '-link]').val(dataAttributes['data-' + socialNetwork + '-link']).prop('disabled', dataAttributes['data-' + socialNetwork + '-enable'] !== 'true');
            }
        }
    };

})(jQuery);