(function ($) {
    $(document).ready(function () {
        if ($('#modalEditTask').length > 0) {
            flog('Init modalEditTask');
            
            $(document.body).on('loaded.bs.modal shown.bs.modal', '#modalEditTask', function () {
                flog('Modal Loaded');
                $(".completeTaskDiv").show(300);
                // $(".hideOnComplete").hide(300);
                
                var modal = $(this);
                var notes = modal.find('.lead-notes');
                notes.dotdotdot({
                    height: 200,
                    callback: function (isTruncated, orgContent) {
                        if (isTruncated) {
                            var currentContent = notes.html();
                            notes.html('<div class="lead-notes-inner">' + currentContent + '</div>');
                            var notesInner = notes.find('.lead-notes-inner');
                            var toggler = $('<a href="#" class="text-info">View more <i class="fa fa-angle-double-down"></i></a>');
                            notes.append(toggler);
                            
                            toggler.click(function (e) {
                                e.preventDefault();
                                
                                if (toggler.hasClass('opened')) {
                                    notesInner.html(currentContent);
                                    toggler.html('View more <i class="fa fa-angle-double-down"></i>');
                                    toggler.removeClass('opened');
                                } else {
                                    notesInner.html(orgContent);
                                    toggler.html('Hide <i class="fa fa-angle-double-up"></i>');
                                    toggler.addClass('opened');
                                }
                            });
                        }
                    }
                });
                
            });
        }
    });
    
})(jQuery);
