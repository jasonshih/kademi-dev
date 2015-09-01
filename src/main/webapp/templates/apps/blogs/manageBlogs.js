function initManageBlogs() {
    initCRUDBlog();
    initCRUDArticle();
}

function initCRUDBlog() {
    var blogContainer = $('#blogs-container');
    var modalAddBlog = $('#modal-blog');

    modalAddBlog.find('form').forms({
        callback: function (resp) {
            flog('created  blog', resp);
            modalAddBlog.modal('hide');
            blogContainer.reloadFragment();
        }
    });

    blogContainer.on('click', '.btn-rename-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.data('name');
        var href = $(e.target).closest('a').attr('href');


        promptRename(href, name, function () {
            blogContainer.reloadFragment();
        });
    });

    blogContainer.on('click', '.btn-delete-group', function (e) {
        e.preventDefault();
        var href = $(e.target).closest('a').attr('href');

        confirmDelete(href, getFileName(href), function () {
            blogContainer.reloadFragment();
        });
    });

    var copyBlogModal = $('#modal-copy-blog');
    blogContainer.on('click', '.btn-copy-blog', function (e) {
        e.preventDefault();

        var href = $(this).attr('href');

        copyBlogModal.find('form').attr('action', href);
        copyBlogModal.modal('show');
    });

    copyBlogModal.find('form').forms({
        callback: function () {
            Msg.info('Copied blog');
            blogContainer.reloadFragment();
            copyBlogModal.modal('hide');
        }
    });
}

function promptRename(sourceHref, name, callback) {
    log("promptRename", sourceHref);
    var currentName = getFileName(sourceHref);
    var newName = prompt("Please enter a new name for " + name, name);
    if (newName) {
        newName = newName.trim();
        if (newName.length > 0 && currentName != newName) {
            var currentFolder = getFolderPath(sourceHref);
            var dest = currentFolder;
            if (!dest.endsWith("/")) {
                dest += "/";
            }
            dest += newName;
            move(sourceHref, dest, callback);
        }
    }
}

function initCRUDArticle() {
    var newArticleModal = $('#modal-new-article');
    var blogContainer = $('#blogs-container');

    blogContainer.on('click', '.btn-new-article', function (e) {
        e.preventDefault();

        var href = $(this).attr('href');

        flog('Show new article modal', href, newArticleModal);
        newArticleModal.find('form').attr('action', href);
        newArticleModal.modal('show');
    });

    newArticleModal.find('form').forms({
        callback: function (resp) {
            flog('done', resp);
            newArticleModal.modal('hide');
            Msg.info('Created article, now redirecting to the edit page');
            window.location = resp.nextHref;
        }
    });

    blogContainer.on('click', 'a.btn-delete-article', function (e) {
        e.preventDefault();

        var link = $(this);
        var href = link.attr('href');

        confirmDelete(href, href, function () {
            link.closest('tr').remove();
        });
    });
}