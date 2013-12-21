function initManagePost() {
    $("#managePost").on("click", ".EditPost", function(e) {
        e.preventDefault();
        var id = $(e.target).attr("href");
        var divPost = $(e.target).closest("div.Post");
        showEditPost(id, divPost);
    });
    $("#managePost").on("click", ".DeletePost", function(e) {
        e.preventDefault();
        var id = $(e.target).attr("href");
        var divPost = $(e.target).closest("div.Post");
        confirmDeletePost(id, divPost);
    });
    $("#managePost").on("click", ".DismissReport", function(e) {
        e.preventDefault();
        var id = $(e.target).attr("href");
        var divPost = $(e.target).closest("div.Post");
        dismissReport(id, divPost);
    });
    $("#managePost").on("click", ".DeleteReportedPost", function(e) {
        e.preventDefault();
        var id = $(e.target).attr("href");
        var divPost = $(e.target).closest("div.Post");
        deleteReportedPost(id, divPost);
    });
    

    jQuery("abbr.timeago").timeago();
}

function deleteReportedPost(reportId, postDiv) {
    log("deleteReportedPost", reportId, postDiv);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: "deleteAbuseReportId=" + reportId,
        success: function(data) {
            log("response", data);
            postDiv.hide(300, function() {
                postDiv.remove();
            })
        },
        error: function(resp) {
            log("error", resp);
            alert("Sorry, couldnt delete the post. Do you have permissions?");
        }
    });
}

function dismissReport(reportId, postDiv) {
    log("dismissReport", reportId, postDiv);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: "dismissReportId=" + reportId,
        success: function(data) {
            log("response", data);
            postDiv.hide(300, function() {
                postDiv.remove();
            })
        },
        error: function(resp) {
            log("error", resp);
            alert("Sorry, couldnt delete the post. Do you have permissions?");
        }
    });
}

function confirmDeletePost(postId, postDiv) {
    log("delete", postId, postDiv);
    if (confirm("Are you sure you want to delete this post?")) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            dataType: "json",
            data: "deleteId=" + postId,
            success: function(data) {
                log("response", data);
                postDiv.hide(300, function() {
                    postDiv.remove();
                })
            },
            error: function(resp) {
                log("error", resp);
                alert("Sorry, couldnt delete the post. Do you have permissions?");
            }
        });
    }
}

function showEditPost(postId, postDiv) {
    log("edit", postId, postDiv);
    var currentText = postDiv.find(".Content p.post-text").text();
    var modal = $("#editPost");
    modal.find("textarea").val(currentText);
    modal.find("button").unbind();
    modal.find("button").click(function() {
        var newText = modal.find("textarea").val();
        updatePost(postId, newText, postDiv);
    });

    $.tinybox.show("#editPost", {
        overlayClose: false,
        opacity: 0
    });
}

function updatePost(postId, newText, postDiv) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: {
            editId: postId,
            newText: newText
        },
        success: function(data) {
            log("response", data);
            postDiv.find(".Content p.post-text").text(newText);
            var bg = postDiv.css("background-color");
            log("current bg", bg);
            postDiv.css("opacity", "0");
            postDiv.animate({opacity: 0}, 300, function() {
                postDiv.animate({opacity: 1}, 300);
            });
            $.tinybox.close();
        },
        error: function(resp) {
            log("error", resp);
            alert("Sorry, couldnt update the post. Do you have permissions?");
        }
    });
}