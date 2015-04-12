var currentModuleName;
var currentModuleId;
var progressPage; // the most advanced page the user has yet visited, set by inline script in the page
var modStatusUrl;
var modStatusComplete;
var isCompletable;

function initModulePage(pStatUrl, pFinished, pEditMode, pIsCompletable) {
    isCompletable = pIsCompletable && !pFinished;
    if (pEditMode) {
        edifyPage(".contentForm");
    } else {
        initModuleNav(pStatUrl, pFinished);
        initLearningContentStyles();
        initComments(pStatUrl);
    }
    var a = navigator.userAgent.toLowerCase();
    var isDesktop = !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
    flog("isDesktop?", isDesktop, "useragent", a);
    initModuleSearch();
    if (!isDesktop) {
        $.getScriptOnce("/static/touchSwipe/1.6.5/jquery.touchSwipe.js", function() {
            flog("init swiping");
            $(".module-container").swipe({
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    $(".nextBtn").click();
                },
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    $(".prevBtn").click();
                }
            });
        });
    }
}


function initModuleNav(pStatUrl, pFinished) {
    flog("initModuleNav");
    modStatusUrl = pStatUrl;
    modStatusComplete = pFinished;
    initPageNav();

    // This needs to be just done once, not on each pjax transition
    $("body").on("click", ".nextBtn", function(e) {
        if (!checkNext()) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        checkSubmit(e);
    });

    $('.pages a').click(function(e) {
        var a = $(e.target).closest("a");
        if (a.hasClass("disabled")) {
            flog("preventing click on disabled link", a);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    });
    flog("setup pjax", $('.pages a'));
    $(document).pjax2('.panelBox', {
        selector: ".pages a",
        fragment: ".panelBox",
        success: function() {
            flog("done!");
            initPrintLink(); // called by init-theme
            initPageNav();
        }
    });
}

function tidyUpQuiz() {
    // Hack: Need to hide quiz elements which have quiz editor help text
    $("ol.quiz li p").each(function(i, n) {
        var node = $(n);
        var text = node.text();
        if (text.startsWith("[")) {
            node.hide();
        }
    });
}

function initPageNav() {
//    prettyPrint(); // TODO: hook up seperately
    $(".pages a")
            .removeClass("active")
            .closest("li").removeClass("active");

    var pageName = getFileName(window.location.pathname);
    pageName = pageName.replaceAll(" ", "%20");
    pageName = decodeURI(pageName);
    flog("initPageNav", pageName);
    $(".pages a.modPage").each(function(i, n) {
        var node = $(n);
        var link = decodeURI(node.attr("href"));
        if (link === pageName) {
            //flog("initPageNav-found", pageName, link);
            $(n).addClass("active");
            $(n).closest("li").addClass("active");
        } else {
            //flog("initPageNav-notfound", pageName, link);
        }
    });

    tidyUpQuiz();

    if (!isCompletable || currentPageIndex() > progressPage) {
        flog("show when complete");
        $("ol.quiz input").prop("disabled", true);
        $(".when-complete").show();
        $(".when-not-complete").hide();
    } else {
        flog("show when not complete");
        $(".when-complete").hide();
        $(".when-not-complete").show();
    }

    initLearningContentStyles();
    initModalLinks();

    //$("table.classifier").classifier();
    //
    // set active on current page nav
    flog("initPageNav. modStatusComplete=", modStatusComplete, "userurl", userUrl);

    $('html, body').animate({
        scrollTop: 0
    }, 'slow');

    var s = getMoveHref(-1);
    flog('prev url', s);
    $(".prevBtn").attr("href", s);
    s = getMoveHref(1);
    $(".nextBtn").attr("href", s);

    if (modStatusComplete) {
        flog("initPageNav: module is complete so do nothing");
    } else {
        var c = currentPageIndex();
        var p = progressPageIndex();
        if (!p || c > p) { // only save current page if it is the furthest yet visited
            window.setTimeout(function() {
                flog("do save progress because we changed page");
                save();
            }, 500);
        } else {
            flog("not doing save, so explicitly reload fields...", modStatusUrl);
            doRestoreFields();
        }
    }
    checkProgressPageVisibility();
    // Setup event to save any changes on the fly
    flog("init field saving", $("#body textarea, #body input, #body select"));
    $("#body textarea, #body input, #body select").change(function(e) {
        flog("changed field", e.target);
        var field = $(e.target);
        saveField(field.attr("name"), field.val(), modStatusUrl);
    });

    // Need to delay, because this script might be running before other scripts
    // have had time to register for the event
    window.setTimeout(function() {
        flog("fire modulePageLoad event");
        $("body").trigger("modulePageLoad");
    }, 50);
}

function doRestoreFields() {
    $.ajax({
        type: "GET",
        url: modStatusUrl + "?fields",
        dataType: "json",
        success: function(response) {
            restoreFields(response);
        },
        error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error restoring fields', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });
}

/**
 * Called on page load and expand events, checks to see what progress navigation
 * elements should be enabled
 */
function checkProgressPageVisibility() {
    flog("checkProgressPageVisibility");
    var hiddenSections = $(".btnHideFollowing").not(".expanded");
    var hasHidden = hiddenSections.length > 0;
    if (currentPageIndex() < progressPageIndex()) {
        $(".pages a.nextBtn").show();
    }

    var isInputsDone = true;
    // has the user already progressed beyond this page?
    var isBeyondCurrent = progressPageIndex() > currentPageIndex();
    flog("isBeyondCurrent:", progressPageIndex(), currentPageIndex())
    var onQuiz = false; // figure out if user is on a quiz page
    var quiz = $("ol.quiz");
    if (quiz.length > 0) {
        if (isBeyondCurrent) {
            var inputs = quiz.find("input, select, textarea");
            inputs.attr("readonly", "true").attr("disabled", "true");
            $(".submitQuiz").hide();
        } else {
            onQuiz = true; // use is on a quiz page
        }
    } else {
        isInputsDone = (findIncompleteInputs().length === 0);
        flog("Not a quiz page, so check if fields completed... = ", isInputsDone);
    }

    // Page nav button is enabled if its index is <= progress page index, or all btnHideFollowing have expanded class and its index = current+1 and current page=progress page
    var p = progressPageIndex();
    var c = currentPageIndex();
    // if for some reason progress page is less then current page, then make progress page the current page
    if (p < c) {
        p = c;
    }

    var pagesList = $(".pages");
    var pages = pagesList.find("a.modPage");
    pages.find("li").removeClass("limit-lower").removeClass("limit-upper").removeClass("limit");
    pages.first().closest("li").addClass("limit-end");
    pages.last().closest("li").addClass("limit-end");
    pages.each(function(i, n) {
        var a = $(n);
        var away = Math.abs(c - i);
        var limited = away;
        if (away > 10) {
            limited = 10;
        }
        var li = a.closest("li");
        $.each(li.classes(), function(i, n) {
            if (n.startsWith("away")) {
                li.removeClass(n);
            }
        });
        li.addClass("away-" + away).addClass("away-limited-" + limited);
        var enabled = i <= p || i == c || (i == (c + 1) && isInputsDone && !hasHidden);
        enabled = enabled || !isCompletable; // all links enabled for view only (non completable) enrolments
        //flog("is enabled?", a, i, p, c,isInputsDone,isCompletable, "=", enabled);
        setLinkEnabled(a, enabled);
    });

    var nextEnabled;
    flog("modStatusComplete", modStatusComplete, "isBeyondCurrent", isBeyondCurrent, "isLastPage())", isLastPage());
    if (!isCompletable) {
        // For a non-completable enrolement we allow users to view any page in any order
        nextEnabled = true;
    } else if (!modStatusComplete && !isBeyondCurrent && (quiz.length > 0 || isLastPage())) {
        $("a.nextBtn span").text("Submit");
        nextEnabled = true;
    } else {
        $("a.nextBtn span").text("Next");
        var nextLink = pages.filter(".active").next();
        // if there's a hidden section, clicking next will show it
        // If inputs are not complete, still show next so they user can click it to get validation
        nextEnabled = nextLink.hasClass("enabled") || hasHidden || !isInputsDone;
        flog("nextEnabled=", nextEnabled, nextLink, "hasHidden=", hasHidden, "isInputsDone=", isInputsDone);
    }

    setLinkEnabled($(".pages a.nextBtn"), nextEnabled);
}


// Set this on page load to call custom validation logic on next
var checkNextValidationFunction = null;

function checkNext() {
    flog("checkNext");
    var popout = $("div.pages div.popout");
    popout.hide();
    var hiddenSections = $(".btnHideFollowing").not(".expanded").filter(":visible");
    flog("hiddenSections", hiddenSections);
    if (hiddenSections.length > 0) {
        var first = hiddenSections.first();
        flog("hidden", first);
        // Check if required inputs prior to this are completed
        var incompleteInput = null;
        first.prev().find("input.required, select.required, textarea.required").each(function(i, n) {
            var node = $(n);
            var val = node.val().trim();
            if (val == "") {
                incompleteInput = node;
                flog("check input: is incomplete", val, node, incompleteInput);
            } else {
                flog("check input: ok", val, node, incompleteInput);
            }
        });
        if (incompleteInput == null) {
            first.click();
        } else {
            showNextPopup(findIncompleteInputs());
        }
        flog("found hidden sections", hiddenSections);
        return false;
    }

    inp = findIncompleteInputs();
    if (inp.length > 0) {
        flog("found incomplete input", inp)
        showNextPopup(inp);
        return false;
    }
    if (checkNextValidationFunction) {
        if (!checkNextValidationFunction()) {
            flog("checkNextValidationFunction returned false");
            return false;
        }
    }
    return true;
}

function showNextPopup(incompleteInput) {
    var popout = $("div.pages div.popout");
    popout.find("span").html("Please enter <a href='#'>required fields</a>");
    popout.find("span a").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('html, body').animate({
            scrollTop: incompleteInput.first().offset().top
        }, 1000);

    });
    pulseBorder(incompleteInput);

    popout.show(100);

}

function findIncompleteInputs() {
    return $(".panelBox").find("input.required, select.required, textarea.required").not(".no-validate").filter(function(i, n) {
        var val = $(n).val().trim();
        return (val == "");
    });
}

function setLinkEnabled(a, isEnabled) {
    if (isEnabled) {
        a.removeClass("disabled");
        a.addClass("enabled");
    } else {
        a.addClass("disabled");
        a.removeClass("enabled");
    }
}

function initLearningContentStyles() {
    flog("initLearningContentStyles");
    // insert spans so we can use sprites for background images
    //$(".panelBox").find(".dropdown, .btnHideFollowing, .activity, .keyPoint, .lightbulb h6").prepend("<span class='sprite'>&nbsp;</span>");

    var c = currentPageIndex();
    var p = progressPageIndex();
    if (c >= p) {
        flog("show hide following", c, p, $(".btnHideFollowing").nextAll());
        $(".btnHideFollowing").nextAll().hide(); // initially hide everything after it

        $(".btnHideFollowing").click(function() {
            $(this).addClass("expanded");
            var toToggle = $(this).nextUntil(".btnHideFollowing").not(".linked-modal");
            flog("btnHideFollowing: toggle:", toToggle);
            toToggle.show(200);
            // also show the next button, if there is one
            var last = $(toToggle[toToggle.length - 1]);
            last.next().not(".linked-modal").show(); // because toToggle is nextUntil .btnHideFollowing, the next after the last should be a btnHideFollowing, or nothing
            checkProgressPageVisibility();
        });
    } else {
        flog("hide hide following buttons", c, p);
        $(".btnHideFollowing").hide(); // if we're not using continue buttons, hide them
    }

    $("div.dropdown > h3, div.dropdown > h4, div.dropdown > h5,div.dropdown > h6,div.dropdown span.sprite").click(function() {
        var dropDownDiv = $(this).parents("div.dropdown");
        if (dropDownDiv.length > 1) {
            dropDownDiv = $(dropDownDiv[0]);
        }
        //        flog("toggle visibility", $("> div", dropDownDiv));
        $("> div", dropDownDiv).toggle(200, function() {
            flog("set open class", this, $(":visible", $(this)));
            var vis = $(":visible", $(this)).length > 0;
            if (vis) {
                dropDownDiv.addClass("open");
            } else {
                dropDownDiv.removeClass("open");
            }
            refreshIE8Layout(dropDownDiv); // IE8 hack, doesnt refresh its layout
        });
        return false;
    });
    $(".panelBox a").each(function(i, n) {
        var $n = $(n);
        var href = $n.attr("href");
        if (href && href.startsWith("http")) {
            $n.addClass("external");
            $n.attr("target", "_blank");
        }
    });
}

function getMoveHref(count) {
    var i = currentPageIndex();
    //flog("currentPageIndex", i);
    var allLinks = $(".pages a.modPage");
    i = i + count;
    if (i < 0) {
        i = 0;
    }
    if (i >= allLinks.length) {
        //i = allLinks.length-1;
        //flog("getMoveHref: ", count, "moved index", i, "allLinks.length",allLinks.length,"result:", href);
        return "pFinished.html";
    } else {
        var href = $(allLinks[i]).attr("href");
        //flog("getMoveHref: ", count, "moved index", i, "result:", href);
        return href;
    }
}



function setReadonly() {
    //readonly = true;
    flog("setReadOnly");
    $("#submitBtn").attr('disabled', 'disabled');
    $("#submitBtn").hide();
    $("#saveBtn").css("visibility", "hidden");
}

/**
 * A completed quiz is made readonly
 */
function isReadonly() {
    return $("#submitBtn").attr('disabled');
}


function save(callback) {
    flog("save. isCompletable=", isCompletable, "userUrl", userUrl);
    flog("save", "userUrl", userUrl);
    if (userUrl === null) {
        return;
    }

    if (!isCompletable) {
        doRestoreFields();
        return;
    }
    var currentPage = getFileName(window.location.href);
    progressPage = currentPage; // update progress page so we can keep track
    var url = modStatusUrl;
    flog("save. url=", url, "currentPage", currentPage);
    var data = {};
//    $("#body textarea, #body input, #body select").each(function(i, n) {
//        var inp = $(n);
//        var qname = getQualifiedFieldName(inp.attr("name"));
//        data[qname] = inp.val();
//    });
    data["statusCurrentPage"] = currentPage;

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            flog('saved ok', response);
            restoreFields(response);
            if (callback) {
                callback();
            }
        },
        error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            //alert("There was an error saving your progress");
        }
    });
}

