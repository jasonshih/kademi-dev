


function productSearch(store, category, query) {
    var queryJson = {
        "stored_fields": [
            "name",
            "path",
            "finalCost",
            "storeId",
            "title",
            "webName",
            "primaryImageHref",
            "content"
        ],
        "size": 100
    };

    appendCriteria(queryJson, store, category, query);

    var results = services.searchManager.search(JSON.stringify(queryJson), 'ecommercestore');
    return results;
}

function productInCategorySearch(store, category, query) {
    var queryJson = {
        "size": 0,
        "aggregations": {
            "prods": {
                "terms": {
                    "field": "product"
                },
                "aggs": {
                    "cats": {
                        "terms": {
                            "field": "categoryIds"
                        }
                    }
                }
            }
        }
    };

    appendCriteria(queryJson, store, category, query);

    var results = services.searchManager.search(JSON.stringify(queryJson), 'ecommercestore');

    log.info("cat results {} - {}", results, results.class);
    // need to lookup cat id's to get titles
    var productsAgg = results.aggregations.asMap.prods;

    log.info("prods results {}", productsAgg.buckets);
    var catBuilder = services.criteriaBuilders.getBuilder("category");
    var prodBuilder = services.criteriaBuilders.getBuilder("product");
    var list = [];
    for (var i = 0; i < productsAgg.buckets.size(); i++) {
        var bucket = productsAgg.buckets[i];
        log.info(" - productsAgg bucket {} = {} = {}", bucket, bucket.keyAsNumber, bucket.docCount);
        var id = formatter.toLong(bucket.keyAsNumber);
        var prod = prodBuilder.get(id);
        if (prod != null) {
            var catsAgg = bucket.aggregations.asMap.cats;
            log.info(" - catsAgg {} {}", catsAgg, catsAgg.buckets.size());
            if (catsAgg.buckets.size() > 0) {
                for (var c = 0; c < catsAgg.buckets.size(); c++) {
                    log.info("  -- cat bucket {}", catsAgg.buckets[c]);
                    var catBucket = catsAgg.buckets[c];
                    var catId = formatter.toLong(catBucket.keyAsNumber);
                    var category = catBuilder.get(catId);
                    if (category != null) {
                        list.push({
                            product: prod,
                            category: category,
                            count: catBucket.docCount,
                            searchPath: searchPath(store, prod, category)
                        })
                    }
                }
            } else {
                list.push({
                    product: prod,
                    count: bucket.docCount,
                    searchPath: searchPath(store, prod)
                })
            }
        }
    }
    return list;
}


function appendCriteria(queryJson, store, category, query) {
    // todo filter by store and category
    var must = [
        {"term": {"storeId": store.id}}
    ];
    if (category != null) {
        must.push({"term": {"categoryIds": category.id}});
    }
    queryJson.query = {
        "bool": {
            "must": must
        }
    };
    if (query != null) {
        must.push({
            "multi_match": {
                "query": query,
                "fields": ["name^2", "title^2", "tags", "productCode^3", "supplierName", "content"],
                "type": "phrase_prefix"
            }
        });
    }
}

function searchPath(store, prod, category) {
    var path = "/" + store.name + "/";
    if (category != null) {
        path += category.name; // todo, support sub-cats
    }
    path += "/?q=" + prod.title;
    return path;
}