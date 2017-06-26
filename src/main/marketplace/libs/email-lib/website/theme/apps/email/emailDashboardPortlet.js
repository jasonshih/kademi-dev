
(function ($) {
    $(document).ready(function(){
        if ($('.email-dashboard-portlet').length > 0) {
            initPieChart($('.emailsMainPie'), {
                trackColor: 'rgba(255,255,255,0.2)',
                scaleColor: 'rgba(255,255,255,0.5)',
                barColor: 'rgba(255,255,255,0.7)',
                lineWidth: 7,
                lineCap: 'butt'
            }, 90);

            initPieChart($('.emailsSubPie.bluePie'), {
                trackColor: '#eee',
                scaleColor: '#ccc',
                barColor: '#2196F3',
                lineWidth: 7,
                lineCap: 'butt'
            }, 8);

            initPieChart($('.emailsSubPie.orangePie'), {
                trackColor: '#eee',
                scaleColor: '#ccc',
                barColor: '#FFC107',
                lineWidth: 7,
                lineCap: 'butt'
            }, 8);
        }
    });


}(jQuery));