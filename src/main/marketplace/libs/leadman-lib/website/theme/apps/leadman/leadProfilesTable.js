/**
 * Created by kevin-pc on 6/29/2017.
 */
(function ($) {
    $(document).ready(function () {
        var $lead = $('.lead-profiles-table-component');
        if ($lead.length > 0) {
            var taskName = $lead.data("task-name");
            initSearchLead();
            initUploads();
            checkProcessStatus(taskName);
        }
    });
    
})(jQuery);
