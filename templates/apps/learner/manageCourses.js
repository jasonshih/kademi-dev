var selectedCourse;
var selectedModule;

function initManageCourse(programsUrl, programUrl, courseUrl) {
    initPublishingMenu("manageCourses");
    initModuleEditing(courseUrl);
    orderCourseModuleItem();
    initProgramEditing(programsUrl);
    initCourseEditing(programUrl);
    initActive();

    if ($("#manage-course").length > 0) {
        $('div.courses-list li > a').pjax('#manage-course', {
            fragment: "#manage-course",
            success: function() {
                flog("done!");
                initActive();
                initModuleEditing();
            }
        });
    }
}

function initModuleEditing(courseUrl) {
    flog("initModuleEditing", courseUrl);
    
    var modal = $("#moduleModal");
    var form = modal.find("form");
    form.attr("action", courseUrl); // always post to he course, ie for create/edit modal

    var modulesList = $(".modules-list");
    var moduleWrapper = $("div.modules-wrapper");    

    form.forms({
        callback: function(resp) {
            flog("done save module", resp);
            var href = resp.nextHref;
            var oldCode = form.find("input[name=originalModuleName]").val();
            var updatedHref = courseUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog("changed a path that affects current page so reload");
                window.location.href = href;
                return;
            }
            var code = form.find("input[name=moduleName]").val();
            var title = form.find("input[name=moduleTitle]").val();

            var li;
            if (oldCode === "") {
                flog("display new module")
                // nextHref means this is a new resource, so add it to the list
                li = $(
                                '<li id="a1" data-author-notes="" class="module clearfix odd">' +
                                '    <aside class="pull-right">' +
                                '        <div class="btn-group btn-group-sm">' +
                                '            <button class="btn btn-sm btn-warning btn-move-module" type="button"><i class="glyphicon glyphicon-sort"></i></button>' +
                                '            <button data-toggle="dropdown" class="btn btn-sm btn-success dropdown-toggle" type="button">' +
                                '                <i class="fa fa-cog"></i>' +
                                '            </button>' +
                                '            <ul role="menu" class="dropdown-menu pull-right">' +
                                '                <li class="odd"><a role="button" class="btn-edit-module" href="a1">Edit module</a></li>' +
                                '                <li class="even"><a href="a1">Manage this module</a></li>' +
                                '                <li class="odd"><a target="_blank" href="a1?goto=">View module</a></li>' +
                                '                <li class="even"><a class="btn-add-splitter" href="#">Add splitter below</a></li>' +
                                '                <li class="odd"><a class="btn-duplicate-module" href="#">Duplicate</a></li>' +
                                '                <li class="divider even"></li>' +
                                '                <li class="odd"><a href="a1" class="btn-delete-module">Delete this module</a></li>' +
                                '            </ul>' +
                                '        </div>' +
                                '    </aside>' +
                                '    <a>EL MODULO NUMERO ASTA</a>' +
                                '</li>'
                        );
                modulesList.prepend(li);
            } else {
                var sel = "#" + oldCode;
                li = modulesList.find(sel);
                flog("update module", sel, li);
            }
            var newId = code;
            li.attr("id", newId);
            li.find("a").attr("href", href, title);
            li.find("> a").text(code + " - " + title);

            modal.modal('hide');
        }
    });

    moduleWrapper.on('click', '.btn-add-module', function(e) {
        e.preventDefault();
        showNewModule(form, modal);
    });

    // Event for Delete button
    modulesList.on("click", ".btn-delete-module", function(e) {
        e.preventDefault();
        li = $(this).parents("li.module");
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        flog("click delete module", li, href);
        confirmDelete(href, name, function() {
            li.remove();
            var currentHref = window.location.pathname;
            flog("current", currentHref, "href=", href);
            if (currentHref.startsWith(href)) {
                window.location.href = courseUrl;
            }
        });
    });

    // Event for Edit button
    modulesList.on("click", ".btn-edit-module", function(e) {
        e.preventDefault();
        li = $(this).parents("li.module");
        flog("click edit module", li);
        var href = li.find("> a").attr("href");
        showEditModule(li, href, form, modal);
    });
        

    moduleWrapper.on('click', '.btn-duplicate-module', function(e) {
        e.preventDefault();

        duplicateModule($(this).parents('li.module'));
    });

    moduleWrapper.on('click', '.btn-add-splitter', function(e) {
        e.preventDefault();

        $(this).parents('li.module').after(
                '<li class="splitter clearfix">' +
                '<aside class="pull-right">' +
                '<div class="btn-group btn-group-sm">' +
                '<button type="button" class="btn btn-sm btn-warning btn-move-splitter"><i class="glyphicon glyphicon-sort"></i></button>' +
                '<button type="button" class="btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">' +
                '<i class="fa fa-cog"></i>' +
                '</button>' +
                '<ul class="dropdown-menu pull-right" role="menu">' +
                '<li><a href="${module.name}" class="btn-delete-splitter">Delete splitter</a></li>' +
                '</ul>' +
                '</div>' +
                '</aside>' +
                '<span>Level Splitter</span>' +
                '</li>'
                );

        saveModules();
    });

    
    moduleWrapper.on('click', '.btn-delete-splitter', function(e) {
        e.preventDefault();

        var li = $(this).parents('li.splitter');

        flog("Delete", li)
        li.remove();
        saveModules();
    });

    var cont = $("section.Content");
    $("div.modules-wrapper ul").sortable({
        items: "> li",
        sort: function() {
            if (cont.hasClass("ajax-loading")) {
                return false;
            }
            $(this).removeClass("ui-state-default");
        },
        update: function() {
            flog("module change order");
            saveModules();
        }
    });
    flog("done init module sorting");
}

