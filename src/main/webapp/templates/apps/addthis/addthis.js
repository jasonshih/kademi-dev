function doRegisterOrLogin(actionUrl, userInfor) {
	log("do register or login after the end-user sign up or login through AddThis!!!");
	
	$.ajax({
        url: actionUrl,
        type: "POST",
        dataType: "json",
        data: userInfor,
        success: function(data) {
            log("successfully created user", data);
            doSocialLogin(userInfor, {
            	afterLoginUrl: "/dashboard",
                urlSuffix: "/.doSocialLogin",
                usernameProperty: "_username",
                signatureProperty: "_signature"
            });
        },
        error: function(resp, textStatus, errorThrown) {
            log("error", resp, textStatus, errorThrown);
        }
    });
}

/**
 * Social media sign in action for given account's infor
 * 
 * @param userInfor
 * @param config
 */
function doSocialLogin(userInfor, config) {
	log("doLogin", userInfor.email, config.urlSuffix);
	
	var data = new Object();
	var usernameProperty;
    if(config.usernameProperty) {
    	usernameProperty = config.usernameProperty;
    } else {
    	usernameProperty = "_username";
    }
    var signatureProperty;
    if(config.signatureProperty) {
    	signatureProperty = config.signatureProperty;
    } else {
    	signatureProperty = "_signature";
    }
    data[usernameProperty] = userInfor.email;
    data[signatureProperty] = userInfor.addthis_signature;
    
	$.ajax({
        type: 'POST',
        url: config.urlSuffix,
        data: data,
        dataType: "json",
        acceptsMap: "application/x-javascript",
        success: function(resp) {
        	log("received login response", resp)
        	initUser();
        	if(resp.status) {
        		if (config.afterLoginUrl === null) {
                    if (resp.nextHref) {
                        log("login: no afterLoginUrl and received next href, so go there", resp.nextHref);
                        window.location.href = resp.nextHref;
                    } else {
                        log("login: no afterLoginUrl and no nextHref, so reload");
                        window.location.reload();
                    }                    
                } else if (config.afterLoginUrl.startsWith("/")) {
                    log("redirect to: " + config.afterLoginUrl);
                    window.location = config.afterLoginUrl;
                }
        	}
        },
        error: function(resp, textStatus, errorThrown) {
            log("error", resp, textStatus, errorThrown);
        }
	});
}