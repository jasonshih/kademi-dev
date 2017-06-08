
(function ($) {
    var domains = $("#themeSiteId").data("domains");
    initManageGroupEmail();
    //initEditEmailPage();


    function selectDomain(sel) {
        var selectedValue = $(sel).find(":selected").text();
        var domainSelected = domains[selectedValue];
        flog("Website selected: ", selectedValue, " Domain Selected: ", domainSelected);
        $("#domainCurrentSite").val(domainSelected);
    }

    var themeSiteId = $("#themeSiteId");
    themeSiteId.change(function () {
        selectDomain(this);
    });
    selectDomain(themeSiteId);
}(jQuery));