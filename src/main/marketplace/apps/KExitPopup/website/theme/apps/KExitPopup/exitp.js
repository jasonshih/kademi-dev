/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {

    var template = '<div class="modal fade" id="popup-modal">' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-body">' +

                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

    function init() {              
        if($('.content-editor-nav').length === 0){
            $.get('/isPageAllowed',
            { pathname: window.location.pathname},
            function(data) {
                if(data.allowed === true){
                    $("body").append(template);

                    $.get('/exitp', function(data) {
                        $('#popup-modal .modal-body').html(data);
                    });

                    $("html").on("mouseout.ouibounce", function () {
                        function e() {
                            $("#popup-modal").modal();
                        }
                        return function (t) {
                            if (t.clientY > 20)
                                return;
                            e();
                            $("html").off("mouseout.ouibounce");
                        };
                    }());
                }
            },
            'json');                
        }
    }

    $(document).ready(function () {
        init();
    });

})();