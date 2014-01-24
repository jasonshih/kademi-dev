
var $content;
var parentOrgHref;

function initManageModule(baseHref, themePath) {
    var cssPath = evaluateRelativePath(window.location.pathname, "../../../../../theme/theme-params.less");
    cssPath += "," + themePath + "theme.less,/static/common/contentStyles.less";
    cssPath = cssPath.replaceAll("/", "--");
    cssPath = "/" + cssPath + ".compile.less";
   
    log("push theme css file for editor", cssPath);
    themeCssFiles.push(cssPath);
    themeCssFiles.push("/static/prettify/prettify.css");
    parentOrgHref = baseHref;
    $content = $("#manageModule").find("> div.Content");
		
    stripTable();
    initController();
    initFormDetails();	
    initModuleList();
    initDropDown();
    initAddPageModal();
    initAddQuizModal();
    initQuizBuilder();
    initPublishingMenu("manageModules");
    var pagePath = ""; //window.location.pathname;
    var basePath = window.location.pathname;
    //pagePath = "c1/m1";
    //var basePath = evaluateRelativePath(window.location.pathname, "../../..");
    //basePath = suffixSlash(basePath);
    log("init thumbnail selector", basePath, pagePath);
    var thumbSel = $("input.thumbnail");
    thumbSel.mselect({
        basePath: basePath,
        pagePath: pagePath,
        onSelectFile: function(selectedUrl) {
            // selectedUrl is absolute, need relative to module
            log("selectedUrl", selectedUrl, this);
            thumbSel.val(selectedUrl);
        }
    });
    $(".modulePages").on("click", "a.Edit", function(e) {
        e.preventDefault();
        log("click edit", e, this);
        var a = $(this);
        var name = a.attr("href");
        var article = a.closest("article");
        showEditModal(name, article);
    });
    window.onbeforeunload = isModalOpen;
}


function stripTable() {
    $content
    .find("div.MainContent article")
    .removeClass("Even")
    .filter(":even")
    .addClass("Even");
}
	
// Insert button in list of modules
function initController() {
}
	
	
// Event for Add and Edit Certificate and Reward button in Module details panel
function initFormDetails() {
    initModuleDetailsState(true);
    
    var addFirst = $(".addFirst");
    addFirst.click(function(e) {
        e.preventDefault();        
        var btn = $(e.target);
        var editList = btn.closest(".editList");
        editList.find(".editRow").show().find("input").val(1);
        btn.hide();
        log("hide", btn);
    });
    

    $("#moduleDetailsForm").on("click", ".Delete", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var div = $(e.target).closest("div");
        var container = div.parent();
        if( container.find("div").length > 1 ) {
            log("remove", div);
            div.remove();
            initModuleDetailsState(false);
        } else {
            log("will hide", div);
            // otherwise will be hidden, so just reset values
            div.find("select, input").val("");
            initModuleDetailsState(true);
        }        
    });
      
    $("#moduleDetailsForm").on("click", ".addRow", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var div = $(e.target).closest("div");
        log("addRow", div);
        var container = div.parent();
        var newDiv = div.clone();
        container.append(newDiv);
        newDiv.find("input").val(1);
        initModuleDetailsState(false);
    });      
    
    // For email
    $("#emailConfirm").on("click", function() {
        var $controls = $("div.EmailMessage");
        if($(this).is(":checked")) {
            $controls.removeClass("Hidden");
        } else {
            $controls.addClass("Hidden");
        }
    });
    
    $("#moduleDetailsForm").forms({
        validate: function(form) {
            return checkEditListsValid();
        },
        callback: function(resp) {
            log("done", resp);
            alert("Module details saved");
            if( resp.nextHref && resp.nextHref !== window.location.pathname ) {
                window.location.href = resp.nextHref;
            }
        }
    });
    initHtmlEditors($(".Modal .htmleditor"), $(window).height() - 300 + "px", null, null, standardRemovePlugins + ",autogrow"); // disable autogrow
    initHtmlEditors($("#moduleDetailsForm .htmleditor"));
    
    $("body").on("click", "a.previewCertPdf", function(e) {
        var node = $(e.target);
        var certId = node.parent().find("select").val();
        if( certId === "") {
            alert("Please select a certificate");
        } else {
            var href = "cert_" + certId + "/certificatePreview.pdf";
            window.open(href);
        }
    });
}

