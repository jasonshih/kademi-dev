/**
 * Created by Anh on 10/04/2017.
 */
controllerMappings.addComponent("rewardstore/components", "rewardProduct", "html", "Shows reward product with image, points and add to card button", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "recentlyViewedProducts", "html", "Shows products sliders which are recently viewed by current user", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "pointsRangeList", "html", "Shows points ranges list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "productSort", "html", "Shows products sorting dropdown list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "singleProductEDM", "edm", "Show single product for EDM Editor", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "rewardCategoriesListEDM", "edm", "Show reward store categories list for EDM Editor", "Reward Store");

controllerMappings
        .websitePortletController()
        .portletSection('shoppingCart')
        .templatePath('/theme/apps/rewardstore/pointsBalancePortlet.html')
        .method('getPointsBalance')
        .enabled(true)
        .build();

function getPointsBalance() {
    log.info('getPointsBalance');
}
function findProducts(query, category, rewardStoreId, from, max, priceStart, priceEnd, sort, asc) {
    log.info('findProducts | query {} | category {} | rewardStoreId {} | from {} | max {} | priceStart {} | priceEnd {} | sort {} | asc {}', query, category, rewardStoreId, from, max, priceStart, priceEnd, sort, asc);
    if (category == false) {
        category = null;
    }
    if (isBlank(sort)) {
        sort = 'finalPoints';
    }

    if (isBlank(asc)) {
        asc = 'true';
    }

    if (asc == 'true') {
        asc = "asc";
    } else {
        asc = "desc";
    }

    var searchConfig = {
        "from": parseInt(from),
        "size": max,
        "query": {
            "bool": {
                "must": [],
                "should": []
            }
        },
        "min_score": 0.05,
        "stored_fields": ["title", "title_raw", "content", "product", "productCode", "tags", "itemType", "primaryImageId", "finalPoints", "path", "images.hash"],
        "sort": {},
        "highlight": {
            "fields": {
                "content": {
                    "fragment_size": 100,
                    "number_of_fragments": 3
                }
            }
        }
    };
    if (rewardStoreId && !isNaN(rewardStoreId)) {
        searchConfig.query.bool.must.push({
            "term": {
                "rewardStoreId": rewardStoreId
            }
        });
    }
    if (!isBlank(category)) {
        var catQ = {
            "terms": {
                "tags": [category]
            }
        };

        searchConfig.query.bool.must.push(catQ);
    }

    searchConfig.sort[sort] = asc;

    if (query !== null && typeof query !== 'undefined' && query.trim().length > 0) {
        var searchFields = ["title.text", "content.text"];
        for (var i in searchFields) {
            var q = '{'
                    + '    "prefix": {'
                    + '        "' + searchFields[i] + '": "' + query + '"'
                    + '    }'
                    + '}';
            searchConfig.query.bool.should.push(JSON.parse(q));
            searchConfig.query.bool.minimum_should_match = 1;
        }
    }

    if (isNotBlank(priceStart) && isNotNull(priceStart) && +priceStart > 0) {
        priceStart = +priceStart;
        priceEnd = +priceEnd;

        var pq = {
            "range": {
                "finalPoints": {
                    "gte": priceStart,
                    "lte": priceEnd
                }
            }
        };
        searchConfig.query.bool.must.push(pq);
    }

    log.info("search query: \n {}", JSON.stringify(searchConfig));

    var sm = applications.search.searchManager;
    var result = sm.search(JSON.stringify(searchConfig), 'rewardstore');

    return result;
}

function getRecentlyViewedRewardProducts(page, size) {
    var list = formatter.newArrayList();

    var curUser = securityManager.currentUser;

    if (curUser == null) {
        return list;
    }

    if (!size) {
        size = 20;
    }

    var searchConfig = {
        "size": 0,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "reqUser": curUser.name
                        }
                    },
                    {
                        "term": {
                            "resultCode": 200
                        }
                    },
                    {
                        "term": {
                            "reqMethod": "GET"
                        }
                    },
                    {
                        "prefix": {
                            "contentType": "text/html"
                        }
                    }
                ]
            }
        },
        "aggs": {
            "products": {
                "terms": {
                    "field": "url",
                    "size": 100,
                    "order": {
                        "reqDate": "desc"
                    }
                },
                "aggs": {
                    "reqDate": {
                        "max": {
                            "field": "reqDate"
                        }
                    }
                }
            }
        }
    };
    log.info("recentlyViewedRewardProductsComponent {}", JSON.stringify(searchConfig));
    var sm = applications.search.searchManager;
    var result = sm.search(JSON.stringify(searchConfig), 'log');

    if (result != null) {
        var resultString = result.toString();

        var json = JSON.parse(resultString);
        var buckets = json.aggregations.products.buckets;

        for (var a in buckets) {
            var b = buckets[a];
            var url = b.key;
            var item = page.find(url);
            if (item && item.is('rewardProduct') && list.size() < size) {
                list.add(item);
            }
        }
    }

    return list;
}

function isNotBlank(val) {
    return trimToNull(val) !== null;
}

function isBlank(s) {
    return !isNotBlank(s);
}

function trimToNull(s) {
    if (s !== null && typeof s !== 'undefined') {
        s = s.toString().trim();
        if (s.length === 0) {
            return null;
        }
    }
    return s;
}

function isNull(s) {
    return s === null || typeof (s) === 'undefined';
}

function isNotNull(s) {
    return s !== null && typeof (s) !== 'undefined';
}
