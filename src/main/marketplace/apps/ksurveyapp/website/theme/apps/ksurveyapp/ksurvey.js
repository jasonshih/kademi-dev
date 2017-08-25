(function () {
    function initCheckboxes() {
        $('.answers input[type=checkbox]').on('click', function (e) {
            var name = $(this).attr('name');
            var val = $('input[type=text][name=temp-' + name + ']').val().split(',');
            if (this.checked) {
                if (val.length && val.indexOf(this.value) === -1) {
                    val.push(this.value);
                }
            } else {
                if (val.length && val.indexOf(this.value) !== -1) {
                    var index = val.indexOf(this.value);
                    val.splice(index, 1);
                }
            }

            $('input[type=text][name=temp-' + name + ']').val(val.join(','));
        });
    }

    function initForm() {
        $('#surveyform').forms({
            onSuccess: function (resp, form, config) {
                if (resp.status) {
                    form.trigger('reset');
                    Msg.info('Survey submitted successfully!');
                    setTimeout(function () {
                        window.location = window.location;
                    }, 1000);
                } else {
                    Msg.error(resp.messages.join('<br/>'));
                }
            }
        })
    }

    function initTimeago() {
        $('.timeago').timeago();
        $('.surveytime').each(function () {
            var txt = $(this).text();
            $(this).text(moment(txt).format('DD/MM/YYYY hh:mm:ss'));
        })
    }

    function initCountDown() {
        var countdownT = setInterval(function(){
            if(!$('#cowndowntime').length){
                clearInterval(countdownT);
                return;
            }
            var startTime = $('#cowndowntime').attr('data-startTime');
            $('#cowndowntime').text(countdown(new Date(startTime)).toString());
        },1000)
    }

    function initProgressBar(){
        $('.progress-bar').each(function(){
            $(this).css('width',this.getAttribute('aria-valuenow')+'%');
            if(this.getAttribute('aria-valuenow')<1){
                $(this).css('color','#333');
                var div = $(this).children();
                div.detach().insertBefore($(this));
            }
        });
    }

    function initRequiredQuestions() {
        $(document).on('click', '[data-requiredQuestions]', function () {

            var rqs = $(this).attr('data-requiredQuestions');
            if (rqs){
                $('#surveyform').find('[data-required]').each(function () {
                    var name = $(this).attr('name').replace('temp-', '');
                    if (rqs.indexOf(name) != -1){
                        $(this).addClass('required');
                    } else {
                        if ($(this).attr('data-required') != 'true'){
                            $(this).removeClass('required');
                        }
                    }
                })
            } else {
                $('#surveyform').find('[data-required]').each(function () {
                    if ($(this).attr('data-required') != 'true'){
                        $(this).removeClass('required');
                    }
                })
            }

        });
    }

    $(function () {
        if ($('.ksurvey').length){
            initCheckboxes();
            initForm();
            initTimeago();
            initCountDown();
            initRequiredQuestions();
            if ($('.ksurveyResult').length){
                initProgressBar();
            }
        }
    });
})(jQuery);