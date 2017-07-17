function initKpollForm() {
    flog('initKpollForm');

    var form = $('#form-kpoll');

    // Add 'required' attribute for all radio buttons
    form.find('input:radio').prop('required', true);

    // Handler for form submit event
    form.forms({
        onSuccess: function (resp) {
            if (resp && resp.status) {
                showKpollResult();
            } else {
                if (resp && resp.messages.length > 0) {
                    Msg.error(resp.messages[0]);
                } else {
                    Msg.error('Error when answering this poll. Please contact your administrator for resolving this problem!');
                }
            }
        }
    });
}

function initKpollButtons() {
    var btnSeeResult = $('.btn-see-result');

    btnSeeResult.on('click', function (e) {
        e.preventDefault();

        showKpollResult(true);
    });
}

function showKpollResult(isPreview) {
    var form = $('#form-kpoll');
    var result = $('#poll-result');

    result.reloadFragment({
        whenComplete: function () {
            if (!isPreview) {
                Msg.success('Answered!');
            }

            form.animate({
                'opacity': 'hide',
                'height': 'hide'
            }, 200);

            result.animate({
                'opacity': 'show',
                'height': 'show'
            }, 200);
        }
    })
}

function initKpollPortlet() {
    flog('initKpollPortlet');

    initKpollForm();
    initKpollButtons();
}

$(function () {
    initKpollPortlet();
})