function checkEditListsValid(form) {
    log("checkEditListsValid")
    var isOk = true;
    $(".editList").each(function(i, n) {
        var editList = $(n);
        var editRows = editList.find("> div");
        var values = new Array();
        editRows.filter(":visible").each(function(rowIndex, n) {
            var row = $(n);            
            row.find("select, input").filter(".requiredIf").each(function(ii, inputNode) {
                var inp = $(inputNode);
                if( inp.val() === "" ) {
                    isOk = false
                    showValidation(inp, "A value is required",form);
                } else {
                    // check for dups
                    var val = inp.val();
                    log("val", val, values);
                    if( values.indexOf(val) > -1 ) {
                        showErrorField(inp);
                        alert("Duplicate " + inp.attr("data-basename") + " on row " + rowIndex);
                        isOk = false;                        
                    }
                    values.push(val);
                    log("val2", val, values);
                }
            });
        });
    });     
    return isOk;
}


function initModuleDetailsState(allowHide) {    
    log("initModuleDetailsState");
    // If first edit item is blank, then hide it and show add button    
    $(".editList").each(function(i, n) {
        var editList = $(n);
        var addFirst = editList.find("> button");
        var editRows = editList.find("> div");
        var lastRow = editRows.last();
        var lastSelect = lastRow.find("select");
        log("check select", lastSelect, lastSelect.val());
        if( editRows.length === 1 && lastSelect.val().length === 0 ) {//&& allowHide
            editRows.hide();
            addFirst.show();        
        } else {
            log("hide addFirst", addFirst);
            addFirst.hide();
        }        
        // Make sure all certs have a delete button, and update name and id to be sequential counter
        editRows.each(function(i, n) {
            var cert = $(n);
            cert.find("select, input").each(function(ii, inp) {
                var target = $(inp);
                var updatedName = target.attr("data-basename") + i;
                target.attr("name", updatedName);
                target.attr("id", updatedName);
            });
            var btn = cert.find("button.Delete");
            if( btn.length === 0 ) {
                cert.append("<button title='Delete' class='SmallBtn Delete NoText'><span>Delete</span></button>");
            }
        });

        // Make sure only last cert has a plus button to add a cert
        editRows.find("button.Add").remove();
        lastRow.append("<button title='Add' class='SmallBtn Add NoText addRow'><span>Add</span></button>");        
    });       
}
	
function initModuleList() {
    var $moduleWrapper = $content.filter("[rel=#list]").find("div.MainContent");
    // Dragable row
    var cont = $("div.Content");
    $moduleWrapper.sortable({
        items: "article",
        sort: function() {
            if( cont.hasClass("ajax-loading") ) {
                return false;
            }            
            $(this).removeClass( "ui-state-default" );
        },
        stop: function(event, ui) {
            stripTable();
        },
        update: function() {
            log("module page change order");
            saveModulePages();
        }
    });
		
    // Delete button
    $content.on("click", "article a.Delete", function(e) {
        e.preventDefault();
        log("Delete page", $(this));
        var parent = $(this).closest("article");
        var href = $(this).attr("href");        
        var name = parent.find("> span").text();
        confirmDelete(href, name, function() {
            log("remove", parent);
            parent.remove();
        });
        
    //stripTable();
    });
		
    // Show Dialog button
    $content.on("click", "article a.Dialogue", function(e) {
        log("click article a.Dialog", e.target);
        var $dialog = $(this).addClass("Active").closest("article").find("div.Dialog");
        log("click",$(this), $dialog);        
        //        $("article div.Dialog").not($dialog).addClass("Hidden");
        //        $("article div.a.Dialogue").not($(this)).removeClass("Active");
        $dialog.toggle();
        e.preventDefault();
    });
}
	
