controllerMappings.addComponent("learner/components", "modulesTile", "html", "Displays available modules for current user in tile format", "Learning App;Tile component");
controllerMappings.addComponent("learner/components", "modulesList", "html", "Displays modules in list or grid format", "Learning App");
controllerMappings.addComponent("learner/components", "coursePicker", "html", "Displays course picker", "Learning App");
controllerMappings.addComponent("learner/components", "courseDescription", "html", "Displays course description", "Learning App");
controllerMappings.addComponent("learner/components", "moduleStatuses", "html", "Displays table of module statuses", "Learning App");
controllerMappings.addComponent("learner/components", "certificates", "html", "Lists the user's certificates", "Learning App");

controllerMappings.addQuery("/APP-INF/queries/learningCompletedModules.query.json", ["profile"], []);
controllerMappings.addQuery("/APP-INF/queries/learningStartedModules.query.json", ["profile"], []);

controllerMappings.addTableDef("tableLearnersCompletedCourses", "Learners Completed Courses", "loadLearnersCompletedCourses")
    .addHeader("Name")
    .addHeader("Join Data")
    .addHeader("Last Login Date")
    .addHeader("Compeleted Courses");
    
function loadLearnersCompletedCourses(start, maxRows, rowsResult, rootFolder) {  
    log.info("START -----> {}, {}", start, http.request.params["items-per-page"]);
    log.info("page -----> {}",  http.request);
    log.info("HEREEEEEEEE")
    var profileQuery = {
        "stored_fields":[
            "lastVisit",
            "firstName",
            "surName",
            "userId"
        ],
       "query": {
            "bool": {
              "must": [  
                    {
                        "type": {
                            "value": "profile"
                        }
                    }
                ]
            }
        },
        "size":10000
    }
            
    if (queryManager.selectedOrgIds && queryManager.selectedOrgIds.length){
        var arr = [];
        queryManager.selectedOrgIds.forEach(function (item) {
            arr.push(item);
        });
        profileQuery.query.bool.must.push({
            "terms": {
                "parentOrgs": arr
            }
        });
    }
    
    
    var sm = applications.search.searchManager;
    var profileResp = sm.search(JSON.stringify(profileQuery), 'profile');
    
    for (var index in profileResp.hits.hits) {
        log.info("*** - ?? {} ", index)        
        rowsResult.addRow();
        
        var profile = profileResp.hits.hits[index]
        
        var user = applications.userApp.findUserResourceById(profile.fields.userId.value);
        if (user) {
            var link = "<a href='/custs/" + user.name + "'>" + user.thisUser.formattedName + "</a>";
            rowsResult.addCell(link);
            rowsResult.addCell(user.createDate ? formatter.formatDate(user.createDate) : "-"); 
            rowsResult.addCell(user.lastVisit ? formatter.formatDate(user.lastVisit) : "-");                   
        } else {
            rowsResult.addCell("-");
            rowsResult.addCell("-");
            rowsResult.addCell("-");
        }
        
        var learingQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "type": {
                                "value": "moduleStatus"
                            }
                        },
                        {
                            "term": {
                                "profile": user.userId 
                            }
                        },                        
                        {
                            "term": {
                                "complete": "true"
                            }
                        }
                    ]
                }
            },  
            "aggs": {                 
                "completed_courses":{  
                    "value_count" : { 
                        "field" : "complete" 
                    } 
                }                
            },
            "size": 1000,
            "from": 0
        }
        
        
        var learningResp = sm.search(JSON.stringify(learingQuery), 'profile');
        var completedModules = learningResp.aggregations.get("completed_courses").value;
        var userModules = applications.learning.findAvailableModulesForProfile(user.profile);                
        
        var completedModulesPercent = formatter.toPercent(completedModules, userModules.length, true, false, 0)
                
        rowsResult.addCell(completedModulesPercent);
        rowsResult.flush();
        
    }                    
}


controllerMappings.addTableDef("tableLearnersModulesDetails", "Learners Modules Details", "loadLearnersModulesDetails")
    .addHeader("Program")
    .addHeader("Course")
    .addHeader("Module")
    .addHeader("Certificate")
    .addHeader("Renwale")
    .addHeader("Expire")
    .addHeader("Date completed");
    
    
function loadLearnersModulesDetails(start, maxRows, rowsResult, rootFolder) {        
    
    var profileId = http.request.params.profileId;
    var user = applications.userApp.findUserResource(profileId);
    var modulesResp = applications.learning.searchModuleStatuses(profileId, start, maxRows)
        
    for(var i in modulesResp.records){
        var record = modulesResp.records[i];
        
        var link = "";        
        var module = rootFolder.find("/programs/"+record.programCode+"/"+record.courseCode+"/"+record.moduleCode);  
        if(module){            
            var certificates = module.certificateHrefs(user, record);                
            if (record.complete && certificates.length > 0){
                link = "<a href='"+ certificates[0] +"'> view </a>";
            }        
        }
        
        rowsResult.addRow();
        
        rowsResult.addCell(record.programCode);
        rowsResult.addCell(record.courseCode);
        rowsResult.addCell(record.moduleCode);
        rowsResult.addCell(link);
        rowsResult.addCell(formatter.formatDate(record.renewalDate));
        rowsResult.addCell(formatter.formatDate(record.expiryDate));
        if(record.complete){
           rowsResult.addCell(formatter.formatDate(record.modifiedDate)); 
        }else{
            rowsResult.addCell("In Progress"); 
        }
        
        rowsResult.flush();    
    }
            
}

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