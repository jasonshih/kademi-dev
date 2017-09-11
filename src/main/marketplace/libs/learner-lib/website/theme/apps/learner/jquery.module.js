/**
 *
 * jquery.module.js
 * @version: 1.0.0
 *
 * Configuration:
 * @option {String} currentUrl Url address of current module page
 * @option {Boolean} isCompleted This module is completed or not
 * @option {Boolean} isEditable This module is editable now or not
 * @option {Boolean} isCompletable User has permission for complete this module
 * @option {Boolean} isMobileSupported Supports mobile or not
 * @option {Number} pjaxTimeout The Ajax timeout in milliseconds after which a full refresh is forced. Default: 5000
 * @option {Function} onPreviousPage Callback will be called when click on previous page, include click on Previous button. Argument is 'clickedElement'
 * @option {Function} onNextPage Callback will be called when click on next page, include click on Next button or Submit button of Quiz page. Argument is 'clickedElement'
 * @option {Function} onModulePageLoad Callback will be called when module page is loaded, Argument is 'pageIndex', 'data'
 * @option {Function} onModuleStarted Callback will be called when module is started, Argument is 'startedDateTime'
 * @option {Function} onModuleCompleted Callback will be called when module is completed, Argument is 'completedDateTime'
 * @option {Function} onQuizSubmit Callback will be called after clicking on Submit button on Quiz page. Argument is 'quizForm'
 * @option {Function} onQuizSuccess Callback will be called after Quiz is submitted successfully. Arguments are 'quizForm' and 'response'
 * @option {Function} onQuizError Callback will be called after Quiz is error. Maybe blank or wrong answers, or other errors will be occurred. Arguments are 'quizForm' and 'response'
 * @option {Function} onModuleStatusSaved Callback will be called after module status is saved.
 */
