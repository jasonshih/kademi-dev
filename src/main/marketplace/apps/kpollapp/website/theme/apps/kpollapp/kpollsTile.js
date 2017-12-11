(function ($) {
    $(function () {
        $('.kpoll-tile').each(function () {
            var tile = $(this);
            var form = tile.find('form');
            
            // Add 'required' attribute for all radio buttons
            form.find('input:radio').prop('required', true);
            
            // Handler for form submit event
            form.forms({
                onSuccess: function (resp) {
                    if (resp && resp.status) {
                        form.fhide();
                        tile.find('.kpoll-success').fshow();
                    } else {
                        if (resp && resp.messages.length > 0) {
                            Msg.error(resp.messages[0]);
                        } else {
                            Msg.error('Error when answering this poll. Please contact your administrator for resolving this problem!');
                        }
                    }
                }
            });
        });
        
    });
    
})(jQuery);