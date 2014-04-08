function initManageRepos() {
    log('initManageRepositories');
    var modal = $('#modal-new-repo');
    $('.btn-add-repo').on('click', function(e) {
        e.preventDefault();
        modal.modal('show');
    });

    modal.find('form').forms({
        callback: function(resp) {
            window.location.reload();
            modal.modal('hide');
        }
    });

    $('a.btn-delete-repo').click(function(e) {
        e.preventDefault();
        var node = $(e.target);
        var href = node.attr('href');
        var name = getFileName(href);
        confirmDelete(href, name, function() {
            alert('Repository deleted');
            window.location.reload();
        });
    });

    flog("init switch", $('td.public input'));
    $('td.public input').on('change switchChange', function(e) {
        flog("switch", e.target);
        e.preventDefault();

        var label = $(this);
        var wrapper = label.parents('.make-switch');

        setTimeout(function() {
            var isChecked = wrapper.find('input:checked').val() === 'true';
            flog("checked=", isChecked);
            var href = wrapper.closest("tr").find("a.repo").attr("href");
            setRepoPublicAccess(href, isChecked);
        }, 0);
    });
}

function setRepoPublicAccess(href, isPublic) {
    $.ajax({
        type: 'POST',
        data: {isPublic: isPublic},
        url: href,
        success: function(data) {
        },
        error: function(resp) {
            flog("error updating: ", href, resp);
            alert('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}