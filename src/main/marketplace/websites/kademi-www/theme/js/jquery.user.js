/**
 *
 *  jquery.login.js
 *  
 *  Depends on user.js and common.js
 *  
 *  The target should be a div containing
 *  - a form
 *  - <p> with id validationMessage
 *  - input type text for the username
 *  - input type password for the password
 *  
 *  Additionally, will prompt the user to register or login for any links of class requiresUser
 *
 * Config:
 * urlSuffix: is appended to the current page url to make the url to POST the login request to. Default /.ajax
 * afterLoginUrl: the page to redirect to after login. Default index.html.  3 possibilities 
 *      null = do a location.reload()
 *      "none" - literal value "none" means no redirect
 *      "something" or "" = a relative path, will be avaluated relative to the user's url (returned in cookie)
 *      "/dashboard" = an absolute path, will be used exactly as given
 *  logoutSelector
 *  valiationMessageSelector
 *  requiredFieldsMessage
 *  loginFailedMessage
 *  userNameProperty: property name to use in sending request to server
 *  passwordProperty
 *  loginCallback: called after successful login
 * 
 */

(function($) {
    $.fn.user = function(options) {
        flog("init user plugin", this);
        initUser();
        var config = $.extend({
            urlSuffix: "/.dologin",
            afterLoginUrl: null,
            logoutSelector: ".logout",
            valiationMessageSelector: ".email span",
            requiredFieldsMessage: "Please enter your credentials.",
            loginFailedMessage: "Sorry, those login details were not recognised.",
            userNameProperty: "_loginUserName",
            passwordProperty: "_loginPassword",
            loginCallback: function() {

            }
        }, options);

        $(config.logoutSelector).click(function() {
            doLogout();
        });

        var container = this;
        flog("init login form", $("form", this));
        $("form", this).click(function(e) {
            flog("click", e);
        });
        $("form", this).submit(function(e) {
            flog("jquery.user.js(bootstrap320): login", window.location.pathname);
            e.stopPropagation();
            e.preventDefault();

            $("input", container).removeClass("errorField");
            $(config.valiationMessageSelector, this).hide(100);
            try {
                var userName = $("input[name=email]", container).val();
                var password = $("input[type=password]", container).val();
                if (userName === null || userName.length === 0) {
                    $("input[type=text]", container).closest(".control-group")
                            .addClass("error")
                            .find("span").text(config.requiredFieldsMessage);

                    return false;
                }
                doLogin(userName, password, config, container);
            } catch (e) {
                flog("exception logging in", e);
            }
            return false;
        });
        flog("init requiresUser links");        
        // use a body class to ensure is only inited once
        $("body").not("body.requiresUserDone").addClass("requiresUserDone").on("click", "a.requiresUser, button.requiresUser", function(e) {
            var target = $(e.target);
            flog("check required user", target, userUrl);
            if (userUrl === null || userUrl === "") {
                e.preventDefault();
                e.stopPropagation();
                showRegisterOrLoginModal(function() {
                    //target.click();
                    flog("going to", target.attr("href"));
                    window.location.href = target.attr("href");
                    //target.click();

                });
            } else{ 
                flog("all good, carry on...");
            }
        });
    };
})(jQuery);


function doLogin(userName, password, config, container) {
    flog("doLogin1", userName, config.urlSuffix);
    $(config.valiationMessageSelector).hide();
    var data = new Object();
    var userNameProperty;
    if (config.userNameProperty) {
        userNameProperty = config.userNameProperty;
    } else {
        userNameProperty = "_loginUserName";
    }
    var passwordProperty;
    if (config.passwordProperty) {
        passwordProperty = config.passwordProperty;
    } else {
        passwordProperty = "_loginPassword";
    }

    data[userNameProperty] = userName;
    data[passwordProperty] = password;
    $.ajax({
        type: 'POST',
        url: config.urlSuffix,
        data: data,
        dataType: "json",
        acceptsMap: "application/x-javascript",
        success: function(resp) {
            flog("login success", resp)
            initUser();
            if (resp.status) {
                if (config.loginCallback) {
                    config.loginCallback();
                }
                if (config.afterLoginUrl == null) {
                    // If not url in config then use the next href in the response, if given, else reload current page
                    if (resp.nextHref) {
                        window.location.href = resp.nextHref;
                    } else {
                        window.location.reload();
                    }
                } else if (config.afterLoginUrl.startsWith("/")) {
                    // if config has an absolute path the redirect to it
                    log("redirect to: " + config.afterLoginUrl);
                    //return;
                    window.location = config.afterLoginUrl;
                } else {
                    if (config.afterLoginUrl === "none") {
                        flog("Not doing redirect because afterLoginUrl=='none'");
                    } else if( config.afterLoginUrl === "reload") {
                        window.location.reload();
                        
                    } else {
                        // if config has a relative path, then evaluate it relative to the user's own url in response
                        flog("redirect to2: " + userUrl + config.afterLoginUrl);
                        //return;
                        window.location = userUrl + config.afterLoginUrl;
                    }
                }
            } else {
                // null userurl, so login was not successful
                $(config.valiationMessageSelector, container).text(config.loginFailedMessage);
                flog("null userUrl, so failed. Set validation message message", $(config.valiationMessageSelector, this), config.loginFailedMessage);
                $(config.valiationMessageSelector, container).show(200);
            }
            //window.location = "/index.html";
        },
        error: function(resp) {
            $(config.valiationMessageSelector).text(config.loginFailedMessage);
            var val = $(config.valiationMessageSelector, this);
            flog("error response from server", val, "config msg:", config.loginFailedMessage, "resp:", resp);
            if( val.length === 0 ) {
                flog("show message", container);
                showMessage("Login failed, please check your credentials", container);
            } else {
                flog("show validation container");
                val.show(300);
            }
        }
    });
}

