
var selectedCourse;

function initManageCourse(programsUrl, programUrl) {
    initPublishingMenu("manageCourses");
    initModuleEditing();
    orderCourseModuleItem();
    initProgramEditing(programsUrl);
    initCourseEditing(programUrl);
    initActive();

    if ($("modulePanel").length > 0) {
        $('div.Course li > a').pjax('#modulePanel', {
            fragment: "#modulePanel",
            success: function() {
                log("done!");
                initActive();
                initModuleEditing();
            }
        });
    }
}

function initActive() {
    $("div.Course li.Active").removeClass("Active");
    var active = $("div.Course li > a").filter(function() {
        return $(this).attr("href") == window.location.pathname;
    });
    active.closest("li").addClass("Active");

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
            $.tinybox.close();
        }
    });

    $("body").on("click", "button.AddModule", function(e) {
        e.preventDefault();
        courseHref = window.location.pathname;
        log("add module", courseHref);
        var msg = "Please enter a code for the new module. Once created the module code can't be changed, but you can enter a descriptive title";
        showCreateFolder(courseHref, "Create module", msg, function(name, resp) {
            window.location.reload();
        }, validateSimpleChars);

    });

    $("div.Module").on("click", "a.DialogueModule", function(e) {
        e.preventDefault();
        log("click module");
        var moduleLi = $(e.target).closest("li");
        var dialog = moduleLi.find(".Dialog");
        if (dialog.length == 0) {
            log("create new dialog");
            dialog = $("<div class='Dialog'></div>").hide();
            moduleLi.append(dialog);
            var deleteLink;
            log("add delete link", moduleLi);
            if (moduleLi.hasClass("Splitter")) {
                deleteLink = $("<a href='#' class='Delete Deletemodule'>Delete this splitter</a> ").appendTo(dialog);
            } else {
                var editLink = $("<a href='#' class='EditModule'>Edit module name notes</a>").appendTo(dialog);
                $("<a href='" + moduleLi.attr("id") + "' class='ManageModule'>Manage this module</a>").appendTo(dialog);
                $("<a target='_blank' href='" + moduleLi.attr("id") + "?goto=' class='ManageModule'>View module</a>").appendTo(dialog);
                var addSplitterLink = $("<a href='#' class='ManageModule'>Add splitter below</a>").appendTo(dialog);
                deleteLink = $("<a href='#' class='Delete Deletemodule'>Delete this module</a> ").appendTo(dialog);
                var dupLink = $("<a href='#' class='DuplicateModule'>Duplicate</a> ").appendTo(dialog);
                var exportPdf = $("<a href='#' class=''>Export to PDF</a> ").appendTo(dialog);
                var exportText = $("<a href='#' class=''>Export to Text</a> ").appendTo(dialog);

                exportPdf.click(function(e) {
                    var moduleHref = moduleLi.attr("id") + "?format=pdf";
                    window.open(moduleHref);
                });
                exportText.click(function(e) {
                    var moduleHref = moduleLi.attr("id") + "?format=text";
                    window.open(moduleHref);
                });

                dupLink.click(function(e) {
                    e.preventDefault();
                    duplicateModule(moduleLi);
                });

                editLink.click(function(e) {
                    e.preventDefault();
                    showEditModule(moduleLi, modal, form);
                });

                addSplitterLink.click(function(e) {
                    e.preventDefault();
                    moduleLi.after('\
			<li class="Splitter" style="">\
				<span>Level Splitter</span> \
				<aside>\
					<a title="Move up or down" class="Move" href=""><span class="Hidden">Move up or down</span></a> \
					<a title="Show dialogue menu" class="Dialogue DialogueModule" href=""><span class="Hidden">Show dialogue menu</span></a> \
				</aside>\
				<div class="Dialog Hidden">\
					<a class="Delete DeleteModule" href="">Delete this module</a>\
				</div>\
			</li>'
                            );
                    dialog.hide();
                    saveModules();
                });


            }

            deleteLink.click(function(e) {
                e.preventDefault();
                log("Delete", moduleLi)
                if (moduleLi.hasClass("Splitter")) {
                    moduleLi.remove();
                    saveModules();
                } else {
                    var moduleHref = moduleLi.attr("id");
                    confirmDelete(moduleHref, moduleHref, function() {
                        window.location.reload();
                    });
                }
            });
        }
        dialog.toggle(200);
    });

    var cont = $("section.Content");
    $("div.Module ul").sortable({
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
            $.tinybox.show(modal, {
                overlayClose: false,
                opacity: 0
            });
        },
        error: function(resp) {
            alert("Sorry couldnt get module data");
        }
    });
}



