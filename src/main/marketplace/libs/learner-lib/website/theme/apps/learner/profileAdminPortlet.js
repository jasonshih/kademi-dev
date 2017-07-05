




(function($){
    $(document).ready(function(){

        if($('.profile-admin-portlet').length > 0) {
            initAdminProfile();
        }
    });


    function initAdminProfile() {

        flog("initAdminProfile");

        var body = $("body")

        $('.btn-complete-module').click(function (e) {
            e.preventDefault();

            flog("show modal");
            var modal = $('#modal-complete-module').modal('show');

            var modalForm = modal.find('form');
            if (!modalForm.hasClass("initDone")) {
                modalForm.addClass("initDone");
                modalForm.forms({
                    callback: function (resp, form) {
                        Msg.info("Done");
                        modal.modal('hide');
                        reloadModuleStatus();
                    }
                });
            }
        });

        if (!body.hasClass("initProfileLearningDone")) {
            body.addClass("initProfileLearningDone");
            body.on("change", '.cbb-program', function (e) {
                e.preventDefault();
                flog("selected program");
                var select = $(e.target);
                var form = select.closest('form');
                var moduleList = form.find('.modules-list');
                moduleList.html('');
                var href = select.find('option:checked').attr('value');
                form.attr('action', href);
                if (href != null && href.length > 0) {
                    $.getJSON(href + '_DAV/PROPFIND?fields=href,milton:title,name,milton:moduleType&depth=2&where=milton:moduleType', function (data) {
                        log('resp', data.length);

                        var moduleLi = '';

                        for (i = 0; i < data.length; i++) {
                            var item = data[i];
                            var id = 'option' + i;
                            flog('add', item);
                            if (!item.name.startsWith('.')) {
                                var title = item.title;
                                if (title === undefined || title.length === 0) {
                                    title = item.href;
                                }
                                moduleLi +=
                                    '<li class="col-md-6 module">' +
                                    '<div>' +
                                    '<label for="' + id + '">' +
                                    '<input id="' + id + '" type="checkbox" name="forceCompleteModule" value="' + item.href + '"/>' +
                                    title +
                                    '</label>' +
                                    '<a class="btn btn-xs btn-default" target="_blank" title="Open" href="' + item.href + '"><i class="fa fa-caret-square-o-right"></i></a>' +
                                    '</div>' +
                                    '</li>';
                            }
                        }

                        moduleList.append(moduleLi);

                        moduleList.parent().removeClass('hide');
                    });
                }
            });
        }

        $(document.body).on('click', '.btn-delete-download', function (e) {
            e.preventDefault();
            flog("delete", href);
            var target = $(e.target);
            var href = target.closest('a').attr('href');
            var name = getFileName(href);
            confirmDelete(href, name, function () {
                $('#moduleprogress-body').reloadFragment();
            });
        });

        $("#moduleprogress-body").on("click", ".modulestatus-reset", function (e) {
            flog("click");
            e.preventDefault();
            var id = $(e.target).closest("a").attr("href");
            if (confirm("This will clear the user's record of learning for this module and allow them to start it again. Are you sure you want to continue?")) {
                doModuleReset(id);
            }
        });
        $(".show-attempts").click(function (e) {
            e.preventDefault();
            var c = $(e.target).attr("href");
            $("." + c).toggle(200);
        });
    }

    function doModuleReset(id) {
        flog("doModuleReset", id);
        $.ajax({
            type: 'POST',
            url: '/manageCourses',
            data: {
                resetModuleStatusId: id
            },
            dataType: 'json',
            success: function (resp) {
                flog('saved course', resp);
                if (resp.status) {
                    reloadModuleStatus();
                } else {
                    Msg.error("Sorry, we could not reset the module: " + resp.messages);
                }
            },
            error: function (resp) {
                cont.removeClass('ajax-loading');
                Msg.error("Sorry, we could not reset the module");
            }
        });
    }

    function reloadModuleStatus() {
        flog("reloadModuleStatus", $("#moduleprogress-body"));
        $("#moduleprogress-body").reloadFragment({
            url : window.location.pathname + "?showTab=learningAppTab",
            whenComplete: function () {
                Msg.info("Updated ok");
                jQuery("abbr.timeago").timeago();
            }
        });
    }
})(jQuery);