var userUrl = null;
var userName = null;

/**
 * returns true if there is a valid user
 */
function initUser() {
    if (userUrl) {
        return true; // already done
    }
    initUserCookie();
    flog("initUser");
    if (isEmpty(userUrl)) {
        // no cookie, so authentication hasnt been performed.
        flog('initUser: no userUrl');
        $(".requiresuser").hide();
        $(".sansuser").show();
        $("body").addClass("notLoggedIn");
        return false;
    } else {
        flog("userUrl", userUrl);
        $("body").addClass("isLoggedIn");
        userName = userUrl.substr(0, userUrl.length - 1); // drop trailing slash
        var pos = userUrl.indexOf("users");
        userName = userName.substring(pos + 6);
        
        flog("current userName", userName);
        
        $("#currentuser").attr("href", userUrl);
        $(".requiresuser").show();
        $(".sansuser").hide();
        $("a.relativeToUser").each(function(i, node) {
            var oldHref = $(node).attr("href");
            $(node).attr("href", userUrl + oldHref);
        });
        return true;
    }
}

function initUserCookie() {
    userUrl = $.cookie('miltonUserUrl');
    if (userUrl && userUrl.length > 1) {
        flog("initUserCookie", userUrl);
        if( userUrl.startsWith("b64")) {
            userUrl = userUrl.substring(3); // strip b64 ext
            userUrl = Base64.decode(userUrl);
        }
        userUrl = dropQuotes(userUrl);
        userUrl = dropHost(userUrl);
        userName = userUrl.substr(0, userUrl.length - 1); // drop trailing slash
        var pos = userUrl.indexOf("users");
        userName = userName.substring(pos + 6);
        flog('initUserCookie: user:', userUrl, userName);
    } else {
        flog("initUserCookie: no user cookie");
        userName = null;
    }
}

function isEmpty(s) {
    return s == null || s.length == 0;
}

function doLogout() {
    flog("doLogout");
    $.ajax({
        type: 'POST',
        url: "/.dologin",
        data: "miltonLogout=true",
        dataType: "text",
        success: function() {
            flog("logged out ok, going to root...");
            window.location = "/";
        },
        error: function(resp) {
            flog('There was a problem logging you out', resp);
            window.location = "/";
        }
    });
}


function dropQuotes(s) {
    if (s.startsWith("\"")) {
        s = s.substr(1);
    }
    if (s.endsWith("\"")) {
        s = s.substr(0, s.length - 1);
    }
    return s;
}

function dropHost(s) {
    if (!s.startsWith("http")) {
        return s;
    }
    var pos = s.indexOf("/", 8);
    flog("pos", pos);
    s = s.substr(pos);
    return s;
}

function showRegisterOrLoginModal(callbackOnLoggedIn) {
    var modal = $("#registerOrLoginModal");
    if (modal.length === 0) {
        modal = $("<div class='modal fade'><div class='modal-dialog modal-lg'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h3 class='modal_h3'>Login or Register to post a message</h3></div><div class='modal-body'>Please wait...</div></div></div></div>");
        $("body").append(modal);
        modal.find(".close").click(function() {
            closeModals();
        });
    }
    flog("showRegisterOrLoginModal - bootstrap320");
    $.getScript("/theme/apps/signup/register.js", function() {
        $.ajax({
            type: 'GET',
            url: "registerOrLogin",
            dataType: "html",
            success: function(resp) {
                var page = $(resp);
                var r = page.find(".registerOrLoginCont");
                //log("content", page, "r", r);
                modal.find(".modal-body").html(r);
                flog("modal", modal);
                $(".loginCont").user({
                    afterLoginUrl:window.location.pathname,
                    loginCallback: function() {
                        closeModals();                        
                        flog("logged in ok, process callback", callbackOnLoggedIn);
                        $('body').trigger('userLoggedIn', [userUrl, userName]);
                        callbackOnLoggedIn();
                    }
                });
                initRegisterForms("none", function() {
                    closeModals();                     
                    flog("registered and logged in ok, process callback");
                    $('body').trigger('userLoggedIn', [userUrl, userName]);
                    callbackOnLoggedIn();
                });
            },
            error: function(resp) {
                modal.find(".modal-body").html("<p>Sorry, there was a problem loading the form. Please refresh the page and try again</p>");
            }
        });

    });
    flog("showModal...", showModal);
    showModal(modal);
}

/** End jquery.login.js */