function initDropDown() {
    log("initDropDown");
        
    var $DropDown =  $("#manageModule").find("div.DropdownControl.selectModule");
    var $ContentDropDown = $DropDown.find("div.Content");
    var $ProgramContent = $ContentDropDown.find("section[rel=program]");
    var $CourseContent = $ContentDropDown.find("section[rel=course]");
    var $ModuleContent = $ContentDropDown.find("section[rel=module]");
    updateLabel = function() {
        var str = getSelectedProgram().name;
        var c = getSelectedCourse();
        if(c) {
            str += " / " + c.title;
        }
        var m = getSelectedModule();
        if(m) {
            str += " / " + m.title;
        }
        $DropDown.find("div.DropdownWrapper > span").html(str);
    };
				
    // Add event for item of Program list
    log("program click", $ProgramContent);
    $ProgramContent.on("click", "a", function(e) {
        var $this = $(this);
        log("program click", $this, $(".programList .Active, .coursesList .Active, .modulesList .Active"));
        $(".programList .Active, .coursesList .Active, .modulesList .Active").removeClass("Active");
			
        if(!$this.hasClass("Active")) {
            $this.addClass("Active").siblings().removeClass("Active");
				
            updateLabel();
				
            $ModuleContent.html("");
            $CourseContent.html("").addClass("Loading");
            var url = propfindHref($this.attr("href"));
            $.getJSON(url, function(data) {
                var courseStr = "";
                for(var i = 1; i < data.length; i++) {
                    var name = data[i]["name"];
                    if( !name.startsWith(".")) {
                        courseStr += "<a href='" + data[i]["href"] + "'>" + data[i]["title"] + "</a>";
                    }
                }
                $CourseContent.html(courseStr).removeClass("Loading");
            });
        }
			
        e.preventDefault();
    });
		
    // Add event for item of Course list
    $CourseContent.on("click", "a", function(e) {				
        var $this = $(this);
			
        if(!$this.hasClass("Active")) {
            $this.addClass("Active").siblings().removeClass("Active");
						
            $ModuleContent.html("").addClass("Loading");
				
            updateLabel();
				
            var url = propfindHref($this.attr("href"));
            $.getJSON(url, function(data) {
                var moduleStr = "";
                for(var i = 1; i < data.length; i++) {
                    log("module", data[i]);
                    var name = data[i]["name"];
                    if( !name.startsWith(".")) {
                        moduleStr += "<a href='" + data[i]["href"] + "'>" + data[i]["title"] + "</a>";
                    }
                }
                $ModuleContent.html(moduleStr).removeClass("Loading");
            });
        }
			
        e.preventDefault();
    });
		
    // Add event for item of Module list
    $ModuleContent.on("click", "a", function(e) {				
        var $this = $(this);
			
        if(!$this.hasClass("Active")) {
            $this.addClass("Active").siblings().removeClass("Active");
				
            $(".DropdownContent").hide(600);
            updateLabel();
        }				
    //e.preventDefault();
    });
}

function getSelectedProgram() {
    var a = $(".programList .Active");
    log("getSelectedProgram", a);
    if( a.length === 0 ) {
        return null;
    } else {
        return {
            name: a.attr("href")
        };
    }
}

function getSelectedCourse() {
    var a = $(".coursesList .Active");
    if( a.length === 0 ) {
        return null;
    } else {
        return {
            name: a.attr("href")
        };
    }
}

function getSelectedModule() {
    var a = $(".modulesList .Active");
    if( a.length === 0 ) {
        return null;
    } else {
        return {
            name: a.attr("href")
        };
    }
}

function propfindHref(href) {
    return href + "_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection";
}

function request_url() {
    var str = "";
    var p = getSelectedProgram();
    if(p) {
        str += p.name + "/";
    }
    if(selectedCourse) {
        str += selectedCourse.name + "/"; // TODO: branches
    }
    log("str", str);
    var s = parentOrgHref + "/" + str + "_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection";
    log("request_url", s);
    return s;
}

