var selectedCourse;
var selectedModule;

function initManageCourse(programsUrl, programUrl, courseUrl) {
    initPublishingMenu('manageCourses');
    initModuleEditing(courseUrl);
    orderCourseModuleItem();
    initProgramEditing(programsUrl);
    initCourseEditing(programUrl);
    initActive();
    initCourseModal();
    initCopyCutPaste();
    initCourseModuleSearch();

    if ($('#manage-course').length > 0) {
        $('div.courses-list li > a').pjax('#manage-course', {
            fragment: '#manage-course',
            success: function () {
                flog('done!');
                initActive();
                initModuleEditing();
            }
        });
    }
}

/**
 * Get cut course url from pasteCookie
 * @param pasteCookie
 * @returns {String|Null}
 */
function getCutUrl(pasteCookie) {
    if (pasteCookie.indexOf('|cut') !== -1) {
        return pasteCookie.split('|cut')[0];
    } else {
        return null;
    }
}

function getPasteCookie(type) {
    var cookieName = type === 'module' ? 'pasteModule' : 'pasteCourse';
    var pasteUrl = $.cookie(cookieName);
    var cutUrl;

    if (pasteUrl) {
        if (pasteUrl.indexOf('|cut') !== -1) {
            cutUrl = pasteUrl.split('|cut')[0];
        }
    }

    return {
        pasteUrl: pasteUrl,
        cutUrl: cutUrl
    };
}

function removePasteCookie(type) {
    var cookieName = type === 'module' ? 'pasteModule' : 'pasteCourse';

    $.cookie(cookieName, '', {
        path: '/'
    });
}

function checkCutAndCopiedCookie() {
    flog('checkCutAndCopiedCookie');

    var coursesList = $('#courses-list');
    var modulesList = $('#modules-list');

    var btnPasteCourse = $('.btn-paste-course');
    var btnPasteModule = $('.btn-paste-module');

    var courseCookie = getPasteCookie('course');
    var moduleCookie = getPasteCookie('module');

    if (courseCookie.pasteUrl) {
        flog('Have cut/copied course!', courseCookie.pasteUrl);

        if (!courseCookie.pasteUrl.startsWith(window.location.pathname)) {
            btnPasteCourse.removeClass('hide');
        } else {
            btnPasteCourse.addClass('hide');
        }

        if (courseCookie.cutUrl) {
            flog(courseCookie.cutUrl + ' is cut course');

            coursesList.children('li').each(function () {
                var course = $(this);
                var courseHref = course.children('a').attr('href');

                if (courseHref === courseCookie.cutUrl) {
                    course.addClass('cut');
                    return;
                }
            });
        } else {
            coursesList.children('li.cut').removeClass('cut');
        }
    } else {
        btnPasteCourse.addClass('hide');
        coursesList.children('li.cut').removeClass('cut');
    }

    if (moduleCookie.pasteUrl) {
        flog('Have cut/copied module!', moduleCookie.pasteUrl);

        var activedCourse = coursesList.find('li.active');

        if (activedCourse.length > 0) {
            var activedCourseUrl = activedCourse.children('a').attr('href');

            if (!moduleCookie.pasteUrl.startsWith(activedCourseUrl)) {
                btnPasteModule.removeClass('hide');
            } else {
                btnPasteModule.addClass('hide');
            }
        } else {
            btnPasteModule.addClass('hide');
        }

        if (moduleCookie.cutUrl) {
            flog(moduleCookie.cutUrl + ' is cut module');

            modulesList.children('li').each(function () {
                var module = $(this);
                var moduleHref = module.children('a').attr('href');

                if (moduleHref === moduleCookie.cutUrl) {
                    module.addClass('cut');
                    return;
                }
            });
        } else {
            modulesList.children('li.cut').removeClass('cut');
        }
    } else {
        btnPasteModule.addClass('hide');
        modulesList.children('li.cut').removeClass('cut');
    }
}

function saveUrlInCookie(url, type, isCut) {
    var cookieName = type === 'module' ? 'pasteModule' : 'pasteCourse';
    var cookieValue = isCut ? url + '|cut' : url;

    $.cookie(cookieName, cookieValue, {
        path: '/',
        expires: 30
    });
}

