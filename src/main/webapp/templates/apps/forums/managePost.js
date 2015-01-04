function initManagePost() {
    var table = $('.posts-table');
    var reportsWrapper = $('#reports');
    var postsWrapper = $('#posts');

    table.on('click', '.btn-edit-post', function(e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        showEditPost(id, divPost);
    });

    table.on("click", ".vote-up", function(e) {
        e.preventDefault();
        var row = $(e.target).closest("tr");
        var id = row.data("id");
        votePost(id, 1, row);
    });

    table.on("click", ".vote-down", function(e) {
        e.preventDefault();
        var row = $(e.target).closest("tr");
        var id = row.data("id");
        votePost(id, -1, row);
    });

    jQuery('abbr.timeago').timeago();

    postsWrapper.on('click', '.btn-delete-post', function(e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        confirmDeletePost(id, divPost);
    });

    reportsWrapper.on('click', '.btn-dismiss-report', function(e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        dismissReport(id, divPost);
    });

    reportsWrapper.on('click', '.btn-delete-report', function(e) {
        e.preventDefault();

        var btn = $(this);
        var id = btn.attr('href');
        var divPost = btn.closest('tr');

        deleteReportedPost(id, divPost);
    });
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
        success: function(data) {
            log('response', data);
            row.reloadFragment({
                whenComplete: function(){
                    row.find("abbr.timeago").timeago();
                }
            });
            Msg.info("Vote applied");
        },
        error: function(resp) {
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
        success: function(data) {
            log('response', data);
            postRow.remove();
        },
        error: function(resp) {
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
        success: function(data) {
            log('response', data);
            postRow.remove();
        },
        error: function(resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt delete the post. Do you have permissions?');
        }
    });
}

function confirmDeletePost(postId, postRow) {
    log('delete', postId, postRow);
    if (confirm('Are you sure you want to delete this post?')) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            dataType: 'json',
            data: 'deleteId=' + postId,
            success: function(data) {
                log('response', data);
                postRow.remove();
            },
            error: function(resp) {
                log('error', resp);
                Msg.error('Sorry, couldnt delete the post. Do you have permissions?');
            }
        });
    }
}

function showEditPost(postId, postRow) {
    var modal = $('#modal-edit-post');

    log('edit', postId, postRow);
    var currentText = postRow.find('.post-content').text();

    modal.find('textarea').val(currentText);
    modal.off('click').find('.btn-save-post').on('click', function(e) {
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
        success: function(data) {
            log('response', data);
            postRow.find('.post-content').text(newText);

            postRow.css('opacity', '0');
            postRow.animate({opacity: 0}, 300, function() {
                postRow.animate({opacity: 1}, 300);
            });
            $('#modal-edit-post').modal('hide');
        },
        error: function(resp) {
            log('error', resp);
            Msg.error('Sorry, couldnt update the post. Do you have permissions?');
        }
    });
}