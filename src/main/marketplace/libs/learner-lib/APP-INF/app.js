controllerMappings.addComponent("learner/components", "modulesTile", "html", "Displays available modules for current user in tile format", "Learning App;Tile component");
controllerMappings.addComponent("learner/components", "modulesList", "html", "Displays modules in list or grid format", "Learning App");
controllerMappings.addComponent("learner/components", "coursePicker", "html", "Displays course picker", "Learning App");
controllerMappings.addComponent("learner/components", "courseDescription", "html", "Displays course description", "Learning App");
controllerMappings.addComponent("learner/components", "moduleStatuses", "html", "Displays table of module statuses", "Learning App");

function buildTableModuleStatuses(programCode, courseCode, moduleCode, complete, profile) {
    var query = {
        "query": {
            "bool": {
                "must": [
                    {
                        "type": {
                            "value": "moduleStatus"
                        }
                    }
                ]
            }
        },
        "aggs": {
            "byProgramCode": {
                "terms": {
                    "field": "programCode"
                }
            },
            "byCourseCode": {
                "terms": {
                    "field": "courseCode"
                }
            },
            "byModuleCode": {
                "terms": {
                    "field": "moduleCode"
                }
            }
        },
        "size": 1000,
        "from": 0
    };

    if (complete){
        query.query.bool.must.push({
            "term": {
                "complete": complete == 'true'
            }
        });
    }

    if (moduleCode){
        query.query.bool.must.push({
            "term": {
                "moduleCode": moduleCode
            }
        });
    }

    if (courseCode){
        query.query.bool.must.push({
            "term": {
                "courseCode": courseCode
            }
        });
    }

    if (programCode){
        query.query.bool.must.push({
            "term": {
                "programCode": programCode
            }
        });
    }

    if (profile){
        query.query.bool.must.push({
            "term": {
                "profile": params.profile
            }
        });
    }

    if (queryManager.selectedOrgIds && queryManager.selectedOrgIds.length){
        var arr = [];
        queryManager.selectedOrgIds.forEach(function (item) {
            arr.push(item);
        });
        query.query.bool.must.push({
            "terms": {
                "parentOrgs": arr
            }
        });
    }
    var sm = applications.search.searchManager;
    var resp = sm.search(JSON.stringify(query), 'profile');
    return resp;
}