
function initPublishingMenu(managePage) {
    flog("initPublishingMenu", $(".publishing .branches"));
    $(".publishing .branches").on("click", "a.copy", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var node = $(e.target);
        var link = node.closest("li").find("a").not(".copy");
        showCopyBranch(link, function(newName, resp) {
            flog("done copy branch");
            var s = "<a class='branch noclear' href='" + resp.nextHref + (managePage ? "/" + managePage : "") + "'>" + newName + "</a>";
            s = "<li class='list-item' role='presentation'>" + s + "</li>";
            node.closest("ul").append(s);
        });
    });
    $(".publishing .branches").on("click", "a.hide-branch", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var link = $(e.target).closest("a");
        flog("hide branch:", link);
        var li = link.closest("li");
        var srcHref = link.attr("href");
        srcHref = toFolderPath(srcHref);        
        hideBranch(srcHref, function() {
            li.next(".divider").hide();
            li.hide(700);
        });
    });
    
}

function showCopyBranch(link, callback) {
    var srcHref = link.attr("href");
    srcHref = toFolderPath(srcHref);
    myPrompt("copyVersion", "", "Copy website version", "Make a copy of this version of the website", "Enter a name", "newName", "Copy", "reallySimpleChars", "Enter a simple name for the version, eg version2", function(newName, form) {
        newName = newName.toLowerCase();
        log("create version", newName, form);
        createBranch(srcHref, newName, function(newName, resp) {
            closeMyPrompt();
            callback(newName, resp);
            return false;
        });
        return false;
    });
}

function createBranch(src, destName, callback) {
    flog("createBranch", src, destName);
    $.ajax({
        type: 'POST',
        url: src,
        data: {
            copyToName: destName
        },
        dataType: "json",
        success: function(resp) {
            log("created branch", resp);
            callback(destName, resp);
        },
        error: function(resp) {
            log("error", resp);
            alert("Sorry couldnt create new new version: " + resp);
        }
    });
}


function hideBranch(href, callback) {
    flog("hideBranch", href);
    $.ajax({
        type: 'POST',
        url: href,
        data: {
            hide: true
        },
        dataType: "json",
        success: function(resp) {
            log("hid branch", resp);
            if( callback ) {
                callback(resp);
            }
        },
        error: function(resp) {
            flog("error", resp);
            alert("Sorry couldnt hide the version: " + resp);
        }
    });
}