function initCopyCutPaste() {
    checkCutAndCopiedCookie();

    $('.btn-paste-course').on('click', function (e) {
        e.preventDefault();

        var courseCookie = getPasteCookie('course');
        flog("courseCookie", courseCookie);
        var oldUrl = courseCookie.cutUrl || courseCookie.pasteUrl;
        var courseId = oldUrl.replace(/^.+\/([^\/]+)\/$/, '$1');
        if($(this).attr('newCourseId')){
            courseId = $(this).attr('newCourseId');
            flog('new course name exists', courseId);
            $(this).removeAttr('newCourseId');
        }
        var oldProgram = getFolderPath(oldUrl);
        var newProgram = getProgramPath();
        if(!newProgram){
            alert('Cannot get current program');
            return false;
        }
        var newUrl = newProgram + '/' + courseId + '/';

        flog("CutCopy", oldUrl, newUrl);

        var isCut = false;
        if (courseCookie.cutUrl) {
            isCut = true;
        }
        checkExists(newUrl, {
            exists: function () {
                flog("course name exists", courseId);
                var newCousrseId = prompt('There is an existing course with name "'+ courseId +'". Please change course name to contiune?', courseId);
                if (newCousrseId && newCousrseId!==courseId) {
                    $('.btn-paste-course').attr('newCourseId', newCousrseId).trigger('click');
                } else {
                    Msg.warning('Could not paste course: Course name is still remaining the same.');
                }
            },
            notExists: function(){
                doAction(oldUrl, newUrl, isCut, function () {
                    removePasteCookie('course');
                    $('#courses-list').reloadFragment({
                        whenComplete: function () {
                            checkCutAndCopiedCookie();
                        }
                    });
                    $('#modules-list').reloadFragment();
                    var msg = (isCut ? 'Cut' : 'Copied');
                    msg += ' course <b>' + courseId + '</b> from program <b>' + oldProgram + '</b> to program <b>' + newProgram + '</b> successfully!'
                    Msg.success(msg);

                });
            }
        })

    });

    $('.btn-paste-module').on('click', function (e) {
        e.preventDefault();

        var moduleCookie = getPasteCookie('module');
        var oldUrl = moduleCookie.cutUrl || moduleCookie.pasteUrl;
        var moduleId = oldUrl.replace(/^.+\/([^\/]+)\/$/, '$1');
        if($(this).attr('newModuleId')){
            moduleId = $(this).attr('newModuleId');
            flog('new module name exists', moduleId);
            $(this).removeAttr('newModuleId');
        }
        var newUrl = $('#courses-list').find('li.active').children('a').attr('href') + moduleId + '/';

        var isCut = false;
        if (moduleCookie.cutUrl) {
            isCut = true;
        }

        checkExists(newUrl, {
            exists: function () {
                flog("module name exists", moduleId);
                var newModuleId = prompt('There is an existing module with name "'+ moduleId +'". Please change module name to continue.', moduleId);
                if (newModuleId && newModuleId!==moduleId) {
                    $('.btn-paste-module').attr('newModuleId', newModuleId).trigger('click');
                } else {
                    Msg.warning('Could not paste module: Module name is still remaining the same.');
                }
            },
            notExists: function(){
                doAction(oldUrl, newUrl, isCut, function () {
                    removePasteCookie('course');
                    $('#courses-list').reloadFragment({
                        whenComplete: function () {
                            checkCutAndCopiedCookie();
                        }
                    });
                    $('#modules-list').reloadFragment();
                    var oldCourseId = getFileName(oldUrl);
                    var newCourseId = getFileName(newUrl);
                    var msg = (isCut ? 'Cut' : 'Copied');
                    msg += ' module <b>' + moduleId + '</b> from course <b>' + oldCourseId + '</b> to course <b>' + newCourseId + '</b> successfully!';
                    Msg.success(msg);
                    checkCutAndCopiedCookie();
                });
            }
        });
    });
}

function doAction(oldUrl, newUrl, isCut, ondone) {
    if (isCut) {
        moveFolder(oldUrl, newUrl, ondone);
    } else {
        copyFolder(oldUrl, newUrl, ondone);
    }
}

