var progressPage; // the most advanced page the user has yet visited, set by inline script in the page
var modStatusUrl;
var modStatusComplete;
var isCompletable;

function initModulePage(pStatUrl, pFinished, pEditMode, pIsCompletable) {
    flog('initModulePage', pStatUrl, pFinished, pEditMode, pIsCompletable);

    isCompletable = pIsCompletable && !pFinished;

    if (pEditMode) {
        edifyPage('.contentForm');
    } else {
        initModuleNav(pStatUrl, pFinished);
        initLearningContentStyles();
        initComments(pStatUrl);
    }

    var userAgent = navigator.userAgent.toLowerCase();
    var isDesktop = !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)));
    flog('Is desktop: ' + isDesktop, 'User-Agent: ' + userAgent);

    if (!isDesktop) {
        $.getScriptOnce('/static/touchSwipe/1.6.5/jquery.touchSwipe.js', function () {

            flog('Initialize swiping');
            $('.module-container').swipe({
                swipeLeft: function () {
                    $('.nextBtn').click();
                },
                swipeRight: function () {
                    $('.prevBtn').click();
                }
            });
        });
    }

    initModuleSearch();
}


function initModuleNav(pStatUrl, pFinished) {
    flog('initModuleNav', pStatUrl, pFinished);

    modStatusUrl = pStatUrl;
    modStatusComplete = pFinished;

    initPageNav();

    // This needs to be just done once, not on each pjax transition
    $(document.body).on('click', '.nextBtn', function (e) {
        flog('Clicked on .nextBtn');

        if (!checkNext()) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        checkSubmit(e);
    });

    var pageLinks = $('.pages a').not('.nextBtn');
    pageLinks.click(function (e) {
        var a = $(this);

        if (a.hasClass('disabled')) {
            flog('Preventing click on disabled link', a);

            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        var currentIndex = getCurrentPageIndex();
        var clickedIndex = a.index();
        if (clickedIndex > currentIndex) {
            if (!checkNext()) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        checkSubmit(e, true);
    });

    flog('Setup pjax', pageLinks);
    $(document).pjax2('.panelBox', {
        selector: '.pages a',
        fragment: '.panelBox',
        success: function () {
            flog('Pjax success!');

            initPrintLink(); // called by init-theme
            initPageNav();
        },
        debug: true
    });
}

function tidyUpQuiz() {
    // Hack: Need to hide quiz elements which have quiz editor help text
    $('ol.quiz li p').each(function (i, n) {
        var node = $(n);
        var text = node.text();
        if (text.startsWith('[')) {
            node.hide();
        }
    });
}

function initPageNav() {
    flog('initPageNav');
//    prettyPrint(); // TODO: hook up seperately

    var pageName = getFileName(window.location.pathname);
    pageName = pageName.replaceAll(' ', '%20');
    pageName = decodeURI(pageName);
    flog('initPageNav | Page name: ' + pageName);

    var pagesLinks = $('.pages a');
    pagesLinks.removeClass('active').closest('li').removeClass('active');
    pagesLinks.filter('.modPage').each(function (i, n) {
        var modLink = $(this);
        var href = decodeURI(modLink.attr('href'));

        if (href === pageName) {
            modLink.addClass('active').closest('li').addClass('active');
        }
    });

    tidyUpQuiz();

    var progressPageIndex = getProgressPageIndex();
    var currentPageIndex = getCurrentPageIndex();
    var isQuizPassed = $('.quiz.quiz-passed').length > 0;

    var isBeyondCurrent = (progressPageIndex > currentPageIndex) || isQuizPassed;
    if (isBeyondCurrent) {
        flog('Show .when-complete');

        $('ol.quiz input').prop('disabled', true);
        $('.when-complete').show();
        $('.when-not-complete').hide();
    } else {
        if (isCompletable) {
            flog('Show .when-not-complete');

            $('.when-complete').hide();
            $('.when-not-complete').show();
        } else {
            $('.when-complete').hide();
            $('.when-not-complete').hide();
        }
    }

    initLearningContentStyles();
    initModalLinks();

    flog('initPageNav | modStatusComplete: ' + modStatusComplete + ', userUrl: ', userUrl);

    var prevUrl = getMoveHref(-1);
    flog('initPageNav | prevUrl: ' + prevUrl);
    $('.prevBtn').attr('href', prevUrl);

    var nextUrl = getMoveHref(1);
    flog('initPageNav | nextUrl: ' + nextUrl);
    $('.nextBtn').attr('href', nextUrl);

    if (modStatusComplete) {
        flog('initPageNav | Module is completedm so do nothing');
    } else {
        if (!progressPageIndex || currentPageIndex > progressPageIndex) {
            // Only save current page if it is the furthest yet visited
            window.setTimeout(function () {
                flog('Do save progress because we changed page');
                save();
            }, 500);
        } else {
            flog('Not doing save, so explicitly reload fields...', modStatusUrl);
            doRestoreFields();
        }
    }
    checkProgressPageVisibility();

    // Setup event to save any changes on the fly
    var formFields = $('#body').find('textarea, input, select');
    flog('Initialize field saving', formFields);
    formFields.change(function (e) {
        var field = $(this);
        flog('changed field', field);

        saveField(field.attr('name'), field.val(), modStatusUrl);
    });

    // Need to delay, because this script might be running before other scripts
    // have had time to register for the event
    window.setTimeout(function () {
        flog('Fire modulePageLoad event');

        $('body').trigger('modulePageLoad');
    }, 50);

    $('html, body').animate({
        scrollTop: 0
    }, 'slow');
}

function doRestoreFields() {
    $.ajax({
        type: 'GET',
        url: modStatusUrl + '?fields',
        dataType: 'json',
        success: function (response) {
            restoreFields(response);
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('error restoring fields', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });
}

/**
 * Called on page load and expand events, checks to see what progress navigation
 * elements should be enabled
 */
function checkProgressPageVisibility() {
    flog('checkProgressPageVisibility');

    var pagesList = $('.pages');
    var hiddenSections = $('.btnHideFollowing').not('.expanded');
    var hasHidden = hiddenSections.length > 0;
    var progressPageIndex = getProgressPageIndex();
    var currentPageIndex = getCurrentPageIndex();

    if (progressPageIndex < currentPageIndex) {
        pagesList.find('a.nextBtn').show();
    }

    var isInputsDone = true;
    var isQuizPassed = $('.quiz.quiz-passed').length > 0;
    var isBeyondCurrent = (progressPageIndex > currentPageIndex) || isQuizPassed;
    flog('isBeyondCurrent: ' + isBeyondCurrent);

    var onQuiz = false; // figure out if user is on a quiz page
    var quiz = $('ol.quiz');
    if (quiz.length > 0) {
        if (isBeyondCurrent) {
            var inputs = quiz.find('input, select, textarea');
            inputs.prop('readonly', 'true').prop('disabled', 'true');
            $('.submitQuiz').hide();
        } else {
            onQuiz = true; // use is on a quiz page
        }
    } else {
        isInputsDone = (findIncompleteInputs().length === 0);
        flog('Not a quiz page, so check if fields completed... = ', isInputsDone);
    }

    // Page nav button is enabled if its index is <= progress page index, or all btnHideFollowing have expanded class and its index = current+1 and current page=progress page
    // if for some reason progress page is less then current page, then make progress page the current page
    if (progressPageIndex < currentPageIndex) {
        progressPageIndex = currentPageIndex;
    }

    var pages = pagesList.find('a.modPage');
    pages.find('li').removeClass('limit-lower').removeClass('limit-upper').removeClass('limit');
    pages.first().closest('li').addClass('limit-end');
    pages.last().closest('li').addClass('limit-end');
    pages.each(function (i) {
        var modeLink = $(this);
        var away = Math.abs(currentPageIndex - i);
        var limited = away;
        if (away > 10) {
            limited = 10;
        }
        var li = modeLink.closest('li');
        $.each(li.classes(), function (i, n) {
            if (n.startsWith('away')) {
                li.removeClass(n);
            }
        });
        li.addClass('away-' + away).addClass('away-limited-' + limited);

        var enabled = i <= progressPageIndex || i == currentPageIndex || (i == (currentPageIndex + 1) && isInputsDone && !hasHidden);
        enabled = enabled || !isCompletable; // all links enabled for view only (non completable) enrolments
        setLinkEnabled(modeLink, enabled);
    });

    var nextEnabled;
    var lastPage = isLastPage();
    flog('modStatusComplete: ' + modStatusComplete, 'isBeyondCurrent ' + isBeyondCurrent, 'isLastPage: ' + lastPage);

    if (!isCompletable) {
        // For a non-completable enrolement we allow users to view any page in any order
        nextEnabled = true;
    } else if (!modStatusComplete && !isBeyondCurrent && (quiz.length > 0 || lastPage)) {
        $('a.nextBtn span').text('Submit');
        nextEnabled = true;
    } else {
        $('a.nextBtn span').text('Next');
        var nextLink = pages.filter('.active').next();

        // if there's a hidden section, clicking next will show it
        // If inputs are not complete, still show next so they user can click it to get validation
        nextEnabled = nextLink.hasClass('enabled') || hasHidden || !isInputsDone;

        flog('nextEnabled: ' + nextEnabled, 'nextLink: ' + nextLink, 'hasHidden: ' + hasHidden, 'isInputsDone: ' + isInputsDone);
    }

    setLinkEnabled(pagesList.find('a.nextBtn'), nextEnabled);
}


// Set this on page load to call custom validation logic on next
var checkNextValidationFunction = null;

function checkNext() {
    flog('checkNext');

    var popout = $('div.pages div.popout');
    popout.hide();

    var incompleteInputs = findIncompleteInputs();

    var hiddenSections = $('.btnHideFollowing').not('.expanded').filter(':visible');
    flog('hiddenSections', hiddenSections);

    if (hiddenSections.length > 0) {
        var first = hiddenSections.first();
        flog('First hidden section', first);

        // Check if required inputs prior to this are completed
        var incompleteInput = null;
        first.prev().find('input.required, select.required, textarea.required').each(function () {
            var node = $(this);
            var val = node.val().trim();

            if (val == '') {
                incompleteInput = node;
                flog('Check input: is incomplete', val, node, incompleteInput);
            } else {
                flog('Check input: ok', val, node, incompleteInput);
            }

        });
        if (incompleteInput == null) {
            first.click();
        } else {
            showNextPopup(incompleteInputs);
        }

        flog('Found hidden sections', hiddenSections);
        return false;
    }

    if (incompleteInputs.length > 0) {
        flog('Found incomplete input', incompleteInputs);
        showNextPopup(incompleteInputs);

        return false;
    }

    if (checkNextValidationFunction) {
        if (!checkNextValidationFunction()) {
            flog('checkNextValidationFunction returned false');
            return false;
        }
    }

    return true;
}

function showNextPopup(incompleteInput) {
    var popout = $('div.pages div.popout');
    var popoutSpan = popout.find('span');
    popoutSpan.html('Please enter <a href="#">required fields</a>');
    popoutSpan.find('a').click(function (e) {
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
    return $('.panelBox').find('input.required, select.required, textarea.required').not('.no-validate').filter(function () {
        var val = $(this).val().trim();
        return (val == '');
    });
}

function setLinkEnabled(a, isEnabled) {
    if (isEnabled) {
        a.removeClass('disabled');
        a.addClass('enabled');
    } else {
        a.addClass('disabled');
        a.removeClass('enabled');
    }
}

function initLearningContentStyles() {
    flog('initLearningContentStyles');

    var currentPageIndex = getCurrentPageIndex();
    var progressPageIndex = getProgressPageIndex();
    flog('currentPageIndex: ' + currentPageIndex, 'progressPageIndex: ' + progressPageIndex);
    var btnHideFollowing = $('.btnHideFollowing');

    if (currentPageIndex >= progressPageIndex) {
        var afterBtnHideFollowing = $('.btnHideFollowing').nextAll();
        flog('Show .btnHideFollowing', afterBtnHideFollowing);
        afterBtnHideFollowing.hide(); // initially hide everything after it

        btnHideFollowing.click(function () {
            btnHideFollowing.addClass('expanded');
            var toToggle = btnHideFollowing.nextUntil('.btnHideFollowing').not('.linked-modal');
            flog('btnHideFollowing: toggle:', toToggle);
            toToggle.show(200);

            // also show the next button, if there is one
            var last = toToggle.last();
            last.next().not('.linked-modal').show(); // because toToggle is nextUntil .btnHideFollowing, the next after the last should be a btnHideFollowing, or nothing

            checkProgressPageVisibility();
        });
    } else {
        flog('Hide .btnHideFollowing');
        btnHideFollowing.hide(); // if we're not using continue buttons, hide them
    }

    $('div.dropdown').children('h3, h4, h5, h6, span.sprite').click(function (e) {
        e.preventDefault();

        var dropDownDiv = $(this).closest('div.dropdown');
        dropDownDiv.children('div').toggle(200, function () {
            var div = $(this);
            var visibleEls = div.find(':visible');

            flog('Set open class', div, visibleEls);

            if (visibleEls.length > 0) {
                dropDownDiv.addClass('open');
            } else {
                dropDownDiv.removeClass('open');
            }

            refreshIE8Layout(dropDownDiv); // IE8 hack, doesnt refresh its layout
        });
    });

    $('.panelBox a').each(function () {
        var a = $(this);
        var href = a.attr('href');

        if (href && href.startsWith('http')) {
            a.addClass('external');
            a.attr('target', '_blank');
        }
    });
}

function getMoveHref(count) {
    var currentPageIndex = getCurrentPageIndex();
    var allLinks = $('.pages a.modPage');
    currentPageIndex = currentPageIndex + count;
    if (currentPageIndex < 0) {
        currentPageIndex = 0;
    }

    if (currentPageIndex >= allLinks.length) {
        return 'pFinished.html';
    } else {
        var href = $(allLinks[currentPageIndex]).attr('href');
        return href;
    }
}

function save(callback) {
    flog('save | isCompletable: ' + isCompletable + ', userUrl: ' + userUrl);

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
    flog('save | url: ' + url + ', currentPage: ' + currentPage);

    var data = {};
    data['statusCurrentPage'] = currentPage;

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (response) {
            flog('Saving moduleStatus ok', response);
            restoreFields(response);

            if (callback) {
                callback();
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('Error saving moduleStatus', event, XMLHttpRequest, ajaxOptions, thrownError);
        }
    });
}

function saveFields(callback) {
    var data = {};
    $('#body').find('textarea, input, select').not('.no-save').each(function () {
        var inp = $(this);
        var qname = getQualifiedFieldName(inp.attr('name'));
        data[qname] = inp.val();
    });
    flog('saveFields | data: ', data);

    var url = modStatusUrl;
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (response) {
            flog('Saving fields ok', response);
            if (callback) {
                callback();
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            flog('Error saving fields', event, XMLHttpRequest, ajaxOptions, thrownError);
            alert('There was an error saving your fields');
        }
    });
}

function restoreFields(response) {
    flog('restoreFields');

    var formBody = $('#body');

    if (response.data) {
        for (var qualifiedFieldName in response.data) {
            var fieldName = stripPageName(qualifiedFieldName);
            var fieldValue = response.data[qualifiedFieldName];
            if (fieldValue !== null) {
                fieldValue = fieldValue.trim();
            }
            var isQualified = false;
            if (fieldName !== qualifiedFieldName) {
                isQualified = true;
            }

            flog('fieldValue: ' + fieldValue + ', fieldName: ' + qualifiedFieldName, 'from', response.data);
            var inputs = formBody.find('[name="' + fieldName + '"]');
            var radios = inputs.filter(':radio');
            var notRadio = inputs.not(':radio');
            if (!inputs.hasClass('qualified-set')) {
                if (isQualified) {
                    inputs.addClass('qualified-set');
                }

                if (notRadio.length > 0) {
                    notRadio.val(fieldValue);
                } else {
                    if (radios.length > 0) {
                        var radio = radios.filter('[value=' + fieldValue + ']');
                        radio.prop('checked', true); // set radio buttons
                    }
                }
            }
        }
    }

    flog('restoreFields | Trim text of textarea');
    formBody.find('textarea').each(function () {
        var textarea = $(this);
        var text = textarea.val().trim();

        textarea.val(text);
    });

    $(document.body).trigger('fieldsRestored');
}

/*
 * Called to indicate that the module is complete
 */
function completed() {
    flog('completed', modStatusUrl);

    if (!isCompletable) {
        if (modStatusComplete) {
            var modal = $('#alreadyCompleted');
            if (modal.length === 0) {
                alert('You have reached the end of this module, and you have previously completed it.');
            } else {
                modal.modal();
            }
        } else {
            var modal = $('#cannotComplete');
            flog('modal', modal);
            if (modal.length === 0) {
                alert('You have reached the end of this module.');
            } else {
                modal.modal();
            }
        }

        return;
    }

    setStatusComplete();
}

function setStatusComplete() {
    ajaxLoadingOn();

    $.ajax({
        type: 'POST',
        url: modStatusUrl,
        data: {
            statusComplete: true
        },
        success: function (response) {
            ajaxLoadingOff();

            flog('setStatusComplete response', response);

            if (response.status) {
                flog('setStatusComplete completed ok, so show completed message');
                showCompletedMessage();
            } else {
                flog('setStatusComplete returned false', response.fieldMessages[0]);

                if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === 'userData') {
                    showUserModal();
                } else {
                    ajaxLoadingOff();
                    alert('Sorry, for some reason we couldnt mark your module as being complete. Maybe you could try again, or contact the site administrator for help');
                }
            }
        },
        error: function () {
            ajaxLoadingOff();
            alert('Error! \n \n There was an error saving your progress. Please try again and if you still have problems contact the site administrator');
        }
    });
}

function showUserModal() {
    $.ajax({
        type: 'GET',
        url: '/profile/',
        success: function (resp) {
            flog('Got profile page');

            var page = $(resp);
            var form = page.find('div.details form');
            form.find('h4').remove();
            form.find('#firstName').addClass('required');
            form.find('#surName').addClass('required');
            form.find('button').hide();
            form.attr('action', '/profile/');
            form.forms({
                callback: function (resp) {
                    if (resp.status) {
                        closeModals();
                        setStatusComplete();
                    } else {
                        alert('Sorry, we couldnt update your details, please try again');
                    }
                }
            });

            var modal = $('#userDataModal');
            modal.find('button').click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                form.submit();
            });
            modal.find('.modal-body').html(form);

            showModal(modal);
        },
        error: function (resp) {
            ajaxLoadingOff();
            flog('setStatusComplete: profile get failed');
            alert('Very sorry, but something went wrong while attempting to complete your module. Could you please refresh the page and try again?');

        }
    });
}

function showCompletedMessage() {
    flog('showCompletedMessage');

    $.ajax({
        type: 'GET',
        url: './?completeMessage',
        success: function (resp) {
            var page = $(resp);
            var modal = page.find('#finishedModal');
            $(document.body).append(modal);
            showModal(modal);
        },
        error: function () {
            alert('Your module has been completed successfully, but there was a problem displaying the congratulations message.');
            window.location = '/dashboard';
        }
    });
}

function getCurrentPageIndex() {
    var modLinks = $('.pages a.modPage');
    var current = modLinks.filter('.active').attr('href');
    var currentIndex = 0;
    currentIndex = modLinks.length - 1; // default to finish, in case not found
    modLinks.each(function (index) {
        if ($(this).attr('href') === current) {
            currentIndex = index;
        }
    });

    return currentIndex;
}

function getProgressPageIndex() {
    var modLinks = $('.pages a.modPage');
    if (modLinks.length == 0) {
        return 0;
    }

    flog('Looking for current page');
    var currentIndex = 0;
    modLinks.each(function (index) {
        var link = $(this);
        var href = link.attr('href');

        if (href === progressPage) {
            flog('Found current page', index);
            currentIndex = index;
            return false;
        } else {
            flog('Nope, not this one', href, progressPage);
        }
    });

    return currentIndex;
}

function numberOfPages() {
    return $('.pages a.modPage').length;
}

function isLastPage() {
    var currentPageIndex = getCurrentPageIndex();
    var result = currentPageIndex >= (numberOfPages() - 1);

    flog('isLastPage | currentPageIndex: ' + currentPageIndex + ', numberOfPages: ' + numberOfPages() + ', result: ' + result);

    return result;
}

function saveField(fieldName, fieldValue, statUrl) {
    flog('saveField', fieldName, fieldValue, statUrl);

    flog('saveField | userUrl: ' + userUrl);
    if (userUrl === null || userUrl === '') {
        flog('No current user, so dont save');
        return;
    }

    if (!fieldName) {
        fieldName = getFileName(window.location.pathname);
    }

    var qualifiedFieldName = getQualifiedFieldName(fieldName);
    $.ajax({
        type: 'POST',
        url: statUrl,
        data: {
            changedField: qualifiedFieldName,
            changedValue: fieldValue
        },
        success: function (response) {
            flog('Saving field ok', response);
        },
        error: function (response) {
            flog('Error saving field', response);
        }
    });
}

function getQualifiedFieldName(fieldName) {
    var qualifiedFieldName = getFileName(window.location.pathname);
    qualifiedFieldName = qualifiedFieldName.replace('.html', '');
    qualifiedFieldName += '_';
    qualifiedFieldName += fieldName;

    return qualifiedFieldName;
}

function stripPageName(qualifiedFieldName) {
    if (qualifiedFieldName.contains('_')) {
        var i = qualifiedFieldName.indexOf('_');
        var n = qualifiedFieldName.substring(i + 1, qualifiedFieldName.length);
        flog('stripPageName', i, n);
        return n;
    } else {
        return qualifiedFieldName;
    }
}

function initModalLinks() {
    flog('initModalLinks');

    $('div.linked-modal').each(function () {
        $(this).append('<a href="#" title="Close" class="close-modal">Close</a>')
    });

    $(document.body).on('click', 'a.anchor-modal', function (e) {
        e.preventDefault();
        var target = $(this);
        var id = target.attr('href');
        var title = target.text();
        if (title.length > 50) {
            title = title.substring(0, 50);
        }

        var div = $(id);
        div.removeClass('linked-modal');
        div.css('width', '');
        div.css('height', '');

        showModal(div, title);
    });

    $('a.close-modal').click(function (e) {
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
function checkSubmit(e, isPageLink) {
    flog('checkSubmit', e, isPageLink);

    var isNextBtnVisible = $('.nextBtn:visible');
    flog('isNextBtnVisible: ' + isNextBtnVisible.length === 0);
    if (isNextBtnVisible.length === 0) {
        flog('Already processing');

        return;
    }

    var quizComplete = isQuizComplete(e);
    if (!quizComplete) { // there might not be a quiz, which is ok
        flog('Quiz is not complete (bs335)');
        e.preventDefault();
        e.stopPropagation();
        return;
    } else {
        flog('Quiz is completed');
    }

    if (!isPageLink) {
        var lastPage = isLastPage();
        if (lastPage) {
            e.preventDefault();
            e.stopPropagation();
            flog('Is lasted page. Doing completed method');
            completed();
            return;
        }
    }

    // all good, carry on with event processing
    flog('all good, carry on with event processing', e);
}

/**
 * returns true if the quiz is complete, otherwise displays appropriate validation
 * messages
 */
function isQuizComplete(e) {
    var quiz = $('form.quiz');
    flog('isQuizComplete', e, quiz);

    if (quiz.length === 0) {
        flog('Quiz is empty, so is complete');
        return true;
    }

    if (quiz.hasClass('validated')) {
        flog('Quiz has been validated, so is complete');
        return true;
    }

    if (!isCompletable) {
        flog('Module is complete, so true');
        return true;
    }

    var isQuizPassed = $('.quiz.quiz-passed').length > 0;
    var isBeyondQuiz = (getProgressPageIndex() > getCurrentPageIndex()) || isQuizPassed;
    if (isBeyondQuiz) {
        flog('Is beyond quiz, so quiz is complete');
        return true;
    }

    // Clear any previous errors
    var errors = quiz.find('.error');
    flog('isQuizComplete | Remove prev errors', errors);
    errors.removeClass('error');

    // Check all questions have been answered
    var hasError = false;
    quiz.find('ol.quiz > li').each(function () {
        var li = $(this);
        var inputs = li.find('textarea, input:radio:checked');

        if (inputs.length === 0) {
            flog('Found incomplete input', li);
            li.addClass('error');
            hasError = true;
        } else {
            var val = (inputs.val() + '').trim();

            if (val.length === 0) {
                flog('Found incomplete input', li);
                li.addClass('error');
                hasError = true;
            }
        }
    });

    if (hasError) {
        alert('Please answer all of the questions');
        return false;
    }

    if (quiz.hasClass('processing')) {
        flog('Quiz check is in progress');
        return false;
    }

    quiz.addClass('processing');

    // Check the quiz against the database
    var pageName = getFileName(window.location.pathname);
    quiz.find('input[name=quiz]').val(pageName);
    try {
        flog('Doing check quiz\'s answers');

        $.ajax({
            type: 'POST',
            url: modStatusUrl,
            data: quiz.serialize(),
            dataType: 'json',
            success: function (response) {
                quiz.removeClass('processing');

                if (response.status) {
                    flog('Validating quiz OK', response);
                    quiz.addClass('validated').trigger('quizSuccess');

                    // Fix https://github.com/Kademi/kademi-dev/issues/1331
                    var currentTarget = $(e.target);
                    if (!currentTarget.is('a')) {
                        currentTarget = $(e.target).closest('a');
                    }

                    if (isLastPage() && currentTarget.hasClass('nextBtn')) {
                        $('ol.quiz input').prop('disabled', true);
                        completed();
                    } else {
                        $.pjax({
                            selector: '.pages a',
                            fragment: '.panelBox',
                            container: '.panelBox',
                            url: currentTarget.prop('href'),
                            success: function () {
                                flog('Pjax success!');

                                initPrintLink(); // called by init-theme
                                initPageNav();
                            },
                            debug: true
                        });
                    }
                } else {
                    flog('Validating quiz is false', response);
                    if (response.data && response.data.nextQuizBatch) {
                        flog('Looks like we have another batch...', response.data.nextQuizBatch);
                        quiz.find('ol.quiz').replaceWith(response.data.nextQuizBatch);
                        tidyUpQuiz();
                    } else {
                        // The quiz has already been completed
                        if (response && response.messages && response.messages[0] && response.messages[0].indexOf('The quiz has already been completed') !== -1) {
                            flog('The quiz has already been completed!');

                            var currentTarget = $(e.target);
                            if (!currentTarget.is('a')) {
                                currentTarget = $(e.target).closest('a');
                            }
                            if (isLastPage() && currentTarget.hasClass('nextBtn')) {
                                $('ol.quiz input').prop('disabled', true);
                                completed();
                            } else {
                                $.pjax({
                                    selector: '.pages a',
                                    fragment: '.panelBox',
                                    container: '.panelBox',
                                    url: currentTarget.prop('href'),
                                    success: function () {
                                        flog('Pjax success!');

                                        initPrintLink(); // called by init-theme
                                        initPageNav();
                                    },
                                    debug: true
                                });
                            }
                        } else {
                            alert('Please check your answers');
                            $.each(response.fieldMessages, function (i, n) {
                                var inp = quiz.find('li.' + n.field);
                                inp.addClass('error');
                            });
                        }
                    }
                }
            },
            error: function (response) {
                quiz.removeClass('processing');
                flog('isQuizComplete | Error when checking quiz', response);
                showApology('check your answers');
            }
        });
    } catch (e) {
        flog('Exception in isQuizComplete', e);
        showApology('check your answers');
    }
    return false;
}

function showApology(operation) {
    alert('Oh, oops. I\'m really, really, sorry, but I couldnt ' + operation + ' because of some computer-not-behaving thing. Perhaps check your internet connection? If it still doesnt work it would be super nice if you could tell us from the contact page and we\'ll sort it out ASAP - thanks!');
}
