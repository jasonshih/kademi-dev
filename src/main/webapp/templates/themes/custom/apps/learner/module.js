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
        //initLearningContentStyles();
        initComments(pStatUrl);
    }

}


function initModuleNav(pStatUrl, pFinished) {
    log("initModuleNav");
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
            log("preventing click on disabled link", a);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    });
    log("setup pjax", $('.pages a'));
    $(document).pjax2('.panelBox', {
        selector: ".pages a",
        fragment: ".panelBox",
        success: function() {
            log("done!");
            initPrintLink(); // called by init-theme
            initPageNav();
        }
    });
}

function initPageNav() {
    prettyPrint();
    initPseudoClasses();
    $(".pages a")
            .removeClass("active")
            .closest("li").removeClass("active");

    var pageName = getFileName(window.location.pathname);
    pageName = pageName.replaceAll(" ", "%20");
    pageName = decodeURI(pageName);
    log("initPageNav", pageName);
    $(".pages li a.modPage").each(function(i, n) {
        var node = $(n);
        var link = decodeURI(node.attr("href"));
        if (link == pageName) {
            log("initPageNav-found", pageName, link);
            $(n).addClass("active");
            $(n).closest("li").addClass("active");
        } else {
            log("initPageNav-notfound", pageName, link);
        }
    });

    // Hack: Need to hide quiz elements which have quiz editor help text
    $("ol.quiz li p").each(function(i, n) {
        var node = $(n);
        var text = node.text();
        if (text.startsWith("[")) {
            node.hide();
        }
    });

    initLearningContentStyles();
    initModalLinks();

    //$("table.classifier").classifier();
    //
    // set active on current page nav
    log("initPageNav. modStatusComplete=", modStatusComplete, "userurl", userUrl);

    $('html, body').animate({
        scrollTop: 0
    }, 'slow');

    initJPlayer("360", "640", "jp-video-360p");

    $(".prevBtn").attr("href", getMoveHref(-1));
    $(".nextBtn").attr("href", getMoveHref(1));

    if (modStatusComplete) {
        log("initPageNav: module is complete so do nothing");
    } else {
        var c = currentPageIndex();
        var p = progressPageIndex();
        if (!p || c > p) { // only save current page if it is the furthest yet visited
            log("do save progress");
            window.setTimeout(function() {
                save();
            }, 1000);
        } else {
            log("not doing save, so explicitly reload fields...", modStatusUrl);
            doRestoreFields();
        }
    }
    checkProgressPageVisibility();
    // Setup event to save any changes on the fly
    log("init field saving", $("#body textarea, #body input, #body select"));
    $("#body textarea, #body input, #body select").change(function(e) {
        log("changed field", e.target);
        var field = $(e.target);
        saveField(field.attr("name"), field.val(), modStatusUrl);
    });

    // Need to delay, because this script might be running before other scripts
    // have had time to register for the event
    window.setTimeout(function() {
        log("fire modulePageLoad event");
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
            log('error restoring fields', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });    
}

/**
 * Called on page load and expand events, checks to see what progress navigation 
 * elements should be enabled
 */
function checkProgressPageVisibility() {
    log("checkProgressPageVisibility");
    var hiddenSections = $(".btnHideFollowing").not(".expanded");
    var hasHidden = hiddenSections.length > 0;
    if (currentPageIndex() < progressPageIndex()) {
        $(".pages a.nextBtn").show();
    }

    var isInputsDone = true;
    // has the user already progressed beyond this page?
    var isBeyondCurrent = progressPageIndex() > currentPageIndex();
    log("isBeyondCurrent:", progressPageIndex(), currentPageIndex())
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
        log("Not a quiz page, so check if fields completed... = ", isInputsDone);
    }

    // Page nav button is enabled if its index is <= progress page index, or all btnHideFollowing have expanded class and its index = current+1 and current page=progress page
    var p = progressPageIndex();
    var c = currentPageIndex();
    // if for some reason progress page is less then current page, then make progress page the current page
    if (p < c) {
        p = c;
    }

    var pagesList = $("ul.pages");
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
        //log("is enabled?", a, i, p, c,isInputsDone,isCompletable, "=", enabled);
        setLinkEnabled(a, enabled);
    });

    var nextEnabled;
    log("modStatusComplete", modStatusComplete, "isBeyondCurrent", isBeyondCurrent, "isLastPage())", isLastPage());
    if (!isCompletable) {
        // For a non-completable enrolement we allow users to view any page in any order
        nextEnabled = true;
    } else if (!modStatusComplete && !isBeyondCurrent && (quiz.length > 0 || isLastPage())) {
        $("a.nextBtn span").text("Submit");
        nextEnabled = true;
    } else {
        $("a.nextBtn span").text("Next");
        var nextLink = $("ul.pages a.active.modPage").parent().next().find("a");
        // if there's a hidden section, clicking next will show it
        // If inputs are not complete, still show next so they user can click it to get validation
        nextEnabled = nextLink.hasClass("enabled") || hasHidden || !isInputsDone;
        log("nextEnabled", nextEnabled, nextLink)
    }

    setLinkEnabled($(".pages a.nextBtn"), nextEnabled);
}


