function initManagePost() {
    var table = $('.posts-table');
    var reportsWrapper = $('#reports');
    var postsWrapper = $('#posts');

    table.on('click', '.btn-edit-post', function (e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        showEditPost(id, divPost);
    });

    table.on("click", ".vote-up", function (e) {
        e.preventDefault();
        var row = $(e.target).closest("tr");
        var id = row.data("id");
        votePost(id, 1, row);
    });

    table.on("click", ".vote-down", function (e) {
        e.preventDefault();
        var row = $(e.target).closest("tr");
        var id = row.data("id");
        votePost(id, -1, row);
    });

    jQuery('abbr.timeago').timeago();

    postsWrapper.on('click', '.btn-delete-post', function (e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        confirmDeletePost(id, divPost);
    });

    reportsWrapper.on('click', '.btn-dismiss-report', function (e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        dismissReport(id, divPost);
    });

    reportsWrapper.on('click', '.btn-delete-report', function (e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        deleteReportedPost(id, divPost);
    });

    $('body').on('change', '.select-all', function (e) {
        e.preventDefault();
        var btn = $(this);
        var checked = btn.is(':checked');
        $('.post-check').prop("checked", checked).change();
    });

    $('body').on('change', '.post-check', function (e) {
        e.preventDefault();
        var delbtn = $('#delete-posts-text');
        var count = getCheckedPostsCount();
        var text = "Delete "
                + count
                + " posts";
        delbtn.text(text);
        if (count < 1) {
            $('.select-all').prop("checked", false);
            showDeleteBtn(false);
        } else {
            showDeleteBtn(true);
        }
    });

    $('body').on('click', '.btn-bulk-delete', function (e) {
        e.preventDefault();
        var posts = $('.post-check:checked');
        var count = posts.length;
        if (count > 0) {
            if (confirm("Are you sure you want to delete " + count + " posts?")) {
                for (var i = 0; i < count; i++) {
                    var btn = $(posts[i]);
                    var postId = btn.data('href');
                    var postRow = btn.closest('tr');
                    deletePost(postId, postRow);
                }
            }
            $('.select-all').prop("checked", false);
            $('.post-check').prop("checked", false).change();
        }
    });
}

function showDeleteBtn(show) {
    if (show) {
        $('.btn-bulk-delete').show('fast');
    } else {
        $('.btn-bulk-delete').hide('fast');
    }
}

function getCheckedPostsCount() {
    return $('.post-check:checked').length;
}

function votePost(postId, count, row) {
    log('votePost', postId, count, row);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            voteId: postId,
            count: count
        },
        success: function (data) {
            log('response', data);
            row.reloadFragment({
                whenComplete: function () {
                    row.find("abbr.timeago").timeago();
                }
            });
            Msg.info("Vote applied");
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt vote on the post. Do you have permissions?');
        }
    });
}

function deleteReportedPost(reportId, postRow) {
    log('deleteReportedPost', reportId, postRow);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: 'deleteAbuseReportId=' + reportId,
        success: function (data) {
            log('response', data);
            postRow.remove();
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt delete the post. Do you have permissions?');
        }
    });
}

function dismissReport(reportId, postRow) {
    log('dismissReport', reportId, postRow);
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: 'dismissReportId=' + reportId,
        success: function (data) {
            log('response', data);
            postRow.remove();
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt delete the post. Do you have permissions?');
        }
    });
}

function confirmDeletePost(postId, postRow) {
    log('delete', postId, postRow);
    if (confirm('Are you sure you want to delete this post?')) {
        deletePost(postId, postRow);
    }
}

function deletePost(postId, postRow) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: 'deleteId=' + postId,
        success: function (data) {
            log('response', data);
            postRow.remove();
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt delete the post. Do you have permissions?');
        }
    });
}

function showEditPost(postId, postRow) {
    var modal = $('#modal-edit-post');

    log('edit', postId, postRow);
    var currentText = postRow.find('.post-content').text();

    modal.find('textarea').val(currentText);
    modal.off('click').find('.btn-save-post').on('click', function (e) {
        e.preventDefault();

        var newText = modal.find('textarea').val();
        updatePost(postId, newText, postRow);
    });

    modal.modal('show');
}

function updatePost(postId, newText, postRow) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            editId: postId,
            newText: newText
        },
        success: function (data) {
            log('response', data);
            postRow.find('.post-content').text(newText);

            postRow.css('opacity', '0');
            postRow.animate({opacity: 0}, 300, function () {
                postRow.animate({opacity: 1}, 300);
            });
            $('#modal-edit-post').modal('hide');
        },
        error: function (resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt update the post. Do you have permissions?');
        }
    });
}