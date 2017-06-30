(function($){

    function initDonuts() {
        flog("initDonuts");
        $.ajax({
            url: '/leads/?asJson&geoloc',
            dataType: 'json',
            success: function (resp, textStatus, jqXHR) {
                if (resp.status) {
                    showDonuts(resp.data);
                    $('.map-donutchart').show();
                } else {
                    flog("Not showing donuts because of bad response", resp);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Msg.error("Couldnot load geo-location data");
            }
        });
    }


    function showDonuts(donutData) {
        flog("showDonuts", donutData);

        $('.map-donutchart').mapDonutChart({
            max: 40,
            textLabel: false,
            hoverAction: true,
            data: donutData,
            colors: {
                'cold': '#44C9F4',
                'warm': '#FBDB4F',
                'hot': '#F2463B',
            }
        });
    }


    $(document).ready(function(){
        if($('.lead-dash-page').length > 0) {
            var mainContainer = $('#maincontentContainer');
            var divs = mainContainer.find('>div').detach();
            mainContainer.append('<div class="row"></div>');
            mainContainer.find('>.row').append(divs);
            //initDonuts();

            var primaryColor = $('.dashboardPieColor').first().css('background-color');

            flog("dotdotdot", $(".leadInner"));
            $(".leadInner").dotdotdot({
                //	configuration goes here
            });

            $('#leadQuery').keyup(function () {
                typewatch(function () {
                    flog('do search');
                    doLeadSearch($('#leadQuery').val());
                }, 500);
            });

            var pieOptions = {
                animate: {
                    duration: 700,
                    enabled: true
                },
                barColor: primaryColor,
                scaleColor: false,
                lineCap: 'circle'
            };

            $('.easypie').easyPieChart(pieOptions);

            function doLeadSearch(q) {
                var href = window.location.pathname + "?q=" + q
                $("#leadsBody").reloadFragment({
                    url: href,
                    whenComplete: function () {
                        window.history.pushState("", href, href);
                        $('abbr.timeago').timeago();
                    }
                });
            }
        }
    });

})(jQuery);