function initCourseModal() {
    var modal = $('#courseModal');

    initFuseModal(modal, function () {
        initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow'); // disable autogrow
    });
}

function initModuleEditing(courseUrl) {
    flog('initModuleEditing', courseUrl);

    var modal = $('#moduleModal');
    var form = modal.find('form');
    form.attr('action', courseUrl); // always post to the course, ie for create/edit modal

    var modulesList = $('#modules-list');
    var moduleWrapper = $('div.modules-wrapper');

    form.forms({
        onSuccess: function (resp) {
            flog('done save module', resp);
            var href = resp.nextHref;
            var oldCode = form.find('input[name=originalModuleName]').val();
            var updatedHref = courseUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog('changed a path that affects current page so reload');
                window.location.href = href;
                return;
            }

            modulesList.reloadFragment();

            modal.modal('hide');
        }
    });

    moduleWrapper.on('click', '.btn-add-module', function (e) {
        e.preventDefault();

        if ($('#courses-list').children().length === 0) {
            Msg.error('Please create your first course before creating any modules', 5000);

            return false;
        }

        showNewModule(form, modal);
    });

    // Event for Delete button
    modulesList.on('click', '.btn-delete-module', function (e) {
        e.preventDefault();
        li = $(this).parents('li.module');
        var href = $(e.target).closest('a').attr('href');
        var name = getFileName(href);
        flog('click delete module', li, href);
        confirmDelete(href, name, function () {
            li.remove();
            var currentHref = window.location.pathname;
            flog('current', currentHref, 'href=', href);
            if (currentHref.startsWith(href)) {
                window.location.href = courseUrl;
            }
        });
    });

    // Event for Edit button
    modulesList.on('click', '.btn-edit-module', function (e) {
        e.preventDefault();
        li = $(this).parents('li.module');
        flog('click edit module', li);
        var href = li.find('> a').attr('href');
        showEditModule(li, href, form, modal);
    });

    moduleWrapper.on('click', '.btn-duplicate-module', function (e) {
        e.preventDefault();

        duplicateModule($(this).parents('li.module'));
    });

    moduleWrapper.on('click', '.btn-add-splitter', function (e) {
        e.preventDefault();

        $(this).closest('li.module').after(
                '<li class="module splitter clearfix">' +
                '<aside class="pull-right">' +
                '<div class="btn-group btn-group-sm">' +
                '<button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">' +
                '<i class="fa fa-cog"></i>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                '<li><a href="" class="btn-delete-splitter">Delete splitter</a></li>' +
                '</ul>' +
                '</div>' +
                '</aside>' +
                '<span>Level Splitter</span>' +
                '</li>'
                );

        saveModules();
    });

    moduleWrapper.on('click', '.btn-delete-splitter', function (e) {
        e.preventDefault();

        var li = $(this).parents('li.splitter');

        flog('Delete', li);
        li.remove();
        saveModules();
    });

    modulesList.on('click', '.btn-copy-module', function (e) {
        e.preventDefault();

        var module = $(this).closest('.module');
        var moduleUrl = module.children('a').attr('href');

        saveUrlInCookie(moduleUrl, 'module');
        checkCutAndCopiedCookie();
    });

    modulesList.on('click', '.btn-cut-module', function (e) {
        e.preventDefault();

        var module = $(this).closest('.module');
        var moduleUrl = module.children('a').attr('href');

        saveUrlInCookie(moduleUrl, 'module', true);
        checkCutAndCopiedCookie();
    });

    var cont = $('section.Content');
    $('div.modules-wrapper ul').sortable({
        items: '> li',
        axis: 'y',
        sort: function () {
            if (cont.hasClass('ajax-loading')) {
                return false;
            }
            $(this).removeClass('ui-state-default');
        },
        update: function () {
            flog('module change order');
            saveModules();
        }
    });
    flog('done init module sorting');
}

function showNewModule(form, modal) {
    flog('showNewModule', form, modal);
    resetForm(form);
    form.find('input[name=originalModuleName]').val(''); // set hidden name field to the resource name
    modal.modal('show');
}

