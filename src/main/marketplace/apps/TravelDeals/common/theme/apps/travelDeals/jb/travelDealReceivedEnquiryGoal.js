JBNodes['travelDealReceivedEnquiryGoal'] = {
    icon: 'fa fa-plane',
    title: 'Travel Enquiry Goal',
    type: JB_NODE_TYPE.GOAL,
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customGoal',
    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Website</label>' +
                '        <select class="form-control travelDeals-websiteName"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Deal</label>' +
                '        <select class="form-control travelDeals-deal"></select>' +
                '    </div>' +
                '</div>' + JBApp.standardGoalSettingControls
                );

        JBApp.initStandardGoalSettingControls(form);

        $.ajax({
            url: '/websites/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No website selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.travelDeals-websiteName').html(optionsStr);
            }
        });

        $.ajax({
            url: '/travelDeals/?dealType=all&asJson',
            type: 'GET',
            dataType: 'JSON',
            success: function (resp) {
                var dealHits = resp.hits.hits;

                var optionsStr = '<option value="">[No deal selected]</option>';
                for (var i = 0; i < dealHits.length; i++) {
                    var deal = dealHits[i].fields;
                    optionsStr += '<option value="' + deal.name[0] + '">' + deal.title[0] + '</option>';
                }

                form.find('.travelDeals-deal').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var dealName = form.find('.travelDeals-deal').val();
                var websiteName = form.find('.travelDeals-websiteName').val();

                JBApp.currentSettingNode.customSettings = {};
                JBApp.currentSettingNode.customSettings.dealName = dealName || null;
                JBApp.currentSettingNode.customSettings.websiteName = websiteName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);

        if (typeof node.customSettings !== 'object') {
            node.customSettings = {};
        }

        form.find('.travelDeals-deal').val(node.customSettings.dealName || '');
        form.find('.travelDeals-websiteName').val(node.customSettings.websiteName || '');

        JBApp.showSettingPanel(node);
    }
};
