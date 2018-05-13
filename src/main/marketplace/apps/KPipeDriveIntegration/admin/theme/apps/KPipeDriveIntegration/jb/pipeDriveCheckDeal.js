JBNodes['pipeDriveCheckDealNode'] = {
    icon: 'fa fa-bullseye',
    title: 'Check Pipedrive Deal',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/KPipeDriveIntegration/jb/pipeDrive.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When Stage Reached',
            maxConnections: 1
        },
        notReached: {
            label: 'not',
            title: 'When Stage Not Reached',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customAction',
    
    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Stage</label>' +
            '        <select class="form-control stage">' +
            '           <option value="">[Please Select]</option>' +
            '           <option value="new">New</option>' +
            '           <option value="insufficient-detail">Insufficient Detail</option>' +
            '           <option value="customer-contacted">Customer Contacted</option>' +
            '           <option value="flag-for-review">Flag for review</option>' +
            '           <option value="escalated-to-mhiaa">Escalated to MHIAA</option>' +
            '           <option value="approved">Approved - Send Email</option>' +
            '           <option value="pay-consumer">Pay Consumer</option>' +
            '           <option value="payment-bounced">Payment Bounced</option>' +
            '           <option value="declined">Declined</option>' +
            '           <option value="pay-again">Pay Again</option>' +
            '           <option value="closed-approved">Closed - Approved</option>' +
            '           <option value="closed-declined">Closed - Declined</option>' +
            '        </select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Display for Consumers: </label>' +
            '        <input type="text" class="form-control display-for-customers" placeholder="Text to display for customers" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Hoover description shown to Consumers:</label>' +
            '        <textarea rows="4"class="form-control description-for-customers"></textarea>' +
            '    </div>' +
            '</div>'
        );
            
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var stage = form.find('.stage').val();
                var displayForCustomers = form.find('.display-for-customers').val();
                var description = form.find('.description-for-customers').val();
                
                JBApp.currentSettingNode.customSettings = {};
                JBApp.currentSettingNode.customSettings['stage'] = stage || null;
                JBApp.currentSettingNode.customSettings['displayForCustomers'] = displayForCustomers || null;
                JBApp.currentSettingNode.customSettings['description'] = description || null;

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();

            }
        });
            
    },

    showSettingForm: function (form, node) {
        var customSettings = node.customSettings === undefined ? {} : node.customSettings;
        form.find('.stage').val(customSettings.stage !== null ? customSettings.stage : '');
        form.find('.display-for-customers').val(customSettings.displayForCustomers !== null ? customSettings.displayForCustomers : '');
        form.find('.description-for-customers').val(customSettings.description !== null ? customSettings.description : '');
        JBApp.showSettingPanel(node);
    }
};