function saveFields(callback) {
    var data = {};
    $("#body textarea, #body input, #body select").not(".no-save").each(function(i, n) {
        var inp = $(n);
        var qname = getQualifiedFieldName(inp.attr("name"));
        data[qname] = inp.val();
    });
    flog("saveFields", data);
    var url = modStatusUrl;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            flog('saved ok', response);
            if (callback) {
                callback();
            }
        },
        error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            alert("There was an error saving your fields");
        }
    });
}

function restoreFields(response) {
    flog("restoreFields");
    if (response.data) {
        for (qualifiedFieldName in response.data) {
            var fieldName = stripPageName(qualifiedFieldName);
            var fieldValue = response.data[qualifiedFieldName];
            if (fieldValue !== null) {
                fieldValue = fieldValue.trim();
            }
            var isQualified = false;
            if (fieldName !== qualifiedFieldName) {
                isQualified = true;
            }

            flog("fieldValue", fieldValue, "fieldName", qualifiedFieldName, "from", response.data);
            var inp = $("#body textarea[name='" + fieldName + "'], #body input[type=text][name='" + fieldName + "'], #body select[name='" + fieldName + "']");

            if (!inp.hasClass("qualified-set")) {
                if (isQualified) {
                    inp.addClass("qualified-set");
                }
                if (inp.length > 0) {
                    inp.val(fieldValue);
                } else {
                    var radios = $("#body input[type=radio][name='" + fieldName + "']");
                    if (radios.length > 0) {
                        radios.attr("checked", "");
                        var radio = radios.filter("[value=" + fieldValue + "]");
                        radio.prop("checked", true); // set radio buttons
                    }
                }
            }
        }
    }
    flog("restoreFields: trim text inputs");
    $("textarea").each(function(i, n) {
        var t = $(n);
        var text = t.val().trim();
        t.val(text);
    });
    $("body").trigger("fieldsRestored");
}