function showEditModule(liModule, moduleHref, form, modal) {
    flog('showEditModule, moduleHref=', moduleHref);
    selectedModule = liModule;

    var modName = getFileName(moduleHref);
    resetForm(form);
    form.find('input[name=originalModuleName]').val(modName); // set hidden name field to identify the resource name
    form.find('input[name=moduleName]').val(modName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: moduleHref + '_DAV/PROPFIND?fields=milton:title,milton:notes&depth=0',
        dataType: 'json',
        success: function (resp) {
            if (resp) {
                var p = resp[0];
                flog('set fields', p);
                form.find('input[name=moduleTitle]').val(p.title);
                form.find('textarea[name=moduleNotes]').val(p.notes);
            }
            modal.modal('show');
        },
        error: function (resp) {
            Msg.error('Sorry couldnt get module data');
        }
    });
}

function initCourseEditing(programUrl) {
    flog('initCourseEditing', programUrl);
    var modal = $('#courseModal');
    var form = modal.find('form');
    form.attr('action', programUrl); // always post to he program, ie for create/edit course

    var courseWrapper = $('.courses-wrapper');
    var coursesList = $('#courses-list');

    form.forms({
        onSuccess: function (resp) {
            flog('done save course', resp);
            var href = resp.nextHref;
            var oldCode = form.find('input[name=originalCourseName]').val();
            var updatedHref = programUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog('changed a path that affects current page so reload');
                window.location.href = href;
                return;
            }

            coursesList.reloadFragment();

            closeFuseModal(modal);
        }
    });

    courseWrapper.on('click', '.btn-add-course', function (e) {
        e.preventDefault();
        showNewCourse(form, modal);
    });

    coursesList.on('click', '.btn-add-splitter', function (e) {
        e.preventDefault();

        $(this).closest('li.course').after(
                '<li class="course splitter clearfix">' +
                '<aside class="pull-right">' +
                '<div class="btn-group btn-group-sm">' +
                '<button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">' +
                '<i class="fa fa-cog"></i>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                '<li><a href="" class="btn-delete-splitter">Delete splitter</a></li>' +
                '</ul>' +
                '</div>' +
                '</aside>' +
                '<span>Level Splitter</span>' +
                '</li>'
                );

        saveCourses();
    });

    coursesList.on('click', '.btn-delete-splitter', function (e) {
        e.preventDefault();

        var li = $(this).parents('li.splitter');

        flog('Delete', li);
        li.remove();
        saveCourses();
    });

    // Event for Delete button
    coursesList.on('click', '.btn-delete-course', function (e) {
        e.preventDefault();
        li = $(this).parents('li.course');
        var href = $(e.target).closest('a').attr('href');
        var name = getFileName(href);
        flog('click delete course', li, href);
        confirmDelete(href, name, function () {
            li.remove();
            var currentHref = window.location.pathname;
            flog('current', currentHref, 'href=', href);
            if (currentHref.startsWith(href)) {
                window.location.href = programUrl;
            }
        });
    });

    // Event for Edit button
    coursesList.on('click', '.btn-edit-course', function (e) {
        e.preventDefault();
        li = $(this).parents('li.course');
        flog('click edit course', li);
        var courseHref = li.find('> a').attr('href');
        showEditCourse(li, courseHref, form, modal);
    });

    coursesList.on('click', '.btn-copy-course', function (e) {
        e.preventDefault();

        var course = $(this).closest('.course');
        var courseUrl = course.children('a').attr('href');

        saveUrlInCookie(courseUrl, 'course');
        checkCutAndCopiedCookie();
    });

    coursesList.on('click', '.btn-cut-course', function (e) {
        e.preventDefault();

        var course = $(this).closest('.course');
        var courseUrl = course.children('a').attr('href');

        saveUrlInCookie(courseUrl, 'course', true);
        checkCutAndCopiedCookie();
    });
}

function showNewCourse(form, modal) {
    resetForm(form);
    form.find('input[name=originalCourseName]').val(''); // set hidden name field to the resource name
    form.find('#courseDescription').val('');
    openFuseModal(modal);
}