function showNewModule(form, modal) {
    flog("showNewModule", form, modal);
    resetForm(form);
    form.find("input[name=originalModuleName]").val(""); // set hidden name field to the resource name
    modal.modal('show');
}

function showEditModule(liModule, moduleHref, form, modal) {
    flog("showEditModule, moduleHref=", moduleHref);
    selectedModule = liModule;

    var modName = getFileName(moduleHref);
    resetForm(form);
    form.find("input[name=originalModuleName]").val(modName); // set hidden name field to identify the resource name
    form.find("input[name=moduleName]").val(modName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: moduleHref + "_DAV/PROPFIND?fields=milton:title,milton:notes&depth=0",
        dataType: "json",
        success: function(resp) {
            if (resp) {
                var p = resp[0];
                flog("set fields", p);
                form.find("input[name=moduleTitle]").val(p.title);
                form.find("textarea[name=moduleNotes]").val(p.notes);
            }
            modal.modal('show');
        },
        error: function(resp) {
            alert("Sorry couldnt get module data");
        }
    });
}




function initCourseEditing(programUrl) {
    flog("initCourseEditing", programUrl);
    var modal = $("#courseModal");
    var form = modal.find("form");
    form.attr("action", programUrl); // always post to he program, ie for create/edit course

    var coursesList = $(".courses-list");

    form.forms({
        callback: function(resp) {
            flog("done save course", resp);
            var href = resp.nextHref;
            var oldCode = form.find("input[name=originalCourseName]").val();
            var updatedHref = programUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog("changed a path that affects current page so reload");
                window.location.href = href;
                return;
            }
            var code = form.find("input[name=courseName]").val();
            var title = form.find("input[name=courseTitle]").val();

            var li;
            if (oldCode === "") {
                flog("display new course")
                // nextHref means this is a new resource, so add it to the list
                li = $(
                        '<li class="course clearfix active odd" data-course="1" id="course-">' +
                        '        <aside class="pull-right">' +
                        '            <div class="btn-group btn-group-sm">' +
                        '                <button title="Move up or down" class="btn btn-sm btn-warning btn-move-course" type="button"><i class="glyphicon glyphicon-sort"></i></button>' +
                        '                <button data-toggle="dropdown" class="btn btn-sm btn-success dropdown-toggle" type="button">' +
                        '                    <i class="fa fa-cog"></i>' +
                        '                </button>' +
                        '                <ul role="menu" class="dropdown-menu pull-right">' +
                        '                    <li class="odd"><a href="#" class="btn-edit-course">Edit details</a></li>' +
                        '                    <li class="divider even"></li>' +
                        '                    <li class="odd"><a href="#" class="btn-delete-course">Delete this course</a></li>' +
                        '                </ul>' +
                        '            </div>' +
                        '        </aside>' +
                        '        <a href="#">DA NAME</a>' +
                        '    </li>'
                        );
                coursesList.prepend(li);
            } else {
                var sel = "#course-" + oldCode;
                li = coursesList.find(sel);
            }
            var newId = li.attr("id") + code;
            li.attr("id", newId);
            li.find("a").attr("href", href)
            li.find("> a").text(title);

            modal.modal('hide');
        }
    });
    

    $(".courses-wrapper").on('click', '.btn-add-course', function(e) {
        e.preventDefault();
        showNewCourse(form, modal);
    });

    // Event for Delete button
    coursesList.on("click", ".btn-delete-course", function(e) {
        e.preventDefault();
        li = $(this).parents("li.course");
        var href = $(e.target).closest("a").attr("href");
        var name = getFileName(href);
        flog("click delete course", li, href);
        confirmDelete(href, name, function() {
            li.remove();
            var currentHref = window.location.pathname;
            flog("current", currentHref, "href=", href);
            if (currentHref.startsWith(href)) {
                window.location.href = programUrl;
            }
        });
    });

    // Event for Edit button
    coursesList.on("click", ".btn-edit-course", function(e) {
        e.preventDefault();
        li = $(this).parents("li.course");
        flog("click edit course", li);
        var courseHref = li.find("> a").attr("href");
        showEditCourse(li, courseHref, form, modal);
    });
}



