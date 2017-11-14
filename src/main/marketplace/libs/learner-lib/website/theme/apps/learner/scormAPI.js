/*
 *
 * Cache
 */

var moduleCache = {};
var lastErrorCode = 0;
var lastErrorString = "No Error";

/*
 * Kademi's API Adapters
 */
var KademiAPI = {
    Initialize: function () {
        flog('ScormAPI:Initialize', arguments);
        var fields = doPropFind([
            'milton:currentPage',
            'milton:complete',
            'milton:percentComplete',
            'milton:score',
            'milton:learningTimeMins',
            'milton:startable',
            'milton:completable',
            'milton:level',
            'milton:order',
            'milton:currentLevel',
            'milton:moduleStatusFields']);
        $.extend(true, moduleCache, fields[0]);
        return true;
    },
    Terminate: function () {
        flog('ScormAPI:Terminate', arguments);
        return true;
    },
    GetValue: function (element) {
        flog('ScormAPI:GetValue', element);
        return Kademi_GetValue(element);
    },
    SetValue: function (element, value) {
        flog('ScormAPI:SetValue', element, value);
        return Kademi_SetValue(element, value);
    },
    Commit: function () {
        flog('ScormAPI:Commit');
        return true;
    },
    GetLastError: function () {
        flog('ScormAPI:GetLastError');
        return Kademi_GetLastError();
    },
    GetErrorString: function (errorCode) {
        flog('ScormAPI:GetErrorString', errorCode);
        return Kademi_GetErrorString();
    },
    GetDiagnostic: function (errorCode) {
        flog('ScormAPI:GetDiagnostic', errorCode);
        return Kademi_GetDiagnostic();
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
            if (moduleCache.hasOwnProperty('currentPage')) {
                var val = moduleCache['currentPage'];
                if (val !== null && typeof val !== 'undefined') {
                    return val;
                }
            }
            var resp = doPropFind(['milton:currentPage']);
            var d = resp[0];
            if( d.currentPage == null ) {
                d.currentPage = "";
            }
            flog('cmi.location', d.currentPage);
            moduleCache['currentPage'] = d.currentPage;
            return d.currentPage;
        default:
            if (moduleCache.hasOwnProperty('moduleStatusFields')) {
                var moduleStatusFields = moduleCache['moduleStatusFields'];
                if (moduleStatusFields.hasOwnProperty(dataModel)) {
                    var val = moduleStatusFields[dataModel];
                    if (val !== null && typeof val !== 'undefined') {
                        return val;
                    }
                }
            }
            var resp = doPropFind(['milton:moduleStatusFields']);
            if (isNotNull(resp.moduleStatusFields) && isNotNull(resp.moduleStatusFields[dataModel])) {
                moduleCache['moduleStatusFields'][dataModel] = esp.moduleStatusFields[dataModel];
                return resp.moduleStatusFields[dataModel];
            }

            return "";
    }
}

function setError() {
    lastErrorCode = 0;
    lastErrorString = "No Error";
    diagnostic = "";
}

function setError(code, String, details) {
    lastErrorCode = code;
    lastErrorString = String;
    diagnostic = details;
}

function doPropFind(fields) {
    var respText = $.ajax({
        type: "GET",
        dataType: 'json',
        async: false,
        url: window.location.pathname.replace('index.html', '') + "_DAV/PROPFIND?fields=" + fields.join(','),
        success: function (response) {
            setError(0, "No error", "");
            flog('retrieve ok', response);
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            setError(301, "General Get Failure", thrownError);
            flog('error getting moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    }).responseText;

    var d = JSON.parse(respText);

    return d;
}

function Kademi_SetValue(dataModel, value) {
    dataModel = dataModel.toString().toLowerCase().trim();
    switch (dataModel) {
        case 'cmi.location' :
            var data = {};
            data["statusCurrentPage"] = value;
            moduleCache['currentPage'] = value;
            doAjaxPost(data, function (resp) {
                return resp.status;
            });
            break;
        default:
            var data = {};
            data["changedField"] = dataModel;
            data["changedValue"] = value;
            moduleCache['moduleStatusFields'][dataModel] = value;
            doAjaxPost(data, function (resp) {
                return resp.status;
            });
    }

    return true;
}


function Kademi_GetLastError() {
    return lastErrorCode;
}

function Kademi_GetErrorString() {
    return lastErrorString;
}

function doAjaxPost(data, callback) {
    $.ajax({
        type: "POST",
        url: window.location.pathname.replace('index.html', ''),
        data: data,
        success: function (response) {
            flog('saved ok', response);
            setError(0, "No error", "");
            if (callback) {
                callback(response);
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            setError(351, "General Set Failure", thrownError);
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });
}

function isNull(s) {
    return s === null || typeof (s) === 'undefined';
}

function isNotNull(s) {
    return s !== null && typeof (s) !== 'undefined';
}

function resizeIframe(obj) {
    obj.style.height = '750px';
    if (obj.contentWindow.document.body.scrollHeight > 500) {
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    }
    obj.style.width = obj.contentWindow.document.body.scrollWidth + 'px';
}

(function($){
    $(document).ready(function(){
        if($('.scormpage').length > 0) {
            $(window).on('resize', function () {
                flog('ON resize');
                $('#iframe-container').css('top', $('#maincontentContainer').offset().top);
            }).trigger('resize');
        }
    });
})(jQuery);