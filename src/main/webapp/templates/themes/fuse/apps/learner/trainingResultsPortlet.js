$(function() {
    $(".showUploadTrainingResultsModal").click(function(e) {
        $.tinybox.show($("#modalUploadTrainingResultsCsv"), {
            overlayClose: false,
            opacity: 0
        });                       
    });   

    $("#doUploadTrainingResultsCsv").mupload({
        buttonText: "Upload spreadsheet",
        url: "../trainingResults.csv",
        useJsonPut: false,
        oncomplete: function(data, name, href) {
            log("oncomplete:", data.result.data, name, href);
            if( data.result.status ) {
                alert("Upload completed. Updated " + data.result.data.numUpdated + " rows");                
            } else {
                if( data.result.data.unmatched.length > 0 )  {
                    alert(data.result.data.unmatched.length + " records could not be matched. Please review errors and update your spreadsheet.");
                } else {
                    alert("There was an error uploading");
                }                                
            }
            $(".results .numUpdated").text(data.result.data.numUpdated);
            $(".results .numUnmatched").text(data.result.data.unmatched.length);
            showUnmatched(data.result.data.unmatched);
            $(".results").show();
            
        }
    });      
});