function showNewCourse(form, modal) {
    resetForm(form);
    form.find("input[name=originalCourseName]").val(""); // set hidden name field to the resource name
    modal.modal('show');
}

function showEditCourse(liCourse, courseHref, form, modal) {
    flog("showEditCourse, courseHref=", courseHref);
    selectedCourse = liCourse;

    var courseName = getFileName(courseHref);
    resetForm(form);
    form.find("input[name=originalCourseName]").val(courseName); // set hidden name field to identify the resource name
    form.find("input[name=courseName]").val(courseName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: courseHref + "_DAV/PROPFIND?fields=milton:title,milton:body,milton:notes&depth=0",
        dataType: "json",
        success: function(resp) {
            if (resp) {
                var p = resp[0];
                flog("set fields", p);
                form.find("input[name=courseTitle]").val(p.title);
                form.find("textarea[name=courseNotes]").val(p.notes);
                form.find("textarea[name=courseDescription]").val(p.body);

            }
            modal.modal('show');
        },
        error: function(resp) {
            alert("Sorry couldnt get course data");
        }
    });
}

function initProgramEditing(programsUrl) {
    var modal = $("#programModal");
    var form = modal.find("form");
    var programsList = $("ul.programs-list");
    flog("initProgramEditing", form, programsUrl);

    form.attr("action", programsUrl);
    form.forms({
        callback: function(resp) {
            flog("done save program", resp);
            var href = resp.nextHref;
            var oldCode = form.find("input[name=originalProgramName]").val();
            var updatedHref = programsUrl + oldCode;
            var affectsMe = window.location.pathname.startsWith(updatedHref);
            if (affectsMe) {
                flog("changed a path that affects current page so reload");
                window.location.href = href;
                return;
            }
            var code = form.find("input[name=programName]").val();
            var title = form.find("input[name=programTitle]").val();

            var li;
            if (oldCode === "") {
                flog("display new program")
                // nextHref means this is a new resource, so add it to the list
                li = $(
                        '<li class="program clearfix list-item" id="prog-">' +
                        '<aside class="list-item-controller">' +
                        '    <a class="btn btn-xs btn-success btn-edit-program" title="Edit program" href="#"><i class="glyphicon glyphicon-edit"></i></a>' +
                        '    <a class="btn btn-xs btn-danger btn-delete-program" title="Delete program" href="#"><i class="glyphicon glyphicon-remove"></i></a>' +
                        '</aside>' +
                        '<a href="#">title goes ehre</a>' +
                        '</li>');
                programsList.prepend(li);
            } else {
                var sel = "#prog-" + oldCode;
                li = programsList.find(sel);
                flog("get old li", sel, li)
            }
            var newId = li.attr("id") + code;
            li.attr("id", newId);
            li.find("a").attr("href", href)
            li.find("> a").text(title);

            modal.modal('hide');
        }
    });

    programsList.on('click', '.btn-add-program', function(e) {
        e.preventDefault();
        showNewProgram(form, modal);

    });

    // Event for Delete button
    programsList.on("click", ".btn-delete-program", function(e) {
        e.preventDefault();
        li = $(this).parents("li.program");
        var programHref = $(e.target).closest("a").attr("href");
        var programName = getFileName(programHref);
        flog("click delete program", li, programHref);
        confirmDelete(programHref, programName, function() {
            li.remove();
            var currentHref = window.location.pathname;
            flog("current", currentHref, "programHref=", programHref);
            if (currentHref.startsWith(programHref)) {
                window.location.href = programsUrl;
            }
        });
    });

    // Event for Edit button
    programsList.on("click", ".btn-edit-program", function(e) {
        e.preventDefault();
        li = $(this).parents("li.program");
        flog("click edit program", li);
        var programHref = li.find("> a").attr("href");
        showEditProgram(programHref, form, modal);
    });
}

