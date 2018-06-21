function doWallSearch(forum, pageFrom, pageSize) {
    log.info("doSomething");

    var query = {
        "stored_fields": [
            "name",
            "title",
            "relatedAppName",
            "relatedId"
        ],
        "from": pageFrom,
        "size": pageSize
    };
    appendCriteria(query, forum);

    var queryText = JSON.stringify(query);
    log.info("query: {}", queryText);
    var results = services.searchManager.search(queryText, 'forumPost');
    return results;
}


function appendCriteria(query, forum) {
    // TODO: Add constraint to limit to posts from current user and followers
    var must = [
        {"term": {"forumId": forum.id}}
    ];

    query.query = {
        "bool": {
            "must": must
        }
    };

}