// Set this on page load to call custom validation logic on next
var checkNextValidationFunction = null;

function checkNext() {
    log("checkNext");
    var popout = $("div.pages div.popout");
    popout.hide();
    var hiddenSections = $(".btnHideFollowing").not(".expanded").filter(":visible");
    log("hiddenSections", hiddenSections);
    if (hiddenSections.length > 0) {
        var first = hiddenSections.first();
        log("hidden", first);
        // Check if required inputs prior to this are completed
        var incompleteInput = null;
        first.prev().find("input.required, select.required, textarea.required").each(function(i, n) {
            var node = $(n);
            var val = node.val().trim();
            if (val == "") {
                incompleteInput = node;
                log("check input: is incomplete", val, node, incompleteInput);
            } else {
                log("check input: ok", val, node, incompleteInput);
            }
        });
        if (incompleteInput == null) {
            first.click();
        } else {
            showNextPopup(findIncompleteInputs());
        }
        log("found hidden sections", hiddenSections);
        return false;
    }

    inp = findIncompleteInputs();
    if (inp.length > 0) {
        log("found incomplete input", inp)
        showNextPopup(inp);
        return false;
    }
	if( checkNextValidationFunction ) {
		if( !checkNextValidationFunction() ) {
			log("checkNextValidationFunction returned false");
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
    log("initLearningContentStyles");
    // insert spans so we can use sprites for background images
    $(".panelBox").find(".dropdown, .btnHideFollowing, .activity, .keyPoint, .lightbulb h6").prepend("<span class='sprite'>&nbsp;</span>");

    var c = currentPageIndex();
    var p = progressPageIndex();
    if (c >= p) {
        //        log("show hide following", c, p);
        $(".btnHideFollowing").nextAll().hide(); // initially hide everything after it

        $(".btnHideFollowing").click(function() {
            $(this).addClass("expanded");
            var toToggle = $(this).nextUntil(".btnHideFollowing").not(".linked-modal");
            log("btnHideFollowing: toggle:", toToggle);
            toToggle.show(200);
            // also show the next button, if there is one
            var last = $(toToggle[toToggle.length - 1]);
            last.next().not(".linked-modal").show(); // because toToggle is nextUntil .btnHideFollowing, the next after the last should be a btnHideFollowing, or nothing
            checkProgressPageVisibility();
        });
    } else {
        //        log("hide hide following buttons", c, p);
        $(".btnHideFollowing").hide(); // if we're not using continue buttons, hide them
    }

    $("div.dropdown > h3, div.dropdown > h4, div.dropdown > h5,div.dropdown > h6,div.dropdown span.sprite").click(function() {
        var dropDownDiv = $(this).parents("div.dropdown");
        if (dropDownDiv.length > 1) {
            dropDownDiv = $(dropDownDiv[0]);
        }
        //        log("toggle visibility", $("> div", dropDownDiv));
        $("> div", dropDownDiv).toggle(200, function() {
            log("set open class", this, $(":visible", $(this)));
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
    //log("currentPageIndex", i);
    var allLinks = $("ul.pages a.modPage");
    i = i + count;
    if (i < 0) {
        i = 0;
    }
    if (i >= allLinks.length) {
        //i = allLinks.length-1;
        //log("getMoveHref: ", count, "moved index", i, "allLinks.length",allLinks.length,"result:", href);
        return "pFinished.html";
    } else {
        var href = $(allLinks[i]).attr("href");
        //log("getMoveHref: ", count, "moved index", i, "result:", href);
        return href;
    }
}



function setReadonly() {
    //readonly = true;
    log("setReadOnly");
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
    log("save. isCompletable=", isCompletable, "userUrl", userUrl);
    log("save", "userUrl", userUrl);
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
    log("save. url=", url, "currentPage", currentPage); 
    var data = {};
    $("#body textarea, #body input, #body select").each(function(i, n) {
        var inp = $(n);
        data[inp.attr("name")] = inp.val();
    });
    data["statusCurrentPage"] = currentPage;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            log('saved ok', response);
            restoreFields(response);
            if (callback) {
                callback();
            }
        },
        error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
            log('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            //alert("There was an error saving your progress");
        }
    });
}

function saveFields(callback) {
    var data = {};
    $("#body textarea, #body input, #body select").not(".no-save").each(function(i, n) {
        var inp = $(n);
        data[inp.attr("name")] = inp.val();
    });
    log("saveFields", data);
    var url = modStatusUrl;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            log('saved ok', response);
            if (callback) {
                callback();
            }
        },
        error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
            log('error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
            alert("There was an error saving your fields");
        }
    });    
}