function initCourseEditing(programUrl) {
    var modal = $("#courseModal");
    var form = modal.find("form");

    $("button.AddCourse").click(function(e) {
        e.preventDefault();
        var msg = "Please enter a code for the new course. Once created the code can't be changed, but you can enter a descriptive title";
        showCreateFolder(programUrl, "Create course", msg, function(name) {
            window.location = programUrl + name;
        }, validateSimpleChars);
    });


    $("body").on("click", "div.Course a.DialogueCourse", function(e) {
        e.preventDefault();
        var courseLi = $(e.target).closest("li");
        var dialog = courseLi.find(".Dialog");
        if (dialog.length == 0) {
            log("create new dialog");
            dialog = $("<div class='Dialog'></div>").hide();
            courseLi.append(dialog);
            var editLink = $("<a href='#' class='EditCourse'>Edit this course</a>").appendTo(dialog);
            var deleteLink = $("<a href='#' class='Delete DeleteCourse'>Delete this course</a> ").appendTo(dialog);
            var exportPdf = $("<a href='#' class=''>Export to PDF</a> ").appendTo(dialog);
            var exportText = $("<a href='#' class=''>Export to Text</a> ").appendTo(dialog);

            exportPdf.click(function(e) {
                var href = courseLi.find("> a").attr("href") + "?format=pdf";
                window.open(href);
            });
            exportText.click(function(e) {
                var href = courseLi.find("> a").attr("href") + "?format=text";
                window.open(href);
            });

            editLink.click(function(e) {
                e.preventDefault();
                var liCourse = $(this).closest("li");
                showEditCourse(liCourse, modal, form);
            });
            deleteLink.click(function(e) {
                e.preventDefault();
                deleteCourse(courseLi);
            });
        }
        dialog.toggle(200);
    });

    form.forms({
        callback: function(resp) {
            log("done save course", resp);
            var title = form.find("input[type=text]").val();
            var name = getFileName(form.attr("action"));
            selectedCourse.find("> a").text(name + " - " + title);
            $.tinybox.close();
        }
    });
}

function deleteCourse(courseLi) {
    var courseHref = courseLi.find("> a").attr("href");
    var courseName = courseLi.find("> a").text();
    log("deleteCourse", courseLi, courseHref, courseName);
    confirmDelete(courseHref, courseName, function() {
        $("#modulePanel")
                .find("div.Module")
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
            $.tinybox.show(modal, {
                overlayClose: false,
                opacity: 0
            });
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
                var li = $("<li><a href='" + resp.nextHref + "'>" + form.find("input[type=text]").val() + "</a></li>");
                var aside = $("<aside></aside>");
                li.append(aside);
                var edit = $("<a class='EditProgram' title='Edit program' href='#'><span class='Hidden'>Edit program</span></a> ");
                var del = $("<a class='DeleteProgram' title='Delete program' href='" + resp.nextHref + "'><span class='Hidden'>Delete program</span></a>");
                aside.append(edit).append(del);
                $("ul.Program").append(li);
                log("go to: " + resp.nextHref);
                window.location.reload();
                //window.location.href = resp.nextHref + "manageCourses";
            } else {
                window.location.reload();
            }
            $.tinybox.close();
        }
    });
    $("body").on("click", "button.AddProgram", function(e) {
        e.preventDefault();

        var msg = "Please enter a code for the new program. Once created the code can't be changed, but you can add a descriptive title after the program is created";
        showCreateFolder(programsUrl, "Create program", msg, function(name) {
            log("created", name);
            window.location = programsUrl + name;
        }, validateSimpleChars);

    });



    // Event for Delete button
    $("body").on("click", "div.Program a.DeleteProgram", function(e) {
        e.preventDefault();
        liProgram = $(this).closest("li");
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
    $("body").on("click", "div.Program a.EditProgram", function(e) {
        e.preventDefault();
        liProgram = $(this).closest("li");
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
                $.tinybox.show(modal, {
                    overlayClose: false,
                    opacity: 0
                });
            },
            error: function(resp) {
                alert("Sorry couldnt get program data");
            }
        });
    });
}


function saveModules() {
    log("Save", selectedCourse, $("#modulePanel .Module li"));
    var level = 1;
    var order = 0;
    var data = new Object();
    $("#modulePanel .Module li").each(function(i, node) {
        var $node = $(node);
        log("save node: ", $node);
        if ($node.hasClass("Splitter")) {
            level++;
            log("found splitter", level);
        } else {
            order++;
            var name = $node.attr("id");
            var title = $($("span", $node)[0]).text();
            if (!name) {
                name = $.URLEncode(title);
                $node.attr("id", name);
                log("set name", name, $node);
            }
            data["name-" + order] = name;
            data["level-" + order] = level;
            log("added data", data);
        }
    });
    log("saveModules", data);
    var cont = $("section.Content");
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
    $("div.Course ul").sortable({
        items: "> li",
        sort: function() {
            $(this).removeClass("ui-state-default");
        }
    });

    $("div.Course > ul > li").each(function(i) {
        $(this).attr({
            "data-course": i + 1
        }).find("div.Module")
                .attr("data-course", i + 1)
                .find("ul > li")
                .not(".Splitter")
                .each(function(idx) {
            $(this).attr("data-module", idx + 1);
        });
    });
}


function maxOrderCourse() {
    var _order = [];
    $("div.Course > ul > li").each(function() {
        _order.push($(this).attr("data-course"));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
}

function maxOrderModule() {
    var _order = [];
    $("#modulePanel div.Module ul li").each(function() {
        _order.push($(this).attr("data-course"));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
}

function maxOrderProgram() {
    var _order = [];
    $("ul.Program li").each(function() {
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