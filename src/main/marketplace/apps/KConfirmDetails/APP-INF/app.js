(function (g) {
    var APP_NAME = 'KConfirmDetails';

    g._saveSettings = function (page, params) {
        var groupName = params.groupName || '';
        var showExtraFields = params.showExtraFields || '';

        page.setAppSetting(APP_NAME, 'groupName', groupName);
        page.setAppSetting(APP_NAME, 'showExtraFields', showExtraFields);

        return views.jsonResult(true);
    };


    g.getAppSettings = function (page) {
        var websiteFolder = page.closest('websiteVersion');
        var org = page.organisation;
        var branch = null;

        if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
            branch = websiteFolder.branch;
        }

        var app = applications.get(APP_NAME);
        if (app !== null) {
            var settings = app.getAppSettings(org, branch);
            return settings;
        }

        return null;
    };

    g.getKConfirmDetails = function (page, params, context) {
        log.info('KConfirmDetails > page={}, params={}, context={}', [page, params, context]);

        var appSettings = g.getAppSettings(page);

        context.put('appSettings', appSettings);
    }

// ============================================================================
// Portlet
// ============================================================================
    controllerMappings
            .websitePortletController()
            .portletSection('endOfPage')
            .templatePath('/theme/apps/KConfirmDetails/kConfirmDetails.html')
            .method('getKConfirmDetails')
            .enabled(true)
            .build();

    controllerMappings
            .websiteController()
            .path('/confirm-details')
            .addMethod('POST', 'updateUser')
            .postPriviledge('READ_CONTENT')
            .enabled(true)
            .build();

    g.updateUser = function (page, params) {
        log.info('updateUser > page={}, params={}', page, params);

        var result = {
            status: true
        };

        try {
            var db = getDB(page);
            var id = page.attributes.profileId;
            var claim = db.child(id);

            if (claim !== null) {
                var amount = +params.amount;
                if (isNaN(amount)) {
                    result.status = false;
                    result.messages = ['Amount must be digits'];
                    return views.jsonObjectView(JSON.stringify(result));
                }

                var tempDateTime = params.soldDate;
                var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
                var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
                var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
                var now = formatter.formatDateISO8601(formatter.now);

                var obj = {
                    recordId: id,
                    soldBy: claim.jsonObject.soldBy,
                    soldById: claim.jsonObject.soldById,
                    amount: amount,
                    soldDate: soldDate,
                    enteredDate: claim.jsonObject.enteredDate,
                    modifiedDate: now,
                    productSku: params.productSku || '',
                    status: claim.jsonObject.status,
                    receipt: claim.jsonObject.receipt
                };

                // Parse extra fields
                var extraFields = getSalesDataExtreFields(page);
                for (var i = 0; i < extraFields.length; i++) {
                    var ex = extraFields[i];
                    var fieldName = 'field_' + ex.name;

                    obj[fieldName] = params.get(fieldName) || '';
                }

                // Upload receipt
                var uploadedFiles = uploadFile(page, params, files);
                if (uploadedFiles.length > 0) {
                    obj.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
                }

                claim.update(JSON.stringify(obj), TYPE_RECORD);
            } else {
                result.status = false;
                result.messages = ['This claim does not exist'];
            }
        } catch (e) {
            log.error('Error when updating claim: ' + e);
            result.status = false;
            result.messages = ['Error when updating claim: ' + e];
        }

        return views.jsonObjectView(JSON.stringify(result));
    };

})(this);