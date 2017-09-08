// //  ------ VIMEO INTEGRATION WITH GA -------
// var f = document.getElementsByTagName('iframe')[0];
// if( f ) {
// 	flog("Register event tracking for iframe", f);
// 	var url = f.src.split('?')[0];
// 	// Listen for messages from the player
// 	if (window.addEventListener) {
// 	    window.addEventListener('message', onMessageReceived, false);
// 	} else {
// 	    window.attachEvent('onmessage', onMessageReceived, false);
// 	}
// }

// // Handle messages received from the player
// function onMessageReceived(e) {
//     var data = JSON.parse(e.data);

//     switch (data.event) {
//         case 'ready':
//             onReady();
//             break;

//         case 'play':
//             onPlay();
//             break;

//         case 'finish':
//             onFinish();
//             break;
//     }
// }

// function post(action, value) {
//     var data = {method: action};
//     if (value) {
//         data.value = value;
//     }
//     f.contentWindow.postMessage(JSON.stringify(data), url);
// }

// function onReady() {
//     flog("onReady");
//     post('addEventListener', 'finish');
//     post('addEventListener', 'play');
// }


// function onFinish() {
//     flog("onFinish");
//     _gaq.push(['_trackEvent', 'Campaign', "Video", "finish", url]);
// }

// function onPlay() {
//     flog("onPlay");
//     _gaq.push(['_trackEvent', 'Campaign', "Video", "play", url]);
// }

// // --------- END VIMEO TRACKING ---------------

$(function () {
    // This is the registration form, on many pages
    $("form.register-form").forms({
        confirmMessage: "Registered, redirecting to your new account...",
        validate: function () {
            if (hasGaq()) {
                flog("Track validation");
                if (hasGaq()) {
                    _gaq.push(['_trackEvent', 'Signup', window.location.pathname, "validate"]);
                }
            }
            return true;
        },
        callback: function (resp) {
            if (hasGaq()) {
                flog("Created account", resp, this);
                if (hasGaq()) {
                    _gaq.push(['_trackEvent', 'Signup', window.location.pathname, "success"]);
                }
            }
            //alert("Your account has been created, you will now be taken to your admin dashboard...");
            window.location.href = resp.nextHref;
        }
    });

    // This is the login form, it is special because you login on fuselms.com, but go to a 
    // different site
    $("form.offsite-login").forms({
        confirmMessage: "Logged in ok, taking you to your account...",
        validate: function () {
            if (hasGaq()) {
                _gaq.push(['_trackEvent', 'Login', window.location.pathname, "validate"]);
            }
            return true;
        },
        callback: function (resp) {
            if (hasGaq()) {
                flog("Login result", resp, this);
                _gaq.push(['_trackEvent', 'Login', window.location.pathname, "success"]);
            }
            if (resp.status) {
                window.location.href = resp.nextHref;
            } else {
                alert("Login failed, please check your details");
            }
        }
    });

    // The contact form
    $("form.contactus").forms({
        confirmMessage: "Sending your message...",
        validate: function () {
            if (hasGaq()) {
                _gaq.push(['_trackEvent', 'Contact', window.location.pathname, "validate"]);
            }
            return true;
        },
        callback: function (resp) {
            if (hasGaq()) {
                _gaq.push(['_trackEvent', 'Contact', window.location.pathname, "success"]);
            }
            $("form.contactus").animate({opacity: 0}, 500, function () {
                $("#contactThankyou").modal();
            });
        }
    });

    function hasGaq() {
        return (typeof _gaq !== 'undefined' && _gaq !== null);
    }
});