(function ($) {
    $.module = function (method) {
        if (Module[method]) {
            return Module[method].apply(Module, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return Module.init.apply(Module, arguments);
        } else {
            $.error('[jquery.module] Method ' + method + ' does not exist on jquery.module');
        }
    };
    
    // Version for jquery.module
    $.module.version = '1.0.0';
    
    // Default configuration of jquery.module
    $.module.DEFAULTS = {
        currentUrl: '',
        isCompleted: false,
        isEditable: false,
        isCompletable: false,
        isMobileSupported: true,
        pjaxTimeout: 5000,
        onPreviousPage: null,
        onNextPage: null,
        onModulePageLoad: null,
        onModuleStarted: null,
        onModuleCompleted: null,
        onQuizSubmit: null,
        onQuizSuccess: null,
        onQuizError: null,
        onModuleStatusSaved: null
    };
    
    var Module = {
        options: null,
        
        init: function (options) {
            var self = this;
            
            // Store options
            options = self.options = self.getOptions(options);
            
            if (options.isEditable) {
                edifyPage('.contentForm');
                return;
            }
            
            // Module is completable ?
            self.isCompletable = options.isCompletable && !options.isCompleted;
            self.isComplete = options.isCompleted;
            flog("iscomplete? ", self.isComplete);
            
            self.initModuleNav();
            
            // BM: this is already called from initModuleNav
            //self.initLearningContentStyles();
            initComments(options.currentUrl);
            initModuleSearch();
            
            if (options.isMobileSupported) {
                if (!self.isDesktop()) {
                    self.initMobile();
                }
            }
        },
        
        getOptions: function (options) {
            if (this.options) {
                return this.options;
            } else {
                return $.extend({}, $.module.DEFAULTS, options);
            }
        },
        
        isDesktop: function () {
            var userAgent = navigator.userAgent.toLowerCase();
            var isDesktop = !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)));
            
            flog('[jquery.module] Is desktop: ' + isDesktop, 'User-agent: ' + userAgent);
            return isDesktop;
        },
        
        initMobile: function () {
            $.getScriptOnce('/static/touchSwipe/1.6.5/jquery.touchSwipe.js', function () {
                flog('[jquery.module] Initialize swiping');
                
                $('.module-container').swipe({
                    swipeLeft: function () {
                        $('.nextBtn').trigger('click');
                    },
                    swipeRight: function () {
                        $('.prevBtn').trigger('click');
                    }
                });
            });
        },
        
        initModuleNav: function () {
            flog('[jquery.module] initModuleNav');
            
            var self = this;
            var options = self.getOptions();
            self.initPageNav();
            
            // This needs to be just done once, not on each pjax transition
            $(document.body).on('click', '.nextBtn', function (e) {
                var btn = $(this);
                flog('[jquery.module] Clicked on .nextBtn', btn);
                
                if (!self.checkNext()) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                
                flog('[jquery.module] Check for a quiz');
                if (!self.isQuizCompleted(e)) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                
                if (typeof options.onNextPage === 'function') {
                    options.onNextPage.call(btn, btn);
                }
                
                if (self.isLastPage()) {
                    flog('[jquery.module] Is lasted page. Doing completed method');
                    self.completeModule();
                    
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            });
            
            var pageLinks = $('.pages a').not('.nextBtn');
            pageLinks.click(function (e) {
                var link = $(this);
                
                if (link.hasClass('disabled')) {
                    flog('[jquery.module] Preventing click on disabled link', link);
                    
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                
                var currentIndex = self.getCurrentPageIndex();
                var clickedIndex = link.index();
                if (clickedIndex > currentIndex) {
                    if (!self.checkNext()) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                    
                    if (typeof options.onNextPage === 'function') {
                        options.onNextPage.call(link, link);
                    }
                    
                    if (!self.isQuizCompleted(e)) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                } else if (clickedIndex < currentIndex) {
                    if (typeof options.onPreviousPage === 'function') {
                        options.onPreviousPage.call(link, link);
                    }
                } else {
                    flog('[jquery.module] Clicked on current page. Do nothing!');
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
            
            flog('[jquery.module] Setup pjax', pageLinks);
            $(document).pjax2('.panelBox', {
                selector: '.pages a',
                fragment: '.panelBox',
                timeout: options.pjaxTimeout,
                success: function (data) {
                    flog('[jquery.module] Pjax success!', data);
                    
                    initPrintLink();
                    self.initPageNav(data);
                },
                debug: true
            });
        },
        
        tidyUpQuiz: function () {
            flog('[jquery.module] tidyUpQuiz');
            
            $('ol.quiz li p').each(function () {
                var node = $(this);
                var text = node.text();
                
                if (text.startsWith('[')) {
                    node.hide();
                }
            });
        },
        
        initPageNav: function (data) {
            flog('[jquery.module] initPageNav');
            
            var self = this;
            var options = self.getOptions();
            
            var pageName = getFileName(window.location.pathname);
            pageName = pageName.replaceAll(' ', '%20');
            pageName = decodeURI(pageName);
            flog('[jquery.module] Page name: ' + pageName);
            
            var pagesWrapper = $('.pages');
            var pagesLinks = pagesWrapper.find('a');
            pagesWrapper.find('.active').removeClass('active');
            
            pagesLinks.filter('.modPage').each(function () {
                var modLink = $(this);
                var href = decodeURI(modLink.attr('href'));
                
                if (href === pageName) {
                    modLink.addClass('active').closest('li').addClass('active');
                }
            });
            
            self.tidyUpQuiz();
            
            var progressPageIndex = self.getProgressPageIndex();
            var currentPageIndex = self.getCurrentPageIndex();
            var isQuizPassed = $('.quiz.quiz-passed').length > 0;
            var isBeyondCurrent = (progressPageIndex > currentPageIndex) || isQuizPassed;
            var whenComplete = $('.when-complete');
            var whenNotComplete = $('.when-not-complete');
            if (isBeyondCurrent) {
                flog('[jquery.module] Show .when-complete');
                
                self.disableQuiz();
                whenComplete.show();
                whenNotComplete.hide();
            } else {
                if (self.isCompletable) {
                    flog('[jquery.module] Show .when-not-complete');
                    
                    whenComplete.hide();
                    whenNotComplete.show();
                } else {
                    whenComplete.hide();
                    whenNotComplete.hide();
                }
            }
            
            self.initLearningContentStyles();
            self.initModalLinks();
            
            flog('[jquery.module] options.isCompleted: ' + options.isCompleted + ', userUrl: ', userUrl);
            
            var prevUrl = self.getMoveHref(-1) + '?r=' + (new Date().getTime());
            flog('[jquery.module] prevUrl: ' + prevUrl);
            $('.prevBtn').attr('href', prevUrl);
            
            var nextUrl = self.getMoveHref(1) + '?r=' + (new Date().getTime());
            flog('[jquery.module] nextUrl: ' + nextUrl);
            $('.nextBtn').attr('href', nextUrl);
            
            if (options.isCompleted) {
                flog('[jquery.module] Module is completed so do nothing');
            } else {
                if (!progressPageIndex || currentPageIndex > progressPageIndex) {
                    // Only save current page if it is the furthest yet visited
                    window.setTimeout(function () {
                        flog('[jquery.module] Do save progress because we changed page');
                        self.saveProgress();
                    }, 500);
                } else {
                    flog('[jquery.module] Not doing save, so explicitly reload fields...', options.currentUrl);
                    self.doRestoreFields();
                }
            }
            
            self.checkProgressPageVisibility();
            
            // Setup event to save any changes on the fly
            var formFields = $('#body').find('textarea, input, select');
            flog('[jquery.module] Initialize field saving', formFields);
            formFields.change(function () {
                var field = $(this);
                flog('[jquery.module] Field is changed', field);
                var fieldName = field.attr('name');
                var val;
                if (field.is(":checkbox")) {
                    var fields = $("input[name=" + fieldName + "]:checked")
                    val = "";
                    fields.each(function (i, n) {
                        if (i > 0) {
                            val += ",";
                        }
                        val += $(n).val();
                    });
                    flog('[jquery.module] Check field is changed', "fields=", fields, "val=", val);
                } else if (field.is(":radio")) {
                    if (field.is(":checked")) {
                        val = field.val();
                    } else {
                        val = "";
                    }
                    flog('[jquery.module] Radio field is changed', "fieldName=", fieldName, "val=", val);
                } else {
                    flog('[jquery.module] Normal field is changed', "fieldName=", fieldName, "val=", val);
                    val = field.val();
                }
                self.saveField(fieldName, val);
            });
            
            // Need to delay, because this script might be running before other scripts
            // have had time to register for the event
            window.setTimeout(function () {
                flog('[jquery.module] Fire onModulePageLoad event');
                
                $('body').trigger('modulePageLoad', [currentPageIndex, data]);
                
                if (typeof self.getOptions().onModulePageLoad === 'function') {
                    self.getOptions().onModulePageLoad.call(null, currentPageIndex, data);
                }
            }, 50);
            
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
            
        },
        
        doRestoreFields: function () {
            flog('[jquery.module] doRestoreFields');
            
            var self = this;
            var options = self.getOptions();
            
            $.ajax({
                type: 'GET',
                url: options.currentUrl + '?fields',
                dataType: 'json',
                success: function (response) {
                    self.restoreFields(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('[jquery.module] Error when restoring fields', jqXHR, textStatus, errorThrown);
                }
            });
        },
        
        disableQuiz: function () {
            flog('[jquery.module] disableQuiz');
            
            var quiz = $('ol.quiz');
            var inputs = quiz.find('input, select, textarea');
            inputs.prop('disabled', true);
            $('.submitQuiz').hide();
        },
        
        /**
         * Called on page load and expand events, checks to see what progress navigation
         * elements should be enabled
         */
        checkProgressPageVisibility: function () {
            flog('[jquery.module] checkProgressPageVisibility');
            
            var self = this;
            var options = self.getOptions();
            
            var pagesList = $('.pages');
            var hiddenSections = $('.btnHideFollowing').not('.expanded');
            var hasHidden = hiddenSections.length > 0;
            var progressPageIndex = self.getProgressPageIndex();
            var currentPageIndex = self.getCurrentPageIndex();
            
            if (progressPageIndex < currentPageIndex) {
                pagesList.find('a.nextBtn').show();
            }
            
            var isInputsDone = true;
            var isQuizPassed = $('.quiz.quiz-passed').length > 0;
            var isBeyondCurrent = (progressPageIndex > currentPageIndex) || isQuizPassed;
            flog('[jquery.module] isBeyondCurrent: ' + isBeyondCurrent);
            
            window.onQuiz = false; // figure out if user is on a quiz page
            var quiz = $('ol.quiz');
            if (quiz.length > 0) {
                if (isBeyondCurrent) {
                    self.disableQuiz();
                } else {
                    onQuiz = true; // use is on a quiz page
                }
            } else {
                isInputsDone = (self.findIncompleteInputs().length === 0);
                flog('[jquery.module] Not a quiz page, so check if fields completed... = ', isInputsDone);
            }
            
            // Page nav button is enabled if its index is <= progress page index, or all btnHideFollowing have expanded class and its index = current+1 and current page=progress page
            // if for some reason progress page is less then current page, then make progress page the current page
            if (progressPageIndex < currentPageIndex) {
                progressPageIndex = currentPageIndex;
            }
            
            var pages = pagesList.find('a.modPage');
            pages.find('li').removeClass('limit-lower limit-upper limit');
            pages.first().closest('li').addClass('limit-end');
            pages.last().closest('li').addClass('limit-end');
            pages.each(function (i) {
                var modeLink = $(this);
                var away = Math.abs(currentPageIndex - i);
                var limited = away > 10 ? 10 : away;
                var li = modeLink.closest('li');
                $.each(li.classes(), function (i, n) {
                    if (n.startsWith('away')) {
                        li.removeClass(n);
                    }
                });
                li.addClass('away-' + away).addClass('away-limited-' + limited);
                
                var enabled = i <= progressPageIndex || i == currentPageIndex || (i == (currentPageIndex + 1) && isInputsDone && !hasHidden);
                enabled = enabled || !self.isCompletable; // all links enabled for view only (non completable) enrolments
                self.setLinkEnabled(modeLink, enabled);
            });
            
            var nextEnabled;
            var isLastPage = self.isLastPage();
            flog('[jquery.module] isCompleted: ' + options.isCompleted, 'isBeyondCurrent: ' + isBeyondCurrent, 'isLastPage: ' + isLastPage);
            
            if (!self.isCompletable) {
                // For a non-completable enrolement we allow users to view any page in any order
                nextEnabled = true;
            } else if (!options.isCompleted && (!isBeyondCurrent || (isBeyondCurrent && !options.isCompleted)) && (quiz.length > 0 || isLastPage)) {
                $('a.nextBtn').addClass('quizSubmit').find('span').text('Submit');
                nextEnabled = true;
            } else {
                $('a.nextBtn').removeClass('quizSubmit').find('span').text('Next');
                var nextLink = pages.filter('.active').next();
                
                // if there's a hidden section, clicking next will show it
                // If inputs are not complete, still show next so they user can click it to get validation
                nextEnabled = nextLink.hasClass('enabled') || hasHidden || !isInputsDone;
                
                flog('[jquery.module] nextEnabled: ' + nextEnabled, 'nextLink: ' + nextLink, 'hasHidden: ' + hasHidden, 'isInputsDone: ' + isInputsDone);
            }
            
            self.setLinkEnabled(pagesList.find('a.nextBtn'), nextEnabled);
        },
        
        
        checkNext: function () {
            flog('[jquery.module] checkNext');
            
            var self = this;
            
            var popout = $('div.pages div.popout');
            popout.hide();
            
            var incompleteInputs = self.findIncompleteInputs();
            
            var hiddenSections = $('.btnHideFollowing').not('.expanded').filter(':visible');
            flog('[jquery.module] hiddenSections', hiddenSections);
            
            if (hiddenSections.length > 0) {
                var first = hiddenSections.first();
                flog('[jquery.module] First hidden section', first);
                
                // Check if required inputs prior to this are completed
                var incompleteInput = null;
                first.prev().find('input.required, select.required, textarea.required').each(function () {
                    var node = $(this);
                    var val = node.val().trim();
                    
                    if (val == '') {
                        incompleteInput = node;
                        flog('[jquery.module] Check input: is incomplete', val, node, incompleteInput);
                    } else {
                        flog('[jquery.module] Check input: ok', val, node, incompleteInput);
                    }
                    
                });
                
                if (incompleteInput == null) {
                    first.click();
                } else {
                    self.showNextPopup(incompleteInputs);
                }
                
                flog('[jquery.module] Found hidden sections', hiddenSections);
                return false;
            }
            
            flog('[jquery.module] Total incomplete inputs: ' + incompleteInputs.length, incompleteInputs);
            
            if (incompleteInputs.length > 0) {
                flog('[jquery.module] Found incomplete input', incompleteInputs);
                incompleteInputs.addClass('error');
                self.showNextPopup(incompleteInputs);
                
                return false;
            }
            flog('[jquery.module] Validation passed');
            return true;
        },
        
        showNextPopup: function (incompleteInput) {
            flog('[jquery.module] showNextPopup');
            
            var popout = $('div.pages div.popout');
            if( popout.length > 0 ) {
                var popoutSpan = popout.find('span');
                popoutSpan.html('Please enter <a href="#">required fields</a>');
                popoutSpan.find('a').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $('html, body').animate({
                        scrollTop: incompleteInput.first().offset().top
                    }, 1000);

                });            
                popout.show(100);
            } else {
                alert('Please enter the required fields highlighted in red');
            }
        },
        
        findIncompleteInputs: function () {
            var inputs = $('.panelBox').find('input.required, select.required, textarea.required').not('.no-validate')
            
            flog('[jquery.module] findIncompleteInputs', inputs);
            
            return inputs.filter(function () {
                var val = $(this).val() || '';
                
                return (val.trim() === '');
            });
        },
        
        setLinkEnabled: function (a, isEnabled) {
            flog('[jquery.module] setLinkEnabled', a, isEnabled);
            
            if (isEnabled) {
                a.removeClass('disabled');
                a.addClass('enabled');
            } else {
                a.addClass('disabled');
                a.removeClass('enabled');
            }
        },
        
        initLearningContentStyles: function () {
            flog('[jquery.module] initLearningContentStyles');
            
            var self = this;
            
            var currentPageIndex = self.getCurrentPageIndex();
            var progressPageIndex = self.getProgressPageIndex();
            flog('[jquery.module] currentPageIndex: ' + currentPageIndex, 'progressPageIndex: ' + progressPageIndex);
            var btnHideFollowing = $('.btnHideFollowing');
            
            if (currentPageIndex >= progressPageIndex) {
                var afterBtnHideFollowing = $('.btnHideFollowing').nextAll();
                flog('[jquery.module] Show .btnHideFollowing', afterBtnHideFollowing);
                afterBtnHideFollowing.hide(); // initially hide everything after it
                
                btnHideFollowing.click(function () {
                    btnHideFollowing.addClass('expanded');
                    var toToggle = btnHideFollowing.nextUntil('.btnHideFollowing').not('.linked-modal');
                    flog('[jquery.module] btnHideFollowing: toggle:', toToggle);
                    toToggle.show(200);
                    
                    // also show the next button, if there is one
                    var last = toToggle.last();
                    last.next().not('.linked-modal').show(); // because toToggle is nextUntil .btnHideFollowing, the next after the last should be a btnHideFollowing, or nothing
                    
                    self.checkProgressPageVisibility();
                });
            } else {
                flog('[jquery.module] Hide .btnHideFollowing');
                btnHideFollowing.hide(); // if we're not using continue buttons, hide them
            }
            
            $('div.dropdown').children('h3, h4, h5, h6, span.sprite').click(function (e) {
                e.preventDefault();
                
                var dropDownDiv = $(this).closest('div.dropdown');
                dropDownDiv.children('div').toggle(200, function () {
                    var div = $(this);
                    var visibleEls = div.find(':visible');
                    
                    flog('[jquery.module] Set open class', div, visibleEls);
                    
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
        },
        
        getMoveHref: function (count) {
            flog('[jquery.module] getMoveHref', count);
            
            var self = this;
            
            var currentPageIndex = self.getCurrentPageIndex();
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
        },
        
        saveProgress: function () {
            var self = this;
            var options = self.getOptions();
            flog('[jquery.module] saveProgress', 'isCompletable: ' + self.isCompletable + ', userUrl: ' + userUrl);
            
            if (userUrl === null) {
                return;
            }
            
            if (!self.isCompletable) {
                self.doRestoreFields();
                return;
            }
            
            var currentPage = getFileName(window.location.pathname);
            self.progressPage = currentPage; // update progress page so we can keep track
            
            var data = {};
            data['statusCurrentPage'] = currentPage;
            
            if (self.getCurrentPageIndex() === 0 && typeof options.onModuleStarted === 'function') {
                options.onModuleStarted.call(null, new Date());
            }
            
            $.ajax({
                type: 'POST',
                url: options.currentUrl,
                data: data,
                success: function (response) {
                    flog('[jquery.module] Saving moduleStatus ok', response);
                    self.restoreFields(response);
                    
                    if (typeof options.onModuleStatusSaved === 'function') {
                        options.onModuleStatusSaved.call(this);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('[jquery.module] Error when saving moduleStatus', jqXHR, textStatus, errorThrown);
                }
            });
        },
        
        saveFields: function (callback) {
            flog('[jquery.module] saveFields', callback);
            
            var self = this;
            var data = {};
            $('#body').find('textarea, input, select').not('.no-save').each(function () {
                var inp = $(this);
                var qname = self.getQualifiedFieldName(inp.attr('name'));
                data[qname] = inp.val();
            });
            flog('[jquery.module] Data: ', data);
            
            var url = options.currentUrl;
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function (response) {
                    flog('[jquery.module] Saving fields ok', response);
                    
                    if (typeof callback === 'function') {
                        callback();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('[jquery.module] Error when saving moduleStatus', jqXHR, textStatus, errorThrown);
                    alert('There was an error saving your fields');
                }
            });
        },
        
        restoreFields: function (response) {
            flog('[jquery.module] restoreFields', response);
            
            var self = this;
            var formBody = $('#body');
            
            if (response.data) {
                for (var qualifiedFieldName in response.data) {
                    var fieldName = self.getUnqualifiedFieldName(qualifiedFieldName);
                    var fieldValue = response.data[qualifiedFieldName];
                    if (fieldValue !== null) {
                        fieldValue = fieldValue.trim();
                    }
                    var isQualified = false;
                    if (fieldName !== qualifiedFieldName) {
                        isQualified = true;
                    }
                    
                    flog('[jquery.module] fieldValue: "' + fieldValue + '"; fieldName: ' + qualifiedFieldName);
                    var inputs = formBody.find('[name="' + fieldName + '"]');
                    var radios = inputs.filter(':radio, :checkbox');
                    var notRadio = inputs.not(':radio, :checkbox');
                    if (!inputs.hasClass('qualified-set')) {
                        if (isQualified) {
                            inputs.addClass('qualified-set');
                        }
                        
                        if (notRadio.length > 0) {
                            flog('[jquery.module] Set not-radio val', notRadio, fieldValue);
                            notRadio.val(fieldValue);
                        } else {
                            if (radios.length > 0) {
                                var arr = fieldValue.split(",");
                                for (var i = 0; i < arr.length; i++) {
                                    var fv = arr[i].trim();
                                    if (fv.length > 0) {
                                        var radio = radios.filter('[value=' + fv + ']');
                                        flog('[jquery.module] Set checked', radio, fv);
                                        radio.prop('checked', true); // set radio buttons
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            flog('[jquery.module] Trim text of textarea');
            formBody.find('textarea').each(function () {
                var textarea = $(this);
                var text = textarea.val().trim();
                
                textarea.val(text);
            });
            
            $(document.body).trigger('fieldsRestored');
        },
        
        /*
         * Called to indicate that the module is complete
         */
        completeModule: function () {
            flog('[jquery.module] completeModule');
            
            var self = this;
            var options = self.getOptions;
            
            if (!self.isCompletable) {
                if (options.isCompleted) {
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
            
            self.setStatusComplete();
        },
        
        setStatusComplete: function () {
            flog('[jquery.module] setStatusComplete');
            
            var self = this;
            var options = self.getOptions();
            
            ajaxLoadingOn();
            
            $.ajax({
                type: 'POST',
                url: options.currentUrl,
                data: {
                    statusComplete: true
                },
                success: function (response) {
                    ajaxLoadingOff();
                    
                    flog('[jquery.module] setStatusComplete response', response);
                    
                    if (response.status) {
                        flog('[jquery.module] setStatusComplete completed ok, so show completed message');
                        self.showCompletedMessage();
                        
                        if (typeof options.onModuleCompleted === 'function') {
                            options.onModuleCompleted.call(null, new Date());
                        }
                    } else {
                        flog('[jquery.module] setStatusComplete returned false', response.fieldMessages[0]);
                        
                        if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === 'userData') {
                            self.showUserModal();
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
        },
        
        showUserModal: function () {
            flog('[jquery.module] showUserModal');
            
            var self = this;
            
            $.ajax({
                type: 'GET',
                url: '/profile/',
                success: function (resp) {
                    flog('[jquery.module] Got profile page');
                    
                    var page = $(resp);
                    var form = page.find('div.details form');
                    form.find('h4').remove();
                    form.find('#firstName').addClass('required');
                    form.find('#surName').addClass('required');
                    form.find('button').hide();
                    form.attr('action', '/profile/');
                    form.forms({
                        onSuccess: function (resp) {
                            if (resp.status) {
                                closeModals();
                                self.setStatusComplete();
                            } else {
                                alert('Sorry, we couldnt update your details, please try again');
                            }
                        }
                    });
                    
                    var modal = $('#userDataModal');
                    modal.find('button').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        form.trigger('submit');
                    });
                    modal.find('.modal-body').html(form);
                    
                    showModal(modal);
                },
                error: function (resp) {
                    ajaxLoadingOff();
                    flog('[jquery.module] setStatusComplete: profile get failed');
                    alert('Very sorry, but something went wrong while attempting to complete your module. Could you please refresh the page and try again?');
                    
                }
            });
        },
        
        showCompletedMessage: function () {
            flog('[jquery.module] showCompletedMessage');
            
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
        },
        
        getCurrentPageIndex: function () {
            flog('[jquery.module] getCurrentPageIndex');
            
            var modLinks = $('.pages a.modPage');
            var current = modLinks.filter('.active').attr('href');
            var currentIndex = modLinks.length - 1; // Default to finish, in case not found
            
            modLinks.each(function (index) {
                if ($(this).attr('href') === current) {
                    currentIndex = index;
                }
            });
            
            return currentIndex;
        },
        
        getProgressPageIndex: function () {
            flog('[jquery.module] getProgressPageIndex');
            
            var self = this;
            
            var modLinks = $('.pages a.modPage');
            if (modLinks.length == 0) {
                return 0;
            }
            
            flog('[jquery.module] Looking for current page');
            var progressIndex = 0;
            modLinks.each(function (index) {
                var link = $(this);
                var href = link.attr('href');
                
                if (href === self.progressPage) {
                    progressIndex = index;
                    return false;
                }
            });
            
            return progressIndex;
        },
        
        getNumberOfPages: function () {
            flog('[jquery.module] getNumberOfPages');
            
            return $('.pages a.modPage').length;
        },
        
        isLastPage: function () {
            flog('[jquery.module] isLastPage');
            
            var self = this;
            var currentPageIndex = self.getCurrentPageIndex();
            var numberOfPages = self.getNumberOfPages();
            var result = currentPageIndex >= (numberOfPages - 1);
            
            flog('[jquery.module] currentPageIndex: ' + currentPageIndex + ', numberOfPages: ' + numberOfPages + ', result: ' + result);
            
            return result;
        },
        
        saveField: function (fieldName, fieldValue) {
            flog('[jquery.module] saveField', fieldName, fieldValue);
            
            var self = this;
            var options = self.getOptions();
            
            flog('[jquery.module] userUrl: ' + userUrl);
            if (userUrl === null || userUrl === '') {
                flog('[jquery.module] No current user, so do not save');
                return;
            }
            
            if (!fieldName) {
                fieldName = getFileName(window.location.pathname);
            }
            
            var qualifiedFieldName = self.getQualifiedFieldName(fieldName);
            $.ajax({
                type: 'POST',
                url: options.currentUrl,
                data: {
                    changedField: qualifiedFieldName,
                    changedValue: fieldValue
                },
                success: function (response) {
                    flog('[jquery.module] Saving field ok', response);
                },
                error: function (response) {
                    flog('[jquery.module] Error saving field', response);
                }
            });
        },
        
        getQualifiedFieldName: function (fieldName) {
            var qualifiedFieldName = getFileName(window.location.pathname);
            qualifiedFieldName = qualifiedFieldName.replace('.html', '');
            qualifiedFieldName += '_';
            qualifiedFieldName += fieldName;
            
            return qualifiedFieldName;
        },
        
        getUnqualifiedFieldName: function (qualifiedFieldName) {
            if (qualifiedFieldName.contains('_')) {
                var i = qualifiedFieldName.indexOf('_');
                
                return qualifiedFieldName.substring(i + 1, qualifiedFieldName.length);
            } else {
                return qualifiedFieldName;
            }
        },
        
        initModalLinks: function () {
            flog('[jquery.module] initModalLinks');
            
            $('div.linked-modal').each(function () {
                $(this).append('<a href="#" title="Close" class="close-modal">Close</a>')
            });
            
            $(document.body).on('click', 'a.anchor-modal', function (e) {
                e.preventDefault();
                
                var link = $(this);
                var id = link.attr('href');
                var title = link.text();
                if (title.length > 50) {
                    title = title.substring(0, 50);
                }
                
                var linkedModal = $(id);
                linkedModal.removeClass('linked-modal');
                linkedModal.css({
                    width: '',
                    height: ''
                });
                
                showModal(linkedModal, title);
            });
            
            $('a.close-modal').click(function (e) {
                e.preventDefault();
                
                closeModals();
            });
        },
        
        quizSuccessHandler: function (quiz, e) {
            flog('[jquery.module] quizSuccessHandler', quiz, e);
            
            var self = this;
            var options = self.getOptions();
            
            // Fix https://github.com/Kademi/kademi-dev/issues/1331
            var currentTarget = $(e.target);
            if (!currentTarget.is('a')) {
                currentTarget = $(e.target).closest('a');
            }
            
            if (self.isLastPage() && currentTarget.hasClass('nextBtn')) {
                self.disableQuiz();
                self.completeModule();
            } else {
                $.pjax({
                    selector: '.pages a',
                    fragment: '.panelBox',
                    container: '.panelBox',
                    timeout: options.pjaxTimeout,
                    url: currentTarget.prop('href'),
                    success: function (data) {
                        flog('[jquery.module] Pjax success!', data);
                        
                        initPrintLink(); // called by init-theme
                        self.initPageNav(data);
                    },
                    debug: true
                });
            }
        },
        
        quizErrorHandler: function (quiz, response, e) {
            flog('[jquery.module] quizErrorHandler', quiz, response, e);
            
            var self = this;
            var options = self.getOptions();
            
            var modal = $('#modal-quiz-error');
            if (modal.length === 0) {
                modal = $(
                    '<div id="modal-quiz-error" class="modal fade">' +
                    '   <div class="modal-dialog">' +
                    '       <div class="modal-content panel-danger">' +
                    '           <div class="modal-header panel-heading">' +
                    '               <button type="button" data-dismiss="modal" class="close">&times;</button>' +
                    '               <h4 class="modal-title"></h4>' +
                    '           </div>' +
                    '           <div class="modal-body">' +
                    '               <p class="error-text"></p>' +
                    '           </div>' +
                    '           <div class="modal-footer">' +
                    '               <button type="button" class="btn btn-primary" data-dismiss="modal">Review incorrect answers</button>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );
                
                modal.appendTo(document.body);
            }
            
            var modalTitle = modal.find('.modal-title');
            var errorText = modal.find('.error-text');
            var btnDismiss = modal.find('.modal-footer button[data-dismiss=modal]');
            
            if (response.data) {
                if (response.data.numAttempts && response.data.numAttempts >= response.data.maxAttempts) {
                    flog('[jquery.module] Reached maximum attempts');
                    
                    modalTitle.html('Reached maximum attempts');
                    errorText.html('You answered quiz incorrectly! <br />' + response.messages[0]);
                    btnDismiss.html('Close and continue');
                    
                    modal.off('hide.bs.modal').on('hide.bs.modal', function () {
                        self.quizSuccessHandler(quiz, e);
                    });
                } else {
                    flog('[jquery.module] Answered this quiz incorrectly');
                    
                    modalTitle.html('Please try again');
                    errorText.html('Your score was <b>' + response.data.thisAttemptScore + '</b>%. You need <b>' + response.data.requiredPassmarkPerc + '</b>% to pass this quiz. And you have <b>' + (response.data.maxAttempts - response.data.numAttempts) + '</b> more attempts to answer this quiz');
                    btnDismiss.html('See incorrect answers');
                    
                    var isBatched = quiz.hasClass('batched-quiz');
                    modal.off('hide.bs.modal').on('hide.bs.modal', function () {
                        if (isBatched) {
                            flog('[jquery.module] Looks like we have another batch...', response.data.nextQuizBatch);
                            
                            var btnSubmitQuiz = $('.quizSubmit .nextBtn');
                            var btnReAttempt = $('.btn-quiz-reattempt');
                            
                            quiz.find('ol.quiz li').find('input, textarea').prop('disabled', true);
                            btnReAttempt.show();
                            btnSubmitQuiz.hide();
                            
                            btnReAttempt.off('click').on('click', function (e) {
                                e.preventDefault();
                                
                                flog('[jquery.module] Re-attempt quiz');
                                quiz.find('ol.quiz').replaceWith(response.data.nextQuizBatch);
                                self.tidyUpQuiz();
                                
                                btnReAttempt.remove();
                                btnSubmitQuiz.show();
                            });
                        }
                        
                        $.each(response.fieldMessages, function (i, n) {
                            var inp = quiz.find('li.' + n.field);
                            inp.addClass('error');
                        });
                    });
                }
                
                modal.modal('show');
            } else if (response.messages) {
                flog('[jquery.module] we have messages..');
                modalTitle.html('Quiz invalid');
                errorText.html('The quiz could not be completed because <b>' + response.messages + '</b>');
                btnDismiss.html('Close');
                
                modal.modal('show');
            } else {
                self.showApology('check your answers');
            }
            
            if (typeof options.onQuizError === 'function') {
                options.onQuizError.call(quiz, quiz, response);
            }
        },
        
        /**
         * returns true if the quiz is complete, otherwise displays appropriate validation
         * messages
         */
        isQuizCompleted: function (e) {
            flog('[jquery.module] isQuizCompleted');
            
            var self = this;
            var options = self.getOptions();
            var quiz = $('form.quiz');
            if (quiz.length === 0) {
                flog('[jquery.module] Quiz is empty, so is complete');
                return true;
            }
            
            if (quiz.hasClass('validated')) {
                flog('[jquery.module] Quiz has been validated, so is complete');
                return true;
            }
            
            if (self.isComplete) {
                flog('[jquery.module] Module is completed, so true');
                return true;
            }
            
            var isQuizPassed = $('.quiz.quiz-passed').length > 0;
            var isBeyondQuiz = (self.getProgressPageIndex() > self.getCurrentPageIndex()) || isQuizPassed;
            if (isBeyondQuiz) {
                flog('[jquery.module] Is beyond quiz, so quiz is completed');
                return true;
            }
            
            // Clear any previous errors
            var errors = quiz.find('.error');
            flog('[jquery.module] Remove prev errors', errors);
            errors.removeClass('error');
            
            // Callback onQuizSubmit
            if (typeof options.onQuizSubmit === 'function') {
                if (!options.onQuizSubmit.call(quiz, quiz)) {
                    return false;
                }
            }
            
            // Check all questions have been answered
            var hasError = false;
            quiz.find('ol.quiz > li').each(function () {
                var li = $(this);
                var inputs = li.find('textarea, input:radio:checked, input:checkbox:checked');
                
                if (inputs.length === 0) {
                    flog('[jquery.module] Found incomplete input', li);
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
                flog('[jquery.module] Quiz check is in progress');
                return false;
            }
            
            quiz.addClass('processing');
            
            // Check the quiz against the database
            var pageName = getFileName(window.location.pathname);
            quiz.find('input[name=quiz]').val(pageName);
            try {
                flog('[jquery.module] Doing check quiz\'s answers');
                
                $.ajax({
                    type: 'POST',
                    url: options.currentUrl,
                    data: quiz.serialize(),
                    dataType: 'json',
                    success: function (response) {
                        quiz.removeClass('processing');
                        
                        if (response && response.status) {
                            flog('[jquery.module] Validating quiz OK', response);
                            
                            self.quizSuccessHandler(quiz, e);
                            
                            if (typeof options.onQuizSuccess === 'function') {
                                options.onQuizSuccess.call(quiz, quiz, response);
                            }
                        } else if (response && response.messages && response.messages[0] && response.messages[0].indexOf('The quiz has already been completed') !== -1) {
                            flog('[jquery.module] The quiz has already been completed!');
                            
                            self.quizSuccessHandler(quiz, e);
                        } else {
                            flog('[jquery.module] Validating quiz is false', response);
                            
                            self.quizErrorHandler(quiz, response, e);
                        }
                    },
                    error: function (response) {
                        quiz.removeClass('processing');
                        flog('[jquery.module] Error when checking quiz', response);
                        self.showApology('check your answers');
                    }
                });
            } catch (e) {
                flog('[jquery.module] Exception in isQuizCompleted', e);
                self.showApology('check your answers');
            }
            return false;
        },
        
        showApology: function (operation) {
            alert('Oh, oops. I\'m really, really, sorry, but I couldnt ' + operation + ' because of some computer-not-behaving thing. Perhaps check your internet connection? If it still doesnt work it would be super nice if you could tell us from the contact page and we\'ll sort it out ASAP - thanks!');
        }
    };
    
})(jQuery);
