function initKChat() {
    flog('initKChat');

    var ws = initKChatWS();
    initKChatSendBtn(ws);
}

function initKChatWS() {
    var chatContainer = $('.chat-container');
    var cid = chatContainer.data('cid');
    var b64ContentId = Base64.encode(cid.toString());

    var proto = 'ws://';
    if (window.location.protocol === 'https:') {
        proto = 'wss://';
    }
    var url = window.location.host + '/ws/' + window.location.host + '/kchat/' + b64ContentId;
    var kchatSocket = new WebSocket(proto + url);

    kchatSocket.onmessage = function (evt) {
        var c = $.parseJSON(evt.data);

        if (c.action === "msg") {
            var templ = $('#kchat-msgr-template').html();
            var msgTemplate = Handlebars.compile(templ);
            var html = $.parseHTML(msgTemplate(c));

            $(html).find('.timeago').timeago();
            chatContainer.find('.chat').append($(html));

            var panel = chatContainer.find('.panel-body');
            panel.scrollTop(panel.find('ul').height());
        }
    };

    return kchatSocket;
}

function initKChatSendBtn(kchatSocket) {
    var chatContainer = $('.chat-container');

    chatContainer.on('click', '.btn-chat', function (e) {
        e.preventDefault();

        var inp = chatContainer.find('.kchat-msg-input');
        var value = inp.val().trim();

        if (value.length > 0) {
            var c = {
                action: "msg",
                msg: inp.val()
            };
            inp.val('');

            kchatSocket.send(JSON.stringify(c));

            var templ = $('#kchat-msgl-template').html();
            var msgTemplate = Handlebars.compile(templ);
            var time = new moment();

            c.timestamp = time.toISOString();
            c.profile = {
                name: "Me"
            };

            var html = $.parseHTML(msgTemplate(c));
            $(html).find('.timeago').timeago();

            chatContainer.find('.chat').append($(html));
            var panel = chatContainer.find('.panel-body');
            panel.scrollTop(panel.find('ul').height());
        }

    });

    chatContainer.on('keypress', '.kchat-msg-input', function (e) {
        if (e.which === 13) { // Enter key pressed
            chatContainer.find('.btn-chat').click();
        }
    });
}

pageInitFunctions.push(function () {
    initKChat();
});