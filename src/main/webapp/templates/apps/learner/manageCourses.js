var selectedCourse;

function initManageCourse(programsUrl, programUrl) {
    initPublishingMenu("manageCourses");
    initModuleEditing();
    orderCourseModuleItem();
    initProgramEditing(programsUrl);
    initCourseEditing(programUrl);
    initActive();

    if ($("#manage-course").length > 0) {
        $('div.courses-list li > a').pjax('#manage-course', {
            fragment: "#manage-course",
            success: function() {
                log("done!");
                initActive();
                initModuleEditing();
            }
        });
    }
}

function initActive() {
    $("ul.courses-list > li.active").removeClass("active");
    var active = $("ul.courses-list > li > a").filter(function() {
        return $(this).attr("href") === window.location.pathname;
    });
    active.closest("li").addClass("active");

}

function initModuleEditing() {    
    log("initModuleEditing");
    var modal = $("#moduleModal");
    var form = modal.find("form");
    log("init module form", form);
    form.forms({
        callback: function(resp) {
            log("done save program", resp);
            if (resp.nextHref) {
                window.location.reload();
            } else {
                window.location.reload();
                // TODO: update html
            }
            modal.modal('hide');
        }
    });

    $(document.body).on("click", ".btn-add-module", function(e) {
        e.preventDefault();
        courseHref = window.location.pathname;
        log("add module", courseHref);
        var msg = "Please enter a code for the new module. Once created the module code can't be changed, but you can enter a descriptive title";
        showCreateFolder(courseHref, "Create module", msg, function(name, resp) {
            window.location.reload();
        }, validateSimpleChars);

    });
    
    var moduleWrapper = $("div.modules-wrapper");
    
    moduleWrapper.on('click', '.btn-duplicate-module', function (e) {
        e.preventDefault();        
        
        duplicateModule($(this).parents('li.module'));
    });
    
    moduleWrapper.on('click', '.btn-add-splitter', function (e) {
        e.preventDefault();        
        
        $(this).parents('li.module').after(
            '<li class="splitter clearfix">' +
                '<aside class="pull-right">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-xs btn-default btn-move-splitter" title="Move up or down"><i class="glyphicon glyphicon-sort"></i></button>' +
                        '<button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown">' +
                            '<span class="caret"></span>' +
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
    
    moduleWrapper.on('click', '.btn-edit-module', function (e) {
        e.preventDefault(); 
        
        var li = $(this).parents('li.module');
        
        log("Delete", li)       
        
        showEditModule(li, modal, form);
    });
    
    
    moduleWrapper.on('click', '.btn-delete-module', function (e) {
        e.preventDefault();
        
        var li = $(this).parents('li.module');
        
        log("Delete", li)
        var moduleHref = li.attr("id");
        confirmDelete(moduleHref, moduleHref, function() {
            window.location.reload();
        });
    });
    
    moduleWrapper.on('click', '.btn-delete-splitter', function (e) {
        e.preventDefault();
        
        var li = $(this).parents('li.splitter');
        
        log("Delete", li)        
        li.remove();
        saveModules();
    });

    var cont = $("section.Content");
    $("div.modules-wrapper ul").sortable({
        items: "> li",
        sort: function() {
            if( cont.hasClass("ajax-loading") ) {
                return false;
            }                  
            $(this).removeClass("ui-state-default");
        },
        update: function() {
            log("module change order");
            saveModules();
        }
    });
}

var selectedModule;

function showEditModule(liModule, modal, form) {
    selectedModule = liModule;
    resetForm(form);
    var moduleHref = liModule.attr("id");
    form.attr("action", moduleHref);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: moduleHref + "/_DAV/PROPFIND?fields=name,milton:title,milton:notes&depth=0",
        dataType: "json",
        success: function(resp) {
            if (resp) {
                var p = resp[0];
                log("set fields", p);
                form.find("input[name=moduleName]").val(p.name);
                form.find("input[name=moduleTitle]").val(p.title);
                form.find("textarea").val(p.notes);
            }            
            modal.modal('show');
        },
        error: function(resp) {
            alert("Sorry couldnt get module data");
        }
    });
}



function initCourseEditing(programUrl) {
    var modal = $("#courseModal");
    var form = modal.find("form");

    $(".btn-add-course").click(function(e) {
        e.preventDefault();
        var msg = "Please enter a code for the new course. Once created the code can't be changed, but you can enter a descriptive title";
        showCreateFolder(programUrl, "Create course", msg, function(name) {
            window.location = programUrl + name;
        }, validateSimpleChars);
    });
    
    var courseWrapper = $('.courses-wrapper');
    
    courseWrapper.on('click', '.btn-edit-course', function (e) {
        e.preventDefault();        
        
        showEditCourse($(this).parents('li.course'), modal, form);
    });
    
    courseWrapper.on('click', '.btn-delete-course', function (e) {
        e.preventDefault();        
        
        deleteCourse($(this).parents('li.course'));
    });

    form.forms({
        callback: function(resp) {
            log("done save course", resp);
            var title = form.find("input[type=text]").val();
            var name = getFileName(form.attr("action"));
            selectedCourse.find("> a").text(name + " - " + title);            
            modal.modal('hide');
        }
    });
}

function deleteCourse(courseLi) {
    var courseHref = courseLi.find("> a").attr("href");
    var courseName = courseLi.find("> a").text();
    log("deleteCourse", courseLi, courseHref, courseName);
    confirmDelete(courseHref, courseName, function() {
        $("div.modules-wrapper")
                .filter("[data-course=" + courseLi.attr("data-course") + "]")
                .remove();
        courseLi.remove();

        log("deleted course", courseHref, window.location.pathname);

        if (courseHref == window.location.pathname) {
            window.location = "../";
        }
    });
}

function showEditCourse(liCourse, modal, form) {
    selectedCourse = liCourse;
    resetForm(form);
    var courseHref = liCourse.find("> a").attr("href");
    form.attr("action", courseHref);
    // Load title and notes into modal form
    $.ajax({
        type: 'GET',
        url: courseHref + "_DAV/PROPFIND?fields=milton:title,milton:notes&depth=0",
        dataType: "json",
        success: function(resp) {
            if (resp) {
                var p = resp[0];
                log("set fields", p);
                form.find("input[type=text]").val(p.title);
                form.find("textarea").val(p.notes);
            }            
            modal.modal('show');
        },
        error: function(resp) {
            alert("Sorry couldnt get program data");
        }
    });
}

function initProgramEditing(programsUrl) {
    var modal = $("#programModal");
    var form = modal.find("form");
    log("initProgramEditing", form, programsUrl);

    form.attr("action", programsUrl);
    form.forms({
        callback: function(resp) {
            log("done save program", resp);
            if (resp.nextHref) {
                // nextHref means this is a new resource, so add it to the list
                $("ul.programs-list").append(
                    '<li class="program clearfix">' +
                        '<aside class="pull-right">' +
                            '<a class="btn btn-xs btn-default btn-edit-program" title="Edit program" href="#"><i class="glyphicon glyphicon-edit"></i></a>' +
                            '<a class="btn btn-xs btn-default btn-delete-program" title="Delete program" href="' + resp.nextHref + '"><i class="glyphicon glyphicon-remove"></i></a>' +
                        '</aside>' +
                        '<a href="' + resp.nextHref + '">$otherProg.title</a>' +
                    '</li>'
                );
                log("go to: " + resp.nextHref);
                window.location.reload();
                //window.location.href = resp.nextHref + "manageCourses";
            } else {
                window.location.reload();
            }            
            modal.modal('hide');
        }
    });
    
    var programsList = $('ul.programs-list');
    
    programsList.on('click', '.btn-add-program', function (e) {
        e.preventDefault();
        
        var msg = "Please enter a code for the new program. Once created the code can't be changed, but you can add a descriptive title after the program is created";
        showCreateFolder(programsUrl, "Create program", msg, function(name) {
            log("created", name);
            window.location = programsUrl + name;
        }, validateSimpleChars);
        
    });

    // Event for Delete button
    programsList.on("click", ".btn-delete-program", function(e) {
        e.preventDefault();
        liProgram = $(this).parents("li.program");
        var programHref = $(e.target).closest("a").attr("href");
        var programName = getFileName(programHref);
        log("click delete program", liProgram, programHref);
        confirmDelete(programHref, programName, function() {
            liProgram.remove();
            var currentHref = window.location.pathname;
            log("current", currentHref, "programHref=", programHref);
            if (currentHref.startsWith(programHref)) {
                window.location.href = programsUrl;
            }
        });
    });

    // Event for Edit button
    programsList.on("click", ".btn-edit-program", function(e) {
        e.preventDefault();
        liProgram = $(this).parents("li.program");
        var programHref = liProgram.find("> a").attr("href");
        //programHref = getFolderPath(programHref) + "/";
        var programName = getFileName(programHref);
        log("click edit program", liProgram, programName);
        resetForm(form);
        form.find("input[type=hidden]").val(programName); // set hidden name field to the resource name
        // Load title and notes into modal form
        $.ajax({
            type: 'GET',
            url: programHref + "_DAV/PROPFIND?fields=milton:title,milton:notes&depth=0",
            dataType: "json",
            success: function(resp) {
                if (resp) {
                    var p = resp[0];
                    log("set fields", p);
                    form.find("input[type=text]").val(p.title);
                    form.find("textarea").val(p.notes);                    
                }
                modal.modal('show');
            },
            error: function(resp) {
                alert("Sorry couldnt get program data");
            }
        });
    });
}


function saveModules() {
    log("Save", selectedCourse, $("#ul.modules-list > li.module"));
    var level = 1;
    var order = 0;
    var data = new Object();
    $("ul.modules-list > li.module").each(function(i, li) {
        var li = $(li);
        log("save node: ", li);
        if (li.hasClass("splitter")) {
            level++;
            log("found splitter", level);
        } else {
            order++;
            var name = li.attr("id");
            var title = $($("> span", li)[0]).text();
            if (!name) {
                name = $.URLEncode(title);
                li.attr("id", name);
                log("set name", name, li);
            }
            data["name-" + order] = name;
            data["level-" + order] = level;
            log("added data", data);
        }
    });
    log("saveModules", data);
    var cont = $(".content");
    cont.addClass("ajax-loading");
    $.ajax({
        type: 'POST',
        url: "",
        data: data,
        dataType: "json",
        success: function(resp) {
            cont.removeClass("ajax-loading");
            log("saved module", resp);
        },
        error: function(resp) {
            cont.removeClass("ajax-loading");
            alert("Sorry couldnt update module");
        }
    });

}




function orderCourseModuleItem() {
    $("ul.courses-list").sortable({
        items: "> li.course",
        sort: function() {
            $(this).removeClass("ui-state-default");
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
    var _order = [];
    $("div.courses-wrapper > ul > li").each(function() {
        _order.push($(this).attr("data-course"));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
}

function maxOrderModule() {
    var _order = [];
    $("div.modules-wrapper ul.modules-list li.module").each(function() {
        _order.push($(this).attr("data-course"));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
}

function maxOrderProgram() {
    var _order = [];
    $("ul.programs-list li.program").each(function() {
        _order.push($(this).attr("data-program"));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
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