/*
 * Called to indicate that the module is complete
 */
function completed() {
    flog("completed", modStatusUrl);
    if (!isCompletable) {
        if (modStatusComplete) {
            var modal = $("#alreadyCompleted");
            if (modal.length === 0) {
                alert("You have reached the end of this module, and you have previously completed it.");
            } else {
                modal.modal();
            }
        } else {
            var modal = $("#cannotComplete");
            flog("modal", modal);
            if (modal.length === 0) {
                alert("You have reached the end of this module.");
            } else {
                modal.modal();
            }

        }
        return;
    }
    //$("div.pages").hide();
    setStatusComplete();
}

function setStatusComplete() {
    ajaxLoadingOn();
    $.ajax({
        type: "POST",
        url: modStatusUrl,
        data: "statusComplete=true",
        success: function(response) {
            ajaxLoadingOff();
            flog("setStatusComplete response", response);
            if (response.status) {
                flog("setStatusComplete completed ok, so show completed message");
                showCompletedMessage();
            } else {
                flog("setStatusComplete returned false", response.fieldMessages[0]);
                if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === "userData") {
                    // show modal prompting for name details
                    jQuery.ajax({
                        type: 'GET',
                        url: "/profile/",
                        success: function(resp) {
                            flog("setStatusComplete: profile get complete");
                            var page = $(resp);
                            var form = page.find("div.details form");
                            form.find("h4").remove();
                            form.find("#firstName").addClass("required");
                            form.find("#surName").addClass("required");
                            form.find("button").hide();
                            form.attr("action", "/profile/");
                            form.forms({
                                callback: function(resp) {
                                    if (resp.status) {
                                        closeModals();
                                        setStatusComplete();
                                    } else {
                                        alert("Sorry, we couldnt update your details, please try again");
                                    }
                                }
                            });
                            var modal = $("#userDataModal");
                            modal.find("button").click(function(e) {
                                flog("submit form", e);
                                e.preventDefault();
                                e.stopPropagation();
                                form.submit();
                            });
                            modal.find(".modal-body").html(form);
                            flog("got profile page", resp);
                            showModal(modal);

                        },
                        error: function(resp) {
                            ajaxLoadingOff();
                            flog("setStatusComplete: profile get failed");
                            alert("Very sorry, but something went wrong while attempting to complete your module. Could you please refresh the page and try again?");

                        }
                    });
                } else {
                    ajaxLoadingOff();
                    alert("Sorry, for some reason we couldnt mark your module as being complete. Maybe you could try again, or contact the site administrator for help");
                }
            }
        },
        error: function(response) {
            ajaxLoadingOff();
            alert("Error!", "There was an error saving your progress. Please try again and if you still have problems contact the site administrator");
        }
    });
}

