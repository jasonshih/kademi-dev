$(function(){
    var initEntityFinder = function(){
        if ($(".manage-data-record").length > 0) {
            $(".manage-data-record #salesBy").entityFinder();
        }
    };

    initEntityFinder();
});