(function($){
    $(document).ready(function(){
        if($('.lead-task-modal-content-component').length > 0) {
            $('body').on('loaded.bs.modal', '#modalEditTask', function (e) {
                flog('Modal Loaded');
                $(".completeTaskDiv").show(300);
                $(".hideOnComplete").hide(300);
            });
        }
    });

})(jQuery);
