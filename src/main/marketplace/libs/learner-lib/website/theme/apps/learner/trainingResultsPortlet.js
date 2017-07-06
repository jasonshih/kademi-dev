(function($){

    function initTrainingResultsPortlet() {
        var modal = $('#modal-upload-training-results-csv');
        var result = modal.find('.upload-results');

        $(".showUploadTrainingResultsModal").click(function(e) {
            e.preventDefault();

            modal.modal('show');
        });

        $("#do-upload-training-results-csv").mupload({
            buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
            url: "../trainingResults.csv",
            useJsonPut: false,
            oncomplete: function(data, name, href) {
                log("oncomplete:", data.result.data, name, href);
                if( data.result.status ) {
                    Msg.success("Upload completed. Updated " + data.result.data.numUpdated + " rows");
                } else {
                    if( data.result.data.unmatched.length > 0 )  {
                        alert(data.result.data.unmatched.length + " records could not be matched. Please review errors and update your spreadsheet.");
                    } else {
                        alert("There was an error uploading");
                    }
                }
                result.find(".num-updated").text(data.result.data.numUpdated);
                result.find(".num-unmatched").text(data.result.data.unmatched.length);
                showUnmatched(result, data.result.data.unmatched);
                result.show();
            }
        });
    };

    $(document).ready(function(){

        if($('.training-result-portlet').length > 0) {
            initTrainingResultsPortlet();
        }
    });
})(jQuery);