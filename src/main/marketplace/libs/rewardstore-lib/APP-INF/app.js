/* HTML Components */
controllerMappings.addComponent("rewardstore/components", "rewardProduct", "html", "Shows reward product with image, points and add to card button", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "recentlyViewedProducts", "html", "Shows products sliders which are recently viewed by current user", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "pointsRangeList", "html", "Shows points ranges list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "productSort", "html", "Shows products sorting dropdown list", "Reward Store");
controllerMappings.addComponent("rewardstore/components", "pointsEarned", "html", "Shows points earned for the current participant, for a selected points bucket and optionally filtered by a points tag", "Reward Store");

/* EDM Components */
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

function findProducts(page, params, rewardName, numberOfProducts, sort, asc) {
    log.info('findProducts > page={}, params={}, rewardName={}, numberOfProducts={}, sort={}, asc={}', page, params, rewardName, numberOfProducts, sort, asc);

    if (!numberOfProducts) {
        numberOfProducts = 12;
    } else {
        numberOfProducts = +numberOfProducts;
    }

    var rewardStoreFolder = page;
    if (rewardName) {
        rewardStoreFolder = page.find("/" + rewardName);
    }
    if (rewardStoreFolder == null) {
        log.warn("Could not find reward store: " + rewardName);
        return null;
    }
    var rewardStoreName = rewardStoreFolder.rewardStore.name;


    var fromRange = 0;
    if (params.fromRange) {
        fromRange = +params.fromRange;
    }

    var startPrice = null;
    if (params.startPrice) {
        startPrice = +params.startPrice;
    }

    var endPrice = null;
    if (params.endPrice) {
        endPrice = +params.endPrice;
    }

    var sortParam = 'title';
    if (params.sort) {
        sortParam = params.sort;
    } else if (sort) {
        sortParam = sort;
    }

    var ascParam = true;
    if (params.asc) {
        ascParam = params.asc === 'true';
    } else if (asc) {
        ascParam = sort;
    }

    var category = null;
    if (page.is('category')) {
        category = page.name;
    }

    return applications.rewardStore.productSearch(rewardStoreName, params.q, category, startPrice, endPrice, fromRange, numberOfProducts, sortParam, ascParam);
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
