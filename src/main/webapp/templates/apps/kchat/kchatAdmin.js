function initKChatAdmin() {
    initSidebarToggle();
    initQuickSideBar();
    initKChatWebsocket();
}

function initSidebarToggle() {
    var navBar = $('.navbar-tools .navbar-right');
    if (navBar.find('li.fuse-header-item a.sb-toggle').length === 0) {
        navBar.append(
            '<li class="fuse-header-item">' +
            '    <a class="sb-toggle" href="#"><i class="fa fa-outdent"></i></a>' +
            '</li>'
        );
    }

}

var initKChatWebsocket = function () {
    var pageSidebar = $('#page-sidebar');
    var orgId = pageSidebar.data('cid').toString();

    flog('initKChatWebsocket', orgId);

    var b64ContentId = Base64.encode(orgId);

    var port = parseInt(window.location.port || 80) + 1;
    var proto = 'ws://';
    if (window.location.protocol === 'https:') {
        proto = 'wss://';
        port = parseInt(window.location.port || 443) + 1;
    }

    var url = window.location.hostname + ':' + port + '/ws/' + window.location.hostname + '/kchatAdmin/' + b64ContentId;
    flog(url);
    var kchatSocket = new WebSocket(proto + url);

    kchatSocket.onmessage = function (evt) {
        flog('Received data', evt);

        var c = $.parseJSON(evt.data);

        if (c.action === "connected") {
            var templ = $('#kchat-user-template').html();

            var streamItemTemplate = Handlebars.compile(templ);

            if ($('#user-' + c.visitorId).length > 0) {
                flog('user ' + c.visitorId + ' is already connected');
                return;
            }

            var time = new moment(c.timestamp);

            c.time = time.format('hh:mm A');

            if (c.profile.userId > 0) {
                c.profilePic = '/manageUsers/' + c.profile.userId + '/pic'
            } else {
                c.profilePic = "/theme/apps/user/profile.png";
            }

            var html = streamItemTemplate(c);

            $('#page-sidebar .media-list').append(html);

            $('#page-sidebar .user-chat').append('<ol id="chat-' + c.visitorId + '" class="discussion sidebar-content"></ol>');
        } else if (c.action === "disconnected") {
            $('#page-sidebar .media-list').find('#user-' + c.visitorId).remove();
            $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).remove();
        } else if (c.action === "msg") {
            var templ = $('#kchat-msg-template').html();

            var streamItemTemplate = Handlebars.compile(templ);

            var time = new moment(c.timestamp);

            c.time = time.format('hh:mm A');

            c.profilePic = "/theme/apps/user/profile.png";

            var html = streamItemTemplate(c);

            $('#page-sidebar .user-chat').find('#chat-' + c.visitorId).prepend(html);

        } else if (c.action === 'clients') {
            $('#page-sidebar .media-list').empty();

            for (var i = 0; i < c.clients.length; i++) {
                if ($('#user-' + c.clients[i].visitorId).length > 0) {
                    flog('user ' + c.clients[i].visitorId + ' is already connected');
                } else {
                    var templ = $('#kchat-user-template').html();

                    var streamItemTemplate = Handlebars.compile(templ);

                    if (c.clients[i].profile.userId > 0) {
                        c.clients[i].profilePic = '/manageUsers/' + c.clients[i].profile.userId + '/pic'
                    } else {
                        c.clients[i].profilePic = "/theme/apps/user/profile.png";
                    }

                    var html = streamItemTemplate(c.clients[i]);

                    $('#page-sidebar .media-list').append(html);

                    $('#page-sidebar .user-chat').append('<ol id="chat-' + c.clients[i].visitorId + '" class="discussion sidebar-content"></ol>');
                }
            }
        }
    };

    $('#page-sidebar').on('click', '.btn-send-msg', function (e) {
        e.preventDefault();

        var btn = $(this);
        var inp = $('#page-sidebar .kchat-msg-input');
        var msg = inp.val();
        var visitorId = btn.data('visitorid');

        var d = {
            action: "msg",
            visitorId: visitorId,
            msg: msg
        };

        kchatSocket.send(JSON.stringify(d));

        inp.val('');

        var templ = $('#kchatadmin-msg-template').html();
        var streamItemTemplate = Handlebars.compile(templ);
        var time = new moment();
        var c = {
            time: time.format('hh:mm A'),
            msg: msg
        };
        var html = streamItemTemplate(c);
        $('#page-sidebar .user-chat').find('#chat-' + visitorId).prepend(html);
    });

    $('#page-sidebar').on('keypress', '.kchat-msg-input', function (e) {
        if (e.which == 13) {//Enter key pressed
            $('#page-sidebar').find('.btn-send-msg').click();
        }
    });
};

//function to open quick sidebar
var initQuickSideBar = function () {
    $(".sb-toggle").on("click", function (e) {
        if ($(this).hasClass("open")) {
            $(this).not(".sidebar-toggler ").find(".fa-indent").removeClass("fa-indent").addClass("fa-outdent");
            $(".sb-toggle").removeClass("open");
            $("#page-sidebar").css({
                right: -$("#page-sidebar").outerWidth()
            });
        } else {
            $(this).not(".sidebar-toggler ").find(".fa-outdent").removeClass("fa-outdent").addClass("fa-indent");
            $(".sb-toggle").addClass("open");
            $("#page-sidebar").css({
                right: 0
            });
        }

        e.preventDefault();
    });
    $("#page-sidebar .media-list").on("click", '.media a', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        var discussion = btn.closest('.tab-pane').find('.user-chat .discussion');
        discussion.hide();

        btn.closest('.tab-pane').find('#chat-' + href).show();

        $('#page-sidebar .btn-send-msg').data('visitorid', href);

        //user-chat-form
        btn.closest(".tab-pane").css({
            right: $("#page-sidebar").outerWidth()
        });
    });

    $("#page-sidebar .sidebar-back").on("click", function (e) {
        $(this).closest(".tab-pane").css({
            right: 0
        });
        e.preventDefault();
    });
    $('#page-sidebar .sidebar-wrapper').perfectScrollbar({
        wheelSpeed: 1,
        minScrollbarLength: 20,
        suppressScrollX: true
    });
    $('#sidebar-tab a').on('shown.bs.tab', function (e) {
        $("#page-sidebar .sidebar-wrapper").perfectScrollbar('update');
    });
};

pageInitFunctions.push(function () {
    initKChatAdmin();
});