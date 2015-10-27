function initManagerUserEmailPortlet() {
    $("abbr.timeago").timeago();

    var modal = $('#modal-compose-email');
    var form = modal.find('form');

    form.forms({
        callback: function (resp) {
            modal.modal('hide');
            $('#emailHistoryBody').reloadFragment();
        }
    });

    $('body').on('show.bs.modal', '#modal-compose-email', function () {
        $('#email_message').wysihtml5({
            toolbar: {
                "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
                "emphasis": true, //Italics, bold, etc. Default true
                "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                "html": false, //Button which allows you to edit the generated HTML. Default false
                "link": true, //Button to insert a link. Default true
                "image": false, //Button to insert an image. Default true,
                "color": false, //Button to change color of font  
                "blockquote": true, //Blockquote  
            }
        });
    });

    $('body').on('hidden.bs.modal', '#modal-compose-email', function () {
        $('.wysihtml5-sandbox, .wysihtml5-toolbar').remove();
        $('#email_message').show();

        form.trigger('reset');
    });
}