// controllerMappings.addComponent("salesdata/components", "topSkus", "html", "Shows top SKUs of data series in table format", "Sales data");
controllerMappings.addComponent("salesdata", "kpiVis", "html", "Shows top SKUs of data series in table format", "Sales data");
controllerMappings.addComponent("salesdata", "salesDataVis", "html", "Displays sales data in a visualisation, eg dateHistogram, sparkline, kpiLeaderboard, pointsLeaderboard or a summary", "Sales data");
controllerMappings.addComponent("salesdata", "onTrack", "html", "An indicator to show if the user is on track to achieve the KPI target", "Sales data");
controllerMappings.addComponent("salesdata", "kpiPeriodPicker", "html", "Allows select a KPI period from a dropdown list", "Sales data");
//
// controllerMappings
//     .websiteController()
//     .enabled(true)
//     .path('/getTopSkus')
//     .addMethod('GET', 'getTopSkus')
//     .build();
//
// controllerMappings
//     .websiteController()
//     .enabled(true)
//     .path('/topSkus.csv')
//     .addMethod('GET', 'getTopSkusCSV')
//     .defaultView(views.textTemplateView('/theme/apps/3mExtraComponents/csv.html', 'text/csv'))
//     .build();
//
// function getTopSkusData(page, params) {
//     log.info('getTopSkusData > page={}, params={}', page, params);
//     var selectedOrgs = [];
//
//     for (var key in queryService.selectedOrgIds) {
//         selectedOrgs.push(queryService.selectedOrgIds[key]);
//     }
//
//     var queryJson = {
//         "fields": ["productSku", "amount", "qty"],
//         "size": 10,
//         "aggregations": {
//             "skuCodeShare": {
//                 "terms": {
//                     "field": "productSku",
//                     "size": 5,
//                     "order": [
//                         {
//                             "totalPoints": "desc"
//                         }
//                     ]
//                 },
//                 "aggs": {
//                     "totalPoints": {
//                         "sum": {
//                             "field": "amount"
//                         }
//                     }
//                 }
//             }
//         },
//         "query": {
//             "bool": {
//                 "must": [
//                     {
//                         "type": {
//                             "value": "dataSeriesRecord"
//                         }
//                     },
//                     // {
//                     //     "terms": {
//                     //         "assignedToOrgs": selectedOrgs
//                     //     }
//                     // },
//                     {
//                         "terms": {
//                             "dataSeriesName": [
//                                 "new-series-1"
//                             ]
//                         }
//                     },
//                     // {
//                     //     "range" : {
//                     //         "amount" : {
//                     //             "gt" : "0"
//                     //         }
//                     //     }
//                     // }
//                 ]
//             }
//         }
//     };
//
//     var displayedItems = params.displayedItems;
//     // if (isNotBlank(displayedItems)) {
//     if (true) {
//         queryJson.aggregations.skuCode = {
//             "terms": {
//                 "field": "productSku",
//                 "size": params.displayedItems,
//                 "order": [
//                     {
//                         "totalPoints": "desc"
//                     }
//                 ]
//             },
//             "aggs": {
//                 "totalPoints": {
//                     "sum": {
//                         "field": "amount"
//                     }
//                 },
//
//                 "skuQuantity": {
//                     "top_hits": {
//                         "_source": {
//                             "includes": [
//                                 "qty"
//                             ]
//                         },
//                         "size": 1
//                     }
//                 }
//             }
//         };
//     }
//
//     var startDate = params.startDate;
//     var endDate = params.endDate;
//     if (startDate && endDate) {
//         queryJson.query.bool.must.push({
//             "range": {
//                 "periodFrom": {
//                     "gte": new Date(formatter.formatDateISO8601(startDate)).toISOString(),
//                     "lte": new Date(formatter.formatDateISO8601(endDate)).toISOString()
//                 }
//             }
//         });
//     }
//
//     var query = params.query;
//     if (query && $.trim(query).length > 0) {
//         queryJson.query.bool.must.push({
//             'multi_match': {
//                 "query": query,
//                 "type": "cross_fields",
//                 "fields": ["productSku"]
//             }
//         });
//     }
//
//     var queryString = JSON.stringify(queryJson);
//     log.info('Query String: {}', queryString);
//
//
//
//     var searchResults = applications.search.searchManager.search(queryString, "dataseries");
//     // log.info('Search results: {}', searchResults);
//
//     return searchResults;
// }
//
// function getTopSkus(page, params) {
//     log.info('getTopSkus > page={}, params={}', page, params);
//
//     var searchResults = getTopSkusData(page, params);
//     log.info('---------- getTopSkus searchResults > {}', searchResults);
//     var productsApp = applications.productsApp;
//     var buckets = searchResults.aggregations.get('skuCode').buckets;
//     var skuMap = {};
//     for (var i in buckets){
//         var bucket = buckets[i];
//         var prodSku = productsApp.getProductSku(bucket.key);
//         if( prodSku ) {
//             skuMap[bucket.key] = prodSku.title;
//         } else {
//             skuMap[bucket.key] = bucket.key;
//         }
//     }
//     var json = {
//         skuMap: skuMap,
//         searchResults: searchResults.toString()
//     }
//     return views.jsonObjectView(json);
// }
//
// function getTopSkusCSV(page, params) {
//     log.info('getTopSkusCSV > page={}, params={}', page, params);
//
//     var searchResults = getTopSkusData(page, params);
//     var csvLines = formatter.newArrayList();
//
//     // CSV Headers
//     var headers = formatter.newArrayList();
//     // headers.add('Category');
//     headers.add('Item/SKU');
//     headers.add('Product');
//     headers.add('Sales');
//     csvLines.add(headers);
//     var buckets = searchResults.aggregations.get('skuCode').buckets;
//     var productsApp = applications.productsApp;
//     for (var i in buckets) {
//         var bucket = buckets[i];
//
//         var values = formatter.newArrayList();
//         // values.add(safeString(bucket.aggregations.get('skuCategory').hits.hits[0].source.category));
//         values.add(safeString(bucket.key));
//         var prodSku = productsApp.getProductSku(bucket.key);
//         if( prodSku ) {
//             values.add(prodSku.title);
//         } else {
//             values.add(safeString(bucket.key));
//         }
//
//         values.add(bucket.aggregations.get('totalPoints').value);
//         csvLines.add(values);
//     }
//
//     page.attributes.csvValues = csvLines;
// }