function saveModulePages() {
    var order = 0;
    log("saveModulePages");    
    $("article.modulePage").each(function(i, node) {
        var $node = $(node);
        //log("save page: ", $node);
        order++;
        $("input", $node).attr("value", order);
        //log("updated", $node);
    });    
    var cont = $("div.Content");
    cont.addClass("ajax-loading");
    $.ajax({
        type: 'POST',
        url: "",
        data: $("form.modulePages").serialize(),
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

function initAddPageModal() {
    $(".AddModulePage").click(function(e) {
        e.preventDefault();
        log("initAddPageModal: click");
        var modal = $("#modalCreatePage");
        modal.find("input[type=text], textarea,input[name=pageName]").val("");
        modal.find("form").unbind();
        modal.find("form").submit(function(e) {
            log("submit clicked", e.target);
            e.preventDefault();
            //createPage(modal.find("form"));
            doSavePage(modal.find("form"), null, false);
        });        
        $.tinybox.show(modal, {
            overlayClose: false,
            opacity: 0
        }); 
    });
}

function initAddQuizModal() {
    $(".AddQuizPage").click(function(e) {
        e.preventDefault();
        var modal = $("#modalCreateQuiz");
        modal.find("input[type=text], textarea,input[name=pageName]").val("");
        modal.find("#quizQuestions").html("<ol class='quiz'></ol>");
        var form = modal.find("form");
        form.unbind();        
        form.submit(function(e) {
            e.preventDefault();            
            //createPage(modal.find("form"));
            doSavePage(modal.find("form"), null, true);
        });
        $.tinybox.show(modal, {
            overlayClose: false,
            opacity: 0
        }); 
    });
}

function showEditModal(name, pageArticle) {
    log("showEditModal", name, pageArticle);
    var editModal;
    var isQuiz = pageArticle.hasClass("Quiz");
    if( isQuiz ) {
        editModal = $("#modalCreateQuiz");
    } else {
        editModal = $("#modalCreatePage");
    }
    editModal.find("input[name=pageName]").val(name);
    $.tinybox.show(editModal, {
        overlayClose: false,
        opacity: 0,
        top: "10px"
    }); 
    editModal.find("input[type=text], textarea").val("");
    editModal.find("form").unbind();
    editModal.find("form").submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
        log("edit submit click", e.target);
        doSavePage(editModal.find("form"), pageArticle, isQuiz);
    });
    editModal.find(".historyBtn").unbind();
    editModal.find(".historyBtn").history({
        pageUrl: name,
        showPreview: false,
        afterRevertFn: function() {
            loadModalEditorContent(editModal, name);
        }
    });
    loadModalEditorContent(editModal, name);
}

function isModalOpen() {
    log("isModalOpen");
    if( $("#modalCreateQuiz").is(":visible") || $("#modalCreatePage").is(":visible") ) {
        return "Please close the edit modal before leaving this page";
    }
}

function loadModalEditorContent(modal, name) {
    $.ajax({
        type: 'GET',
        url: name + "?type=json",
        dataType: "json",
        success: function(resp) {
            var data = resp.data;
            log("resp", resp);
            log("set into", modal, modal.find("input[name=pageTitle]"));
            modal.find("input[name=pageTitle]").val(data.title);
            if( modal.is("#modalCreateQuiz")) {
                loadQuizEditor(modal, data);
            } else {
                modal.find("textarea").val(data.body);
            }
        //modal.find("input[name=pageTitle]").val(data.title);
        },
        error: function(resp) {
            log("error", resp);
            alert("err: couldnt load page data");
        }
    });       
}

function doSavePage(form, pageArticle, isQuiz) {
    var $form = $(form);    
    log("doSavePage", $form, isQuiz);
    
    resetValidation($form);
    if( !checkRequiredFields(form)) {
        return;
    }
    
    var $title = $form.find("input[name=pageTitle]");
    var data;
    if( isQuiz ) {
        data = prepareQuizForSave($form);
        
    } else {
        log("check ck editors", CKEDITOR.instances);
        for( var key in CKEDITOR.instances) {
            var editor = CKEDITOR.instances[key];
            var content = editor.getData();
            log("got ck content", key, content, editor);
            var inp = $("textarea[name=" + key + "]", $form);
            if( inp ) {
                inp.html(content);
                log("updated", inp);
            }
        }    
        data = $form.serialize();
    }
    log("do ajax post", $form.attr("action"), data);
    try {
        form.find("button[type=submit]").attr("disabled", "true");
        log("set disabled", form.find("button[type=submit]"));
        form.addClass("ajax-processing");
        $.ajax({
            type: 'POST',
            url: $form.attr("action"),
            data: data,
            dataType: "json",
            success: function(data) {
                log("set enabled", form.find("button[type=submit]"));
                form.removeClass("ajax-processing");
                form.find("button[type=submit]").removeAttr("disabled");
                if( data.status ) {
                    var title = $title.val();
                    if( pageArticle == null ) { // indicated new page
                        var pageName = getFileName(data.messages[0]);                        
                        var href = data.nextHref;
                        addPageToList(pageName, href, title, isQuiz);
                    } else {
                        pageArticle.find("> span").text(title);
                    }
                    $.tinybox.close();
                    saveModulePages();
//                    $form.unbind();                    
                } else {
                    alert("There was an error saving the page: " + data.messages);
                }                                
            },
            error: function(resp) {
                form.removeClass("ajax-processing");
                log("error", resp);
                alert("Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.");
            }
        });          
    } catch(e) {
        log("exception in createJob", e);
    }    
    return false;
}

function addPageToList(pageName, href, title, isQuiz) {
    var newRow = $("<article class='modulePage'></article>");
    if( isQuiz) {
        newRow.addClass("Quiz");
    }
    $("form.modulePages div.MainContent").append(newRow);
    log("newRow", newRow, title, isQuiz);
    newRow.append("<input type='hidden' value='' name='" + pageName + "'/>");
    newRow.append("<span>" + title + "</span>");
    var aside = $("<aside class='Hidden'></aside>");
    newRow.append(aside);
    var newFileName = getFileName(href);
    aside.append("<a href='" + newFileName + "' class='Edit' title='Edit page'><span class='Hidden'>Edit page</span></a>");    
    aside.append("<a href='" + newFileName + "?goto' target='_blank' class='View' title='View page'><span class='Hidden'>View page</span></a>");
    aside.append("<a href='' class='Move' title='Move up or down'><span class='Hidden'>Move up or down</span></a>");
    aside.append("<a href='" + href + "' class='Delete' title='Delete page'><span class='Hidden'>Delete page</span></a>");    
}
