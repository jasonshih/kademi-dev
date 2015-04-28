controllerMappings.websiteController().path("/countries").enabled(true).defaultView( views.templateView("countries/countriesHome") )
//    .addMethod("POST", "createCandidate", "newName")
    .addMethod("GET", "searchCountries", "query")
    .build();
    
controllerMappings.websiteController().path("/countries/(?<regionName>.*)").enabled(true).defaultView( views.templateView("countries/viewRegion") )
    .addMethod("GET", "searchCountries", "query")
    .build();        
    
controllerMappings.websiteController().path("/countries/(?<regionName>.*)/(?<countryName>.*)").enabled(true).defaultView( views.templateView("countries/viewCountry") )
    .addMethod("GET", "viewCountry")
    .build();    

//controllerMappings.websiteController().path("/mysearch").enabled(true).defaultView( views.templateView("theme/candidate") )
//    .addMethod("GET", "doSearch", "query", views.jsonView("results") )
//    .build();    

controllerMappings.adminController().path("/countries").enabled(true).defaultView( views.templateView("countries/manageCountries") )
    .addMethod("POST", "syncCountries", "sync", views.jsonView("syncResult").wrapJsonResult() )
    .build();   



var AsyncHttpClient = Java.type('com.ning.http.client.AsyncHttpClient');


function syncCountries(page) {
    print("syncCountries");
    
    var client = new AsyncHttpClient();
    var dbs = page.find("/jsondb/").children;
    for( var i=0; i<dbs.size(); i++ ) {
        var db = dbs.get(i);
        if( db.name.startsWith("region-")) {
            db.setupIndex();
            var regionName = db.name.replace("region-", "");
            print("syncProject - " + regionName);
    
            var resp = client.prepareGet("http://restcountries.eu/rest/v1/region/" + regionName).execute().get();
    
            print("reso " + resp.responseBody) ;
    
            var result = JSON.parse(resp.responseBody);
            print("result size " + result.length) ;
            for( var c=0; c< result.length; c++) {
                var country = result[c];
                // Look it up, and creat it if not exists
                var item = db.child(country.name);
                var json = JSON.stringify(country);                
                if( item === null ) {
                    print(" create country - " + country.name);
                    db.createNew(country.name, json, null);
//                    db.createNew(country.name, json, "country");
                } else {
                    print(" found country - " + country.name);
                    item.update(json, null);
                }
            }
        }
    }
    
    page.attributes.syncResult = true;
}



function viewCountry(page) {
    print("viewCountry " + page.name );
    var candRes = page.find("/jsondb/b2").child(page.attributes.candId)
    var ob = candRes.jsonObject;
    print("cand name " + ob.name);
}

function searchCountries(page, parameters) {
    var regionDb = page.find("/jsondb/" + page.attributes.regionName);
    var s = {
        fields: ["name","capital","currencies"],
        query: {
            term: {
               capital: parameters.query
            }
        }
    };
    var jsonSearch = JSON.stringify(s);
    
    print("Search " + jsonSearch);

    var results = regionDb.search(jsonSearch);
    page.attributes.searchResults = results;   
}
            