function showEditCourse(liCourse, courseHref, form, modal) {
    flog('showEditCourse, courseHref=', courseHref);
    selectedCourse = liCourse;

    var courseName = getFileName(courseHref);
    resetForm(form);
    form.find('input[name=originalCourseName]').val(courseName); // set hidden name field to identify the resource name
    form.find('input[name=courseName]').val(courseName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: courseHref + '_DAV/PROPFIND?fields=milton:title,milton:body,milton:notes,milton:itemType,milton:searchCategory,milton:searchTags&depth=0',
        dataType: 'json',
        success: function (resp) {
            if (resp) {
                var p = resp[0];
                flog('set fields', p);
                form.find('input[name=courseTitle]').val(p.title);
                form.find('input[name=itemType]').val(p.itemType);
                form.find('input[name=category]').val(p.searchCategory);
                form.find('input[name=tags]').val(p.searchTags);
                form.find('textarea[name=courseNotes]').val(p.notes);
                form.find('textarea[name=courseDescription]').val(p.body);

            }
            openFuseModal(modal);
        },
        error: function (resp) {
            Msg.error('Sorry couldnt get course data');
        }
    });
}

function initProgramEditing(programsUrl) {
    var modal = $('#programModal');
    var form = modal.find('form');
    var programsList = $('ul#programs-list');
    flog('initProgramEditing', form, programsUrl);

    form.attr('action', programsUrl);
    form.forms({
        onSuccess: function (resp) {
            flog('done save program', resp);
            var href = resp.nextHref;
            var oldCode = form.find('input[name=originalProgramName]').val();
            var updatedHref = programsUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog('changed a path that affects current page so reload');
                window.location.href = href;
                return;
            }

            programsList.reloadFragment();

            modal.modal('hide');
        }
    });

    programsList.on('click', '.btn-add-program', function (e) {
        e.preventDefault();
        showNewProgram(form, modal);
    });

    // Event for Delete button
    programsList.on('click', '.btn-delete-program', function (e) {
        e.preventDefault();
        li = $(this).parents('li.program');
        var programHref = $(e.target).closest('a').attr('href');
        var programName = getFileName(programHref);
        flog('click delete program', li, programHref);
        confirmDelete(programHref, programName, function () {
            li.remove();
            var currentHref = window.location.pathname;
            flog('current', currentHref, 'programHref=', programHref);
            if (currentHref.startsWith(programHref)) {
                window.location.href = programsUrl;
            }
        });
    });

    // Event for Edit button
    programsList.on('click', '.btn-edit-program', function (e) {
        e.preventDefault();
        li = $(this).parents('li.program');
        flog('click edit program', li);
        var programHref = li.find('> a').attr('href');
        showEditProgram(programHref, form, modal);
    });
}

function showNewProgram(form, modal) {
    resetForm(form);
    form.find('input[name=originalProgramName]').val(''); // set hidden name field to the resource name
    modal.modal('show');
}

function showEditProgram(programHref, form, modal) {
    //programHref = getFolderPath(programHref) + '/';
    var programName = getFileName(programHref);
    resetForm(form);
    form.find('input[name=originalProgramName]').val(programName); // set hidden name field to identify the resource name
    form.find('input[name=programName]').val(programName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: programHref + '_DAV/PROPFIND?fields=milton:title,milton:body,milton:itemType,milton:searchCategory,milton:searchTags&depth=0',
        dataType: 'json',
        success: function (resp) {
            if (resp) {
                var p = resp[0];
                flog('set fields', p);
                form.find('input[name=programTitle]').val(p.title);
                form.find('input[name=itemType]').val(p.itemType);
                form.find('input[name=category]').val(p.searchCategory);
                form.find('input[name=tags]').val(p.searchTags);
                form.find('textarea').val(p.body);
            }
            modal.modal('show');
        },
        error: function (resp) {
            Msg.error('Sorry couldnt get program data');
        }
    });
}

function saveModules() {
    var modules = $('ul.modules-list > li.module');

    flog('Save', selectedCourse, modules);
    var level = 1;
    var order = 0;
    var data = {};

    modules.each(function () {
        var module = $(this);

        flog('save node: ', module);
        if (module.hasClass('splitter')) {
            level++;
            flog('found splitter', level);
        } else {
            order++;
            var name = module.attr('id');
            var title = $($('> span', module)[0]).text();
            if (!name) {
                name = $.URLEncode(title);
                module.attr('id', name);
                flog('set name', name, module);
            }
            data['name-' + order] = name;
            data['level-' + order] = level;
            flog('added data', data);
        }
    });

    flog('saveModules', data);
    var cont = $('.content');
    cont.addClass('ajax-loading');

    $.ajax({
        type: 'POST',
        url: '',
        data: data,
        dataType: 'json',
        success: function (resp) {
            cont.removeClass('ajax-loading');
            flog('saved module', resp);
        },
        error: function (resp) {
            cont.removeClass('ajax-loading');
            flog('Sorry couldnt update module');
        }
    });

}