function showNewProgram(form, modal) {
    resetForm(form);
    form.find("input[name=originalProgramName]").val(""); // set hidden name field to the resource name
    modal.modal('show');
}

function showEditProgram(programHref, form, modal) {
    //programHref = getFolderPath(programHref) + "/";
    var programName = getFileName(programHref);
    resetForm(form);
    form.find("input[name=originalProgramName]").val(programName); // set hidden name field to identify the resource name
    form.find("input[name=programName]").val(programName);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: programHref + "_DAV/PROPFIND?fields=milton:title,milton:body&depth=0",
        dataType: "json",
        success: function(resp) {
            if (resp) {
                var p = resp[0];
                flog("set fields", p);
                form.find("input[name=programTitle]").val(p.title);
                form.find("textarea").val(p.body);
            }
            modal.modal('show');
        },
        error: function(resp) {
            alert("Sorry couldnt get program data");
        }
    });
}

function saveModules() {
    flog("Save", selectedCourse, $("#ul.modules-list > li.module"));
    var level = 1;
    var order = 0;
    var data = new Object();
    $("ul.modules-list > li").each(function(i, li) {
        var li = $(li);
        flog("save node: ", li);
        if (li.hasClass("splitter")) {
            level++;
            flog("found splitter", level);
        } else {
            order++;
            var name = li.attr("id");
            var title = $($("> span", li)[0]).text();
            if (!name) {
                name = $.URLEncode(title);
                li.attr("id", name);
                flog("set name", name, li);
            }
            data["name-" + order] = name;
            data["level-" + order] = level;
            flog("added data", data);
        }
    });
    flog("saveModules", data);
    var cont = $(".content");
    cont.addClass("ajax-loading");
    $.ajax({
        type: 'POST',
        url: "",
        data: data,
        dataType: "json",
        success: function(resp) {
            cont.removeClass("ajax-loading");
            flog("saved module", resp);
        },
        error: function(resp) {
            cont.removeClass("ajax-loading");
            flog("Sorry couldnt update module");
        }
    });

}

function orderCourseModuleItem() {
    $("div.courses-wrapper > ul.courses-list").sortable({
        items: "> li.course",
        sort: function() {
            $(this).removeClass("ui-state-default");
        },
        update: function() {
            console.flog("course change order");
            // TODO: edit here
        }
    });

    $("div.courses-wrapper > ul.courses-list > li.course").each(function(i) {
        $(this).attr({
            "data-course": i + 1
        }).find("div.modules-wrapper")
                .attr("data-course", i + 1)
                .find("ul > li")
                .not(".splitter")
                .each(function(idx) {
                    $(this).attr("data-module", idx + 1);
                });
    });
}


function maxOrderCourse() {
    var order = [];
    $("div.courses-wrapper > ul > li").each(function() {
        order.push($(this).attr("data-course"));
    });

    order.sort().reverse();

    return (parseInt(order[0]) + 1);
}

function maxOrderModule() {
    var order = [];
    $("div.modules-wrapper ul.modules-list li.module").each(function() {
        order.push($(this).attr("data-course"));
    });

    order.sort().reverse();

    return (parseInt(order[0]) + 1);
}

function maxOrderProgram() {
    var order = [];
    $("ul.programs-list li.program").each(function() {
        order.push($(this).attr("data-program"));
    });

    order.sort().reverse();

    return (parseInt(order[0]) + 1);
}

function validateSimpleChars(val) {
    if (val.length > 6) {
        return "Please enter a code of no more then 6 characters";
    }
    var pattern = new RegExp("^[a-zA-Z0-9_\.]+$");
    if (!pattern.test(val)) {
        return "Please use only letters, numbers and underscores";
    }
    return null;
}

function duplicateModule(moduleLi) {
    var moduleHref = moduleLi.attr("id");
    if (!confirm("This will create a copy of module " + moduleHref + " in the current course. Would you like to continue?")) {
        return;
    }

    $.ajax({
        type: 'POST',
        url: moduleHref,
        data: {
            duplicate: true
        },
        dataType: "json",
        success: function(resp) {
            window.location.reload();
        },
        error: function(resp) {
            alert("Sorry couldnt duplicate the module");
        }
    });
}

function initActive() {
    $("ul.courses-list > li.active").removeClass("active");
    var active = $("ul.courses-list > li > a").filter(function() {
        return $(this).attr("href") === window.location.pathname;
    });
    active.closest("li").addClass("active");

}