function restoreFields(response) {
    log("restoreFields");
    if (response.data) {
        for (qualifiedFieldName in response.data) {
            var fieldName = stripPageName(qualifiedFieldName);
            var fieldValue = response.data[qualifiedFieldName];
            log("fieldValue", fieldValue, "fieldName", qualifiedFieldName, "from", response.data);
            var inp = $("#body textarea[name='" + fieldName + "'], #body input[type=text][name='" + fieldName + "'], #body select[name='" + fieldName + "']");

            log("restoreFields: look for text input", fieldName, fieldValue, inp);
            if (inp.length > 0) {
                inp.val(fieldValue);
            } else {                
                var radios = $("#body input[type=radio][name='" + fieldName + "']");
                log("didnt find text input, look for radios...", radios, "with value", fieldValue);
                if (radios.length > 0) {
                    radios.attr("checked", "");
                    var radio = radios.filter("[value=" + fieldValue + "]");
                    log("select radio", radio, fieldValue);
                    radio.attr("checked", "true"); // set radio buttons
                    log("check radio");
                }
            }
        }
    }
    log("restoreFields: trim text inputs");
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
    log("completed", modStatusUrl);
    if (!isCompletable) {
        if (modStatusComplete) {
            alert("You have reached the end of this module, and you have previously completed it.");
        } else {
            alert("You have reached the end of this module.");
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
            log("setStatusComplete response", response);
            if (response.status) {
                log("setStatusComplete completed ok, so show completed message");
                showCompletedMessage();
            } else {
                log("setStatusComplete returned false", response.fieldMessages[0]);
                if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === "userData") {
                    // show modal prompting for name details
                    jQuery.ajax({
                        type: 'GET',
                        url: "/profile/",
                        success: function(resp) {
                            log("setStatusComplete: profile get complete");
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
                                log("submit form", e);
                                e.preventDefault();
                                e.stopPropagation();
                                form.submit();
                            });
                            modal.find(".modal-body").html(form);
                            log("got profile page", resp);
                            showModal(modal);

                        },
                        error: function(resp) {
                            ajaxLoadingOff();
                            log("setStatusComplete: profile get failed");
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
    log("showCompletedMessage");
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
    var current = $("ul.pages a.active").attr("href");
    var currentIndex = 0;
    var all = $("ul.pages a.modPage");
    currentIndex = all.length - 1; // default to finish, in case not found
    all.each(function(index) {
        if ($(this).attr("href") == current) {
            currentIndex = index;
        }
    });
    //log("currentIndex", currentIndex, "index=", current);
    return currentIndex;
}

function progressPageIndex() {
    var currentPageLink = $("ul.pages a[href='" + progressPage + "']");
    var current = currentPageLink.attr("href");
    var currentIndex = 0;
    var all = $("ul.pages a.modPage");
    all.each(function(index) {
        if ($(this).attr("href") == current) {
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
    var all = $("ul.pages a.modPage");
    return all.length;
}

function isLastPage() {
    var p = currentPageIndex();
    var b = p >= (numberOfPages() - 1);
    log("isLastPage", p, numberOfPages(), b)
    return b;
}

function initMedia() {

}

function saveField(fieldName, fieldValue, statUrl) {
    log("saveField", fieldName, fieldValue, statUrl, userUrl)
    if (userUrl == null || userUrl === "") {
        log("No current user, so dont save");
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
            log('saved ok', response);
        },
        error: function(response) {
            log('error saving moduleStatus', response);
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
        log("stripPageName", i, n);
        return n;
    } else {
        return qualifiedFieldName;
    }
}

function initModalLinks() {
    log("init modal popups");
    $('div.linked-modal').each(function() {
        $(this).append('<a href="#" title="Close" class="close-modal">Close</a>')
    });
    $("body").on("click", "a.anchor-modal", function(e) {
        e.preventDefault();
        var id = $(e.target).attr("href");
        var div = $(id);
        showModal(div);
    });

//    $('a.anchor-modal').tinybox({
//        opacity: 0
//    });

    $('a.close-modal').click(function(e) {
        log("close modals");
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
    log("checkSubmit", e, vis);
    if (vis.length === 0) {
        log("already processing");
        return;
    }
    if (!isQuizComplete(e)) { // there might not be a quiz, which is ok
        log("Quiz is not complete");
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
    log("isQuizComplete", quiz);
    if (quiz.length === 0) {
        log("Quiz is empty, so is complete");
        return true;
    }
    if (quiz.hasClass("validated")) {
        log("Quiz has been validated, so is complete");
        return true;
    }
    var isBeyondQuiz = progressPageIndex() > currentPageIndex();
    if (isBeyondQuiz) {
        log("is beyond quiz, so quiz is complete");
        return true;
    }

    // Clear any previous errors
    var errors = quiz.find(".error");
    log("isQuizComplete: remove prev errors", errors);
    errors.removeClass("error");

    // Check all questions have been answered
    var hasError = false;
    quiz.find("ol.quiz > li").each(function(i, n) {
        var li = $(n);
        var inp = li.find("textarea, input:radio:checked");
        if (inp.length === 0) {
            hasError = true;
            log("found incomplete input", li);
            li.addClass("error");
        } else {
            var val = inp.val() + "";
            val = val.trim();
            if (val.length === 0) {
                hasError = true;
                log("found incomplete input", li);
                li.addClass("error");
            }
        }
    });
    if (hasError) {
        return false;
    }

    if (quiz.hasClass("processing")) {
        log("Quiz check is in progress");
        return false;
    }

    quiz.addClass("processing");

    // Check the quiz against the database        
    var pageName = getFileName(window.location.pathname);
    quiz.find("input[name=quiz]").val(pageName);
    try {
        log("no, doing quiz check");
        $.ajax({
            type: "POST",
            url: modStatusUrl,
            data: quiz.serialize(),
            dataType: "json",
            success: function(response) {
                quiz.removeClass("processing");
                if (response.status) {
                    log('quiz validated ok', response);
                    quiz.addClass("validated");
                    $(e.target).click();
                    //                    if( isLastPage() ) {        
                    //                        completed();
                    //                    } else {
                    //                        log("re-click next");
                    //                        $(e.target).click();
                    //                    }
                } else {
                    log('quiz validated returned false', response);
                    alert("Please check your answers");
                    $.each(response.fieldMessages, function(i, n) {
                        var inp = quiz.find("li." + n.field);
                        inp.addClass("error");
                    });
                }
            },
            error: function(response) {
                quiz.removeClass("processing");
                log("isQuizComplete error response", response);
                showApology("check your answers");
            }
        });
    } catch (e) {
        log("exception in isQuizComplete", e);
        showApology("check your answers");
    }
    return false;
}

function showApology(operation) {
    alert("Oh, oops. I'm really, really, sorry, but I couldnt " + operation + " because of some computer-not-behaving thing. Perhaps check your internet connection? If it still doesnt work it would be super nice if you could tell us from the contact page and we'll sort it out ASAP - thanks!");
}