function saveCourses() {
    var courses = $('ul.courses-list > li.course');

    flog('Save', selectedCourse, courses);
    var level = 1;
    var order = 0;
    var data = {
        saveCourses: ''
    };

    courses.each(function () {
        var course = $(this);

        flog('save node: ', course);

        if (course.hasClass('splitter')) {
            level++;
            flog('found splitter', level);
        } else {
            order++;
            var href = course.find('> a').attr('href');
            flog('href', href);
            var name = getFileName(href);
            flog('name', name);
            data['name-' + order] = name;
            data['level-' + order] = level;
            flog('added data', data);
        }
    });

    flog('saveCourses', data);
    var cont = $('.content');
    cont.addClass('ajax-loading');
    $.ajax({
        type: 'POST',
        url: '../',
        data: data,
        dataType: 'json',
        success: function (resp) {
            cont.removeClass('ajax-loading');
            flog('saved course', resp);
        },
        error: function (resp) {
            cont.removeClass('ajax-loading');
            flog('Sorry couldnt update course');
        }
    });
}

function orderCourseModuleItem() {
    $('div.courses-wrapper > ul.courses-list').sortable({
        items: '> li.course',
        axis: 'y',
        sort: function () {
            $(this).removeClass('ui-state-default');
        },
        update: function () {
            flog('course change order');
            saveCourses();
        }
    });

    $('div.courses-wrapper > ul.courses-list > li.course').each(function (i) {
        $(this).attr({
            'data-course': i + 1
        }).find('div.modules-wrapper')
                .attr('data-course', i + 1)
                .find('ul > li')
                .not('.splitter')
                .each(function (idx) {
                    $(this).attr('data-module', idx + 1);
                });
    });
}

function duplicateModule(moduleLi) {
    var moduleHref = moduleLi.attr('id');
    if (!confirm('This will create a copy of module ' + moduleHref + ' in the current course. Would you like to continue?')) {
        return;
    }

    $.ajax({
        type: 'POST',
        url: moduleHref,
        data: {
            duplicate: true
        },
        dataType: 'json',
        success: function (resp) {
            window.location.reload();
        },
        error: function (resp) {
            Msg.error('Sorry couldnt duplicate the module');
        }
    });
}

function initActive() {
    $('ul.courses-list > li.active').removeClass('active');
    var active = $('ul.courses-list > li > a').filter(function () {
        return $(this).attr('href') === window.location.pathname;
    });
    active.closest('li').addClass('active');
}

function checkExists(href, config) {
    $.ajax({
        type: 'HEAD',
        url: href,
        success: function (resp) {
            flog("success", resp);
            config.exists();
        },
        error: function (resp) {
            flog("error", resp);
            config.notExists();
        }
    });
}

function getProgramPath(){
    var path = window.location.pathname;
    var indicator = '/programs/';
    var arr = path.split(indicator);
    if(arr.length>1){
        flog('pathname contains courseId', path);
        var prgArr = arr[1].split('/');
        if(prgArr.length>0){
            return arr[0] + indicator + prgArr[0];
        }
    }
    return '';
}

function initCourseModuleSearch() {
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });
    $('.courseSearch input').on('input', function () {
        var that = this;
        typewatch(function () {
            var panel = $(that).parents('.panel');
            var list = panel.find('li.course, li.module').not('.splitter');
            if (that.value){
                list.addClass('hide');
                list.each(function () {
                    var a = $(this).find('>a');
                    if (a.text().toLowerCase().indexOf(that.value.toLowerCase()) != -1){
                        $(this).removeClass('hide');
                    }
                });
            } else {
                list.removeClass('hide');
            }
        },300);


    })
}