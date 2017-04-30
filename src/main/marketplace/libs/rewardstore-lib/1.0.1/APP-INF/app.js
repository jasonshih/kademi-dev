/**
 * Created by Anh on 10/04/2017.
 */
controllerMappings.addComponent("rewardstore/components", "rewardProduct", "html", "Shows reward product with image, points and add to card button", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "pointsRangeList", "html", "Shows points ranges list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "productSort", "html", "Shows products sorting dropdown list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "singleProductEDM", "edm", "Show single product for EDM Editor", "Reward Store");


function findProducts(query, category, rewardStoreId, from, max, priceStart, priceEnd, sort, asc) {
    log.info('findProducts | query {} | category {} | rewardStoreId {} | from {} | max {} | priceStart {} | priceEnd {} | sort {} | asc {}', query, category, rewardStoreId, from, max, priceStart, priceEnd, sort, asc);
    if (category == false){
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
                "must": [
                    {
                        "term": {
                            "rewardStoreId": rewardStoreId
                        }
                    }
                ]
            }
        },
        "min_score": 0.05,
        "fields": ["title", "title_raw", "content", "product", "productCode", "tags", "itemType", "primaryImageId", "finalPoints", "path", "images.hash"],
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
        var q = {
            "multi_match": {
                "query": query,
                "fields": ["title", "content"]
            }
        };
        searchConfig.query.bool.must.push(q);
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
