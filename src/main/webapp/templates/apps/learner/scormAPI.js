/* 
 * Kademi's API Adapters
 */
var KademiAPI = {
    Initialize: function () {
        flog('ScormAPI:Initialize', arguments);
        return true;
    },
    Terminate: function () {
        flog('ScormAPI:Terminate', arguments);
        return true;
    },
    GetValue: function (element) {
        flog('ScormAPI:GetValue', element);
        Kademi_GetValue(element);
    },
    SetValue: function (element, value) {
        flog('ScormAPI:SetValue', element, value);
        Kademi_SetValue(element, value);
    },
    Commit: function () {
        flog('ScormAPI:Commit');
    },
    GetLastError: function () {
        flog('ScormAPI:GetLastError');
    },
    GetErrorString: function (errorCode) {
        flog('ScormAPI:GetErrorString', errorCode);
    },
    GetDiagnostic: function (errorCode) {
        flog('ScormAPI:GetDiagnostic', errorCode);
    }
};

/* Scorm 2004 API */
var API_1484_11 = {
    Initialize: KademiAPI.Initialize,
    Terminate: KademiAPI.Terminate,
    GetValue: KademiAPI.GetValue,
    SetValue: KademiAPI.SetValue,
    Commit: KademiAPI.Commit,
    GetLastError: KademiAPI.GetLastError,
    GetErrorString: KademiAPI.GetErrorString,
    GetDiagnostic: KademiAPI.GetDiagnostic
};

/* Scorm 1.1/1.2 API */
var API = {
    LMSInitialize: KademiAPI.Initialize,
    LMSFinish: KademiAPI.Terminate,
    LMSGetValue: KademiAPI.GetValue,
    LMSSetValue: KademiAPI.SetValue,
    LMSCommit: KademiAPI.Commit,
    LMSGetLastError: KademiAPI.GetLastError,
    LMSGetErrorString: KademiAPI.GetErrorString,
    LMSGetDiagnostic: KademiAPI.GetDiagnostic
};

/*
 * Kademi API
 */
function Kademi_GetValue(dataModel) {
    dataModel = dataModel.toString().toLowerCase().trim();

    switch (dataModel) {
        case 'cmi.location' :
            var resp = doPropFind(['milton:currentPage']);
            var d = resp[0];
            flog('cmi.location', d.currentPage);
            return d.currentPage;
        case 'cmi.objectives._count':
            return 8;
    }
}

function doPropFind(fields) {
    var respText = $.ajax({
        type: "GET",
        dataType: 'json',
        async: false,
        url: window.location.pathname.replace('index.html', '') + "_DAV/PROPFIND?fields=" + fields.join(',')
    }).responseText;

    var d = JSON.parse(respText);

    return d;
}

function Kademi_SetValue(dataModel, value) {
    dataModel = dataModel.toString().toLowerCase().trim();
    switch (dataModel) {
        case "cmi.location" :
            var data = {};
            data["statusCurrentPage"] = value;
            doAjaxPost(data, function (resp) {
                return resp.status;
            });
            break;
    }
}

function doAjaxPost(data, callback) {
    $.ajax({
        type: "POST",
        url: window.location.pathname.replace('index.html', ''),
        data: data,
        success: function (response) {
            flog('saved ok', response);
            if (callback) {
                callback(response);
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });
}