function showCompletedMessage() {
    flog("showCompletedMessage");
    jQuery.ajax({
        type: 'GET',
        url: "./?completeMessage",
        success: function(resp) {
            var page = $(resp);
            var modal = page.find("#finishedModal");
            $("body").append(modal);
            showModal(modal);
        },
        error: function(resp) {
            alert("Your module has been completed successfully, but there was a problem displaying the congratulations message.");
            window.location = "/dashboard";
        }
    });
}

function currentPageIndex() {
    var pages = $(".pages a.modPage");
    //flog("pages", pages, "active=", pages.filter(".active") );
    var current = pages.filter(".active").attr("href");
    var currentIndex = 0;
    var all = pages;
    currentIndex = all.length - 1; // default to finish, in case not found
    all.each(function(index) {
        if ($(this).attr("href") === current) {
            currentIndex = index;
        }
    });
    //flog("currentPageIndex: current=", current, "pages=", pages, "result=", currentIndex);
    return currentIndex;
}

function progressPageIndex() {
    var pages = $(".pages a.modPage");
    var currentPageLink = pages.find("a[href='" + progressPage + "']");
    var current = currentPageLink.attr("href");
    var currentIndex = 0;
    var all = pages;
    all.each(function(index) {
        if ($(this).attr("href") === current) {
            currentIndex = index;
        }
    });
    return currentIndex;
}

/**
 *Returns teh current page object
 */
function getCurrentPage() {
    return pagesArray[currentPageIndex()];
}

function numberOfPages() {
    var all = $(".pages a.modPage");
    return all.length;
}

function isLastPage() {
    var p = currentPageIndex();
    var b = p >= (numberOfPages() - 1);
    flog("isLastPage. currentPageIndex=", p, "num pages=", numberOfPages(), "result=", b)
    return b;
}

function initMedia() {

}

function saveField(fieldName, fieldValue, statUrl) {
    flog("saveField", fieldName, fieldValue, statUrl, userUrl)
    if (userUrl === null || userUrl === "") {
        flog("No current user, so dont save");
        return;
    }
    if (!fieldName) {
        fieldName = getFileName(window.location.pathname);
    }
    var qualifiedFieldName = getQualifiedFieldName(fieldName);
    $.ajax({
        type: "POST",
        url: statUrl,
        data: {
            changedField: qualifiedFieldName,
            changedValue: fieldValue
        },
        success: function(response) {
            flog('saved ok', response);
        },
        error: function(response) {
            flog('error saving moduleStatus', response);
        }
    });
}

function getQualifiedFieldName(fieldName) {
    var qualifiedFieldName = getFileName(window.location.pathname);
    qualifiedFieldName = qualifiedFieldName.replace(".html", "");
    qualifiedFieldName += "_";
    qualifiedFieldName += fieldName;
    return qualifiedFieldName;
}

