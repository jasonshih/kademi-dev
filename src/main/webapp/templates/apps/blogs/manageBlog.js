function initManageBlog() {
    $('#addArticleModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                flog('created  blog', resp);
                window.location = resp.nextHref;
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }

        }
    });
    $('#addTagModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                $('#tags-container').reloadFragment();
                $('#addTagModal').modal('hide');
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }

        }
    });

    $('#addCategoryModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                $('#categories-container').reloadFragment();
                $('#addCategoryModal').modal('hide');
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }
        }
    });

    $('body').on('click', 'a.delete-article', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        confirmDelete(href, href, function () {
            link.closest('tr').remove();
        });
    });
    
    $('body').on('click', 'a.tag-delete', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        if (confirm('Are you sure you want to delete ' + href)) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeTagName: href
                },
                dataType: 'json',
                success: function (resp) {
                    $('#tags-container').reloadFragment();
                    Msg.info('Deleted tag');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured deleting the tag')
                }
            });

        }
    });

    $('body').on('click', 'a.tag-edit', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        var newTag = prompt('Please enter a new name for ' + href);
        if (newTag) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    editTagName: href,
                    updatedTagName: newTag
                },
                dataType: 'json',
                success: function (resp) {
                    $('#tags-container').reloadFragment();
                    Msg.info('Updated tag');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured updating the tag')
                }
            });
        }
    });

    $('body').on('click', 'a.cat-delete', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        if (confirm('Are you sure you want to delete ' + href)) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeCategoryName: href
                },
                dataType: 'json',
                success: function (resp) {
                    $('#categories-container').reloadFragment();
                    Msg.info('Deleted category');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured deleting the category')
                }
            });

        }
    });

    $('body').on('click', 'a.cat-edit', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        var newCat = prompt('Please enter a new name for ' + href);
        if (newCat) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    editCategoryName: href,
                    updatedCategoryName: newCat
                },
                dataType: 'json',
                success: function (resp) {
                    $('#categories-container').reloadFragment();
                    Msg.info('Updated category');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured updating the category')
                }
            });
        }
    });
}
