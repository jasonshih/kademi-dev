(function ($) {

    // Check window.pageInitFunctions
    if (!window.pageInitFunctions) {
        window.pageInitFunctions = [];
    }

    // Add Profile Achievements Tab methods
    window.pageInitFunctions.push(function () {
        // Make sure we are on the Profile Achievements Tab
        var tab = $('.krecognition-profile-achievements-tab');
        if (tab.length > 0 && location.hash === '#krecognition-achievements-tab') {
            // The achievements tab is open, So init
            initProfileAchievementTab();
        }
    });

    function initProfileAchievementTab() {
        var tab = $('.krecognition-profile-achievements-tab');

        tab.find('.btn-krecognition-award-del').each(function (i, item) {
            $(item).off('click').on('click', function (e) {
                e.preventDefault();

                var btn = $(this);
                var tr = btn.closest('tr');
                var awardid = tr.data('awardid');

                Kalert.confirmWait('You want to delete this awarded badge?', 'Ok', function () {
                    $.ajax({
                        url: '/recognition/',
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            deleteAward: true,
                            awardid: awardid
                        },
                        success: function (resp) {
                            Kalert.close();

                            if (resp.status) {
                                tr.remove();
                                Msg.success(resp.messages);
                            } else {
                                Msg.warning(resp.messages);
                            }
                        },
                        error: function () {
                            Kalert.close();

                            Msg.error('Oh No! Something went wrong!');
                        }
                    });
                });
            });
        });
    }
})(jQuery);