function stripPageName(qualifiedFieldName) {
    if (qualifiedFieldName.contains("_")) {
        var i = qualifiedFieldName.indexOf("_");
        var n = qualifiedFieldName.substring(i + 1, qualifiedFieldName.length);
        flog("stripPageName", i, n);
        return n;
    } else {
        return qualifiedFieldName;
    }
}

function initModalLinks() {
    flog("init modal popups");
    $('div.linked-modal').each(function() {
        $(this).append('<a href="#" title="Close" class="close-modal">Close</a>')
    });
    $("body").on("click", "a.anchor-modal", function(e) {
        e.preventDefault();
        var target = $(e.target);
        var id = target.attr("href");
        var title = target.text();
        if (title.length > 50) {
            title = title.substring(0, 50);
        }
        var div = $(id);
        div.removeClass("linked-modal");
        div.css("width", "");
        div.css("height", "");
        showModal(div, title);
    });

    $('a.close-modal').click(function(e) {
        flog("close modals");
        e.preventDefault();
        closeModals();
    });
}

/**
 * Called when the user clicks next, checks to see if there is a quiz on the page
 * , and if so it is checked for correctness
 *
 * Also checks to see if this is the last page, in which case a finished dialog is
 * displayed
 */
function checkSubmit(e) {
    var vis = $(".nextBtn:visible");
    flog("checkSubmit", e, vis);
    if (vis.length === 0) {
        flog("already processing");
        return;
    }
    if (!isQuizComplete(e)) { // there might not be a quiz, which is ok
        flog("Quiz is not complete (bs320)");
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    if (isLastPage()) {
        e.preventDefault();
        e.stopPropagation();
        completed();
        //alert("is last page, should complete");
    }
// all good, carry on with event processing
}

/**
 * returns true if the quiz is complete, otherwise displays appropriate validation
 * messages
 */
function isQuizComplete(e) {
    var quiz = $("form.quiz");
    flog("isQuizComplete", quiz);
    if (quiz.length === 0) {
        flog("Quiz is empty, so is complete");
        return true;
    }
    if (quiz.hasClass("validated")) {
        flog("Quiz has been validated, so is complete");
        return true;
    }
    if (!isCompletable) {
        flog("Module is complete, so true");
        return true;
    }
    var isBeyondQuiz = progressPageIndex() > currentPageIndex();
    if (isBeyondQuiz) {
        flog("is beyond quiz, so quiz is complete");
        return true;
    }

    // Clear any previous errors
    var errors = quiz.find(".error");
    flog("isQuizComplete: remove prev errors", errors);
    errors.removeClass("error");

    // Check all questions have been answered
    var hasError = false;
    quiz.find("ol.quiz > li").each(function(i, n) {
        var li = $(n);
        var inp = li.find("textarea, input:radio:checked");
        if (inp.length === 0) {
            hasError = true;
            flog("found incomplete input", li);
            li.addClass("error");
        } else {
            var val = inp.val() + "";
            val = val.trim();
            if (val.length === 0) {
                hasError = true;
                flog("found incomplete input", li);
                li.addClass("error");
            }
        }
    });
    if (hasError) {
        alert("Please answer all of the questions");
        return false;
    }

    if (quiz.hasClass("processing")) {
        flog("Quiz check is in progress");
        return false;
    }

    quiz.addClass("processing");

    // Check the quiz against the database
    var pageName = getFileName(window.location.pathname);
    quiz.find("input[name=quiz]").val(pageName);
    try {
        flog("no, doing quiz check");
        $.ajax({
            type: "POST",
            url: modStatusUrl,
            data: quiz.serialize(),
            dataType: "json",
            success: function(response) {
                quiz.removeClass("processing");
                if (response.status) {
                    flog('quiz validated ok', response);
                    quiz.addClass("validated");
                    $(e.target).click();
                } else {
                    flog('quiz validated returned false', response);
                    if( response.data && response.data.nextQuizBatch ) {
                        quiz.find("ol.quiz").replaceWith(response.data.nextQuizBatch);
                        tidyUpQuiz();
                    } else {
                        alert("Please check your answers");
                        $.each(response.fieldMessages, function(i, n) {
                            var inp = quiz.find("li." + n.field);
                            inp.addClass("error");
                        });
                    }
                }
            },
            error: function(response) {
                quiz.removeClass("processing");
                flog("isQuizComplete error response", response);
                showApology("check your answers");
            }
        });
    } catch (e) {
        flog("exception in isQuizComplete", e);
        showApology("check your answers");
    }
    return false;
}

function showApology(operation) {
    alert("Oh, oops. I'm really, really, sorry, but I couldnt " + operation + " because of some computer-not-behaving thing. Perhaps check your internet connection? If it still doesnt work it would be super nice if you could tell us from the contact page and we'll sort it out ASAP - thanks!");
}
