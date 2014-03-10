$(function() {
    $("button.completeModule").click(function(e) {
        var modal = $("div.completeModule");
        showModal(modal);
    });
    $(".selectProgram").change(function(e) {
        var select = $(e.target);
        var form = select.closest("form");        
        var moduleList = form.find(".modules");
        moduleList.html("");
        log("clicked", select.find("option:checked"));
        var href = select.find("option:checked").attr("value");
        form.attr("action", href);
        if (href != null && href.length > 0) {
            $.getJSON(href + "_DAV/PROPFIND?fields=href,milton:title,name,milton:moduleType&depth=2&where=milton:moduleType", function(data) {
                log("resp", data.length);
                for( i=0; i<data.length; i++ ) {
                    var item = data[i];
                    var id = "option" + i;
                    log("add", item);
                    if( !item.name.startsWith(".")) {
                        moduleList.append("<li><input id='" + id + "' type='checkbox' name='forceCompleteModule' value='" + item.href +"'/><label style='width: inherit' for='" + id + "'>" + item.title + "</label> <a style='font-size:10px' target='_blank' href='" + item.href + "'>(open)</a></li>");
                    }
                }
            });
        }
    });
    
    $(".delete-download").click(function(e) {
        e.preventDefault();
        var target = $(e.target);
        var href = target.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function() {
            target.closest("div").remove();
        });
    });
    
});