controllerMappings.addActionNodeType("pipeDriveNode", "KPipeDriveIntegration/jb/pipeDrive.js", 'handlePipeDriveNode');
controllerMappings.addActionNodeType("pipeDriveCheckDealNode", "KPipeDriveIntegration/jb/pipeDriveCheckDeal.js", 'handlePipeDriveCheckDealNode');

controllerMappings
    .websiteController()
    .path('/pipeDrive')
    .addMethod('GET', 'pipeDriveFunction')
    .isPublic(true)
    .enabled(true)
    .build();


var devApiToken = "e986865be8e73333709b54c66c534f48cd19be98";
var prodApiToken = "75341093ce2676b43be484c4f5dad82846c23998";
var apiToken = devApiToken;

var createProfileURL = "https://api.pipedrive.com/v1/persons?api_token=" + apiToken ;
var createDealURL = "https://api.pipedrive.com/v1/deals?api_token=" + apiToken ;
    
    
function handlePipeDriveNode(rootFolder, lead, funnel, exitingNode, settings, nodeIds) {
    
    var claimGroup = lead.getFieldValue("claim_group_recordId");
    log.info("Claim Group ---> {}", claimGroup);
    
    // TODO:: Get details from Contact Requests.. 
    var contactRequestResponse = applications.salesDataClaimer.call('getClaimGroupContactRequest', rootFolder, claimGroup);
    var contactRequest = {};
    if(contactRequestResponse.hits.hits.length > 0){
        contactRequest = contactRequestResponse.hits.hits[0].source;
    }
    
    var result = applications.salesDataClaimer.call('searchClaims', rootFolder, null, null, claimGroup);
    var invoiceURL = "";
    if(result.hits.hits.length > 0){
        invoiceURL = "https://claims.mhiaapromo.com.au/" + result.hits.hits[0].fields.receipt.value;
    }
     
    // Prepare preson object
    var personInfo = {
        "first_name": contactRequest.firstName,
        "last_name": contactRequest.surName,
        "phone": contactRequest.phone,
        "email": contactRequest.email,
        "title": contactRequest.title,
        "address1": contactRequest.address1,
        "account_name": contactRequest["account-name"],
        "bank_name": contactRequest["bank-name"],
        "bsb_number": contactRequest["bsb-number"],
        "account_no": contactRequest["account-no"]
    };
    
    if(contactRequest.address2){
        personInfo["address2"] = contactRequest.address2;
    }
    
    if(contactRequest.suburb){
        personInfo["suburb"] = contactRequest.suburb;
    }
    
    if(contactRequest.postcode){
        personInfo["postcode"] = contactRequest.postcode;
    }
    
    if(contactRequest.state){
        personInfo["state"] = contactRequest.state;
    }
    
    var profileId = 0;
    profileId = checkProfile(personInfo.email);
    if(profileId === 0){
        var profileResponse = createPipeDriveProfile(personInfo);
        profileId = profileResponse.data.id;
    }
    
    
    // Prepare deal object
    var dealInfo = {
        "title": claimGroup, // to be fetched from leads
        "status": "open",
        "stage_id": 1, // TODO:: to be set to 93 in production env
        "person_id": profileId,
        "promo_name": "MHIAA AU Winter '18",
        "promotion": contactRequest.promotion,
        "claims_number": contactRequest["claims-number"],
        "prod1_model_number": contactRequest["prod1-model-number"],
        "prod1_indoor_model_number": contactRequest["prod1-indoor-model-number"],
        "prod1_indoor_serial_number": contactRequest["prod1-indoor-serial-number"],
        "prod1_consumer_bonus": contactRequest["prod1-consumer-bonus"],
        "prod1_arbitrary_serial": contactRequest["prod1-arbitrary-serial"],
        "action_type": contactRequest["action-type"],
        "purchase_date" : contactRequest["purchase-date"]
    };
    
    
    dealInfo["invoice_link"] = invoiceURL;
    dealInfo["claim_submitted"] = contactRequest.createdDate ? formatter.toDate(contactRequest.createdDate) : null;
    dealInfo["expected_close_date"] = contactRequest.createdDate ? formatter.addDays(contactRequest.createdDate, 28) : null; 
    
    
    dealInfo["prod2_model_number"] = contactRequest["prod2-model-number"] ? contactRequest["prod2-model-number"] : null;
    dealInfo["prod2_indoor_model_number"] = contactRequest["prod2-indoor-model-number"] ? contactRequest["prod2-indoor-model-number"] : null;
    dealInfo["prod2_indoor_serial_number"] = contactRequest["prod2-indoor-serial-number"] ? contactRequest["prod2-indoor-serial-number"] : null;
    dealInfo["prod2_consumer_bonus"] = contactRequest["prod2-consumer-bonus"] ? contactRequest["prod2-consumer-bonus"] : null;
    dealInfo["prod2_arbitrary_serial"] = contactRequest["prod2-arbitrary-serial"] ? contactRequest["prod2-arbitrary-serial"] : null;
    
    
    dealInfo["prod3_model_number"] = contactRequest["prod3-model-number"] ? contactRequest["prod3-model-number"] : null;
    dealInfo["prod3_indoor_model_number"] = contactRequest["prod3-indoor-model-number"] ? contactRequest["prod3-indoor-model-number"] : null;
    dealInfo["prod3_indoor_serial_number"] = contactRequest["prod3-indoor-serial-number"] ? contactRequest["prod3-indoor-serial-number"] : null;
    dealInfo["prod3_consumer_bonus"] = contactRequest["prod3-consumer-bonus"] ? contactRequest["prod3-consumer-bonus"] : null;
    dealInfo["prod3_arbitrary_serial"] = contactRequest["prod3-arbitrary-serial"] ? contactRequest["prod3-arbitrary-serial"] : null;
    
    
    dealInfo["installer_email"] = contactRequest["installer-email"] ? contactRequest["installer-email"] : null;
    dealInfo["installer_contact_name"] = contactRequest["installer-contact-name"] ? contactRequest["installer-contact-name"] : null;
    dealInfo["installer_abn"] = contactRequest["installer-abn"] ? contactRequest["installer-abn"] : null;
    dealInfo["installer_trade_license"] = contactRequest["installer-trade-license"] ? contactRequest["installer-trade-license"] : null;
    
    
    var dealResponse = createPipeDriveDeal(dealInfo);
    
    if(!dealResponse.success){
       return nodeIds['notReached']; 
    }
    
    // TODO:: Save dealId into lead
    var dealId = dealResponse.data.id;
    lead.setFieldValue("pipedrive_deal_id", dealId);
    
    return nodeIds['nextNodeId'];
}

function handlePipeDriveCheckDealNode(rootFolder, lead, funnel, exitingNode, settings, nodeIds) {

    log.info("LEAD Deal Id --> {}", lead.getFieldValue("pipedrive_deal_id"));
    
    // TODO:: Get DealId from lead ..
    var dealId = lead.getFieldValue("pipedrive_deal_id");
    
    var response = checkDeal(dealId);
    
    log.info("response status--> {}, stage_no--> {}, stage_id--> {}", response.success, response.data.stage_order_nr, response.data.stage_id);
    
    if(!response.success){
        return nodeIds['notReached'];
    }
    
    var stageOrderNumber = response.data.stage_order_nr;
    var stageId = response.data.stage_id;
    var funnelStages = funnel.getStages();
    var funnelStagesMap = {};
    
    for(var index in funnelStages){
        funnelStagesMap[funnelStages.get(index).getName()] = index + 1; 
    }
    
    log.info("Data  --> Local : {} , Romote {}", funnelStagesMap[settings.stage] , stageOrderNumber );
    
    lead.setStageName(settings.stage);
    lead.setFieldValue("display_for_customers", settings.displayForCustomers);
    lead.setFieldValue("description_for_customers", settings.description);
    
    if(funnelStagesMap[settings.stage] < stageOrderNumber) {
        log.info("From "+ settings.stage +" = Next Node ----->" );
        //log.info("stage --> {},  display_for_customers --> {}, description_for_customers --> {}", settings.stage, settings.displayForCustomers, settings.description );
        return nodeIds['nextNodeId'];
    }else if( funnelStagesMap[settings.stage] == stageOrderNumber ){
        log.info("From "+ settings.stage +" = Timer Node ----->" );
        return nodeIds['notReached'];
    }else if( ( funnelStagesMap[settings.stage] > stageOrderNumber ) ){
        log.info("From "+ settings.stage +" = Previous Node ----->" );
        return nodeIds['previousNodeId'];
    }
}

function checkProfile(profileEmail){
    var checkProfileURL = "https://api.pipedrive.com/v1/persons/find?term=" + profileEmail + "&start=0&search_by_email=1&api_token=" + apiToken ;
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", checkProfileURL, false);
    xhr.send();
    var response = JSON.parse(xhr.getResponse().getResponseBody());
    log.info(response.toString())
    if(!response.success){
        return 0;
    }else{
        if(response == null || response.data == null || response.data.length === 0){
            return 0;
        }else{
            return response.data[0].id;
        }
    }
}

function checkDeal(dealId){
    var checkDealURL = "https://api.pipedrive.com/v1/deals/" + dealId + "?api_token=" + apiToken ;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", checkDealURL, false);
    xhr.send();
    var response = JSON.parse(xhr.getResponse().getResponseBody());
    return response;
}

function pipeDriveFunction(page, params) {
    log.info('pipeDriveFunction > page={}, params={}', page, params);
    
    // TODO:: Get details from Contact Requests.. 
    // 
    // TODO:: Must check if the profile already exist..
    
    
    // Prepare preson object
    var personInfo = {
        "first_name": "node Mohammed",
        "last_name": "Eldadah",
        "phone": "987654321",
        "email": "mrdadah@kademi.co",
        "title": "Mr.",
        "address1": "address 1",
        // "consumer_bonus": "",
        "account_name": "mohammed Eldadah account",
        "bank_name": "back name",
        "bsb_number": "123-456",
        "account_no": "8765432"
    };
    
    if(true){
        personInfo["address2"] = "address 2";
    }
    
    if(true){
        personInfo["suburb"] = "address suburb";
    }
    
    if(true){
        personInfo["postcode"] = "0321";
    }
    
    if(true){
        personInfo["state"] = "state";
    }
    
    // var profileResponse = createPipeDriveProfile(personInfo);
    // var profileId = profileResponse.data.id;
    
    // Prepare deal object
    var dealInfo = {
        "title": "mhi-w00008", // to be fetched from leads
        "status": "open",
        "stage_id": "1", // to be set to 93 in production env
        "person_id": "9", // to be set to profileId
        "promo_name": "MHIAA AU Winter '18",
        "promotion": "promotion",
        "claims_number": "2",
        "prod1_model_number": "12345",
        "prod1_indoor_model_number": "6543",
        "prod1_indoor_serial_number": "23456",
        "prod1_consumer_bonus": "200",
        "action_type": "supply & install"
    };
    
    // TODO:: Check if invoice_link exist in contact request
    if(true){
        dealInfo["invoice_link"] = "invoice_link";
    }
    
    // TODO:: Check if claim_submitted exist in contact request
    if(true){
        dealInfo["claim_submitted"] = "claim_submitted";
    }
    
    // TODO:: Check if prod2 exist in contact request
    if(true){
        dealInfo["prod2_model_number"] = "prod2_model_number";
        dealInfo["prod2_indoor_model_number"] = "prod2_indoor_model_number";
        dealInfo["prod2_indoor_serial_number"] = "prod2_indoor_serial_number";
        dealInfo["prod2_consumer_bonus"] = "200";
    }
    
    // TODO:: Check if prod3 exist in contact request
    if(true){
        dealInfo["prod3_model_number"] = "prod3_model_number";
        dealInfo["prod3_indoor_model_number"] = "prod3_indoor_model_number";
        dealInfo["prod3_indoor_serial_number"] = "prod3_indoor_serial_number";
        dealInfo["prod3_consumer_bonus"] = "200";
    }
    
    if(true){
        dealInfo["installer_email"] = "address suburb";
    }
    
    var dealResponse = createPipeDriveDeal(dealInfo);
    var dealId = dealResponse.data.id;
    
    return views.jsonObjectView(JSON.stringify({"data":dealResponse , "done": true}));
    
}

function createPipeDriveProfile(personInfo){
    var personsKeys = {
        "name":"name",
        "phone":"phone",
        "email":"email",
        "title":"89cf14f399ca1b16819d9f7f64f6c81b9c8ada1a",
        "first_name":"a9c00bcf740d3bede272c36c736d9183ac8da04f",
        "last_name":"f395c948abb44d20ac706249808be607a8bbde05",
        "job_title":"a8a9559c373df53b8edd39438a4ffed11493274e",
        "address1":"77fa8b26cd289a115d6cf627b73b9a239a8a5161",
        "address2":"6a297096cfe3c4c0782660ad00a0985bc4680324",
        "suburb":"fbd7580f2b656c4b133a3abbb95c2bc5cdd331da",
        "postcode":"4aae15dd8435adbcda95916b13c9f224d148fc73",
        "state":"1c964cf38afa7754ec4252a46cabe925112b9ffa",
        "country":"6cc1d7607ce760ac4c789ca4d5c9c789225ca91f",
        "consumer_bonus":"c6a34229139f23a9ae5a87ee76b292f10eebea99",
        "consumer_acc_name":"ba2d0d71a632246c326a1035de422c5377756dea",
        "consumer_bank_name":"aa6daeafd37ff9811518d3a6c975c5c9a8a1463b",
        "consumer_bsb":"a05795327edc8f3352fb85de0b1f2ece54bac655",
        "consumer_acc":"c40224b835bd716ac5c55ca96c0bf68db3b24492"
    };
    
    // Create Person 
    var profileFormData = new FormData();
    profileFormData.append(personsKeys.name, personInfo.first_name + " " + personInfo.last_name);
    profileFormData.append(personsKeys.phone, personInfo.phone);
    profileFormData.append(personsKeys.email, personInfo.email);
    profileFormData.append(personsKeys.title, personInfo.title);
    profileFormData.append(personsKeys.first_name, personInfo.first_name);
    profileFormData.append(personsKeys.last_name, personInfo.last_name);
    profileFormData.append(personsKeys.address1, personInfo.address1);
    if(personInfo.address2){
       profileFormData.append(personsKeys.address2, personInfo.address2); 
    }
    if(personInfo.suburb){
       profileFormData.append(personsKeys.suburb, personInfo.suburb); 
    }
    if(personInfo.postcode){
       profileFormData.append(personsKeys.postcode, personInfo.postcode); 
    }
    if(personInfo.state){
       profileFormData.append(personsKeys.state, personInfo.state); 
    }
    
    profileFormData.append(personsKeys.consumer_acc_name, personInfo.account_name);
    profileFormData.append(personsKeys.consumer_bank_name, personInfo.bank_name);
    profileFormData.append(personsKeys.consumer_bsb, personInfo.bsb_number);
    profileFormData.append(personsKeys.consumer_acc, personInfo.account_no);
    
    
    var xhr = new XMLHttpRequest();
    //xhr.open("POST", "https://api.pipedrive.com/v1/persons?api_token=e986865be8e73333709b54c66c534f48cd19be98");
    xhr.open("POST", createProfileURL, false);
    //xhr.open("GET", "https://api.pipedrive.com/v1/persons/find?term=mohammed&start=0&api_token=e986865be8e73333709b54c66c534f48cd19be98", false);
    
    
    xhr.send(profileFormData);
    var response = JSON.parse(xhr.getResponse().getResponseBody());
    return response;
}

function createPipeDriveDeal(dealInfo){
    var dealsKeys = {
        "title":"title",
        "status":"status",
        "stage_id":"stage_id",
        "person_id":"person_id",
        "expected_close_date": "expected_close_date",
        "invoice_link":"c2938a766b4f99eb2c3f440ca40d53778b5ad449",
        "promo_name":"ec9398b31908c0f25650ceb57a480fe7c828da89",
        "claim_submitted":"aa4244358b7c167903946d4d99a0ef53198c0064",
        "number_of_claims":"bea8299dfce263a1cf4458c6420a6eaa5a08f807",
    
        "model_no_1":"bf0566a13638f574da144fa6dc340172bd1d984d",
        "indoor_model_no_1":"4c843fca6ba2d1dae497f8f900554adce6bc91c0",
        "indoor_serial_no_1":"6298c810b4166c4013aeda371031b6065dcdbbef",
        "consumer_bonus_1":"d6ee808d926066327625d325fcc5aa35673fe3ff",
        "arbitrary_serial_1":"859eb582ff62df7b90b0af0acf3ea8b42f02b572",
    
        "model_no_2":"0896056dc2900a7a5151132af4c09823c4fa6293",
        "indoor_model_no_2":"dce247f19f66a850696eaa138d742162747f3b89",
        "indoor_serial_no_2":"957fc2213cadb832cb1581624594f1cb685f9884",
        "consumer_bonus_2":"a552b89f952a6ea5ea0d6226747fb89ccc6107f7",
        "arbitrary_serial_2":"8461980a14111760063c5db45a89d26403df2fe8",
    
        "model_no_3":"8b3dc353dcdc8cfbeaba67c9bd96088fb4f7f718",
        "indoor_model_no_3":"88eec35a703b441864b5b8dbe1ad076c9bb6d1af",
        "indoor_serial_no_3":"cb7c8cae85640313874c59b649909681c13304eb",
        "consumer_bonus_3":"dded5435a7da6ea5a5ee705dee22242bce6cd526",
        "arbitrary_serial_3":"ccfe88b135c3313fe800841edf09773661ccb37e",
    
        "supply_or_install":"4c0d06ef929a79dbc1c4ecca8daf1ec779920f68",
        "installer_email":"911dfe7187263ab415cd7c05b82408f63a30b7aa",
        "installer_contact_name":"7cc9346b839c33bd990dbe7a836abd3d1f71fdcb",
        "installer_abn":"297b692402c2194da1a52be667a60b0726a4aa86",
        "installer_trade_license":"18a144cfd23901bcfc33ad7dcaf3a3156cd37a4f",
        "installer_bonus":"9ef6435408d2ddbba4b0cea268f2f8d83a812a11",
        
        "promotional_source":"fed88111ba2c89136b4ad7db972000789215d32e",
        "note_content":"fa40107367c8fc4944b42d494537805043f22692",
        "installer_paid":"5396ca2f4869dbce6c0f424f21467cc495ad6c54"
    };
    
    
    // Create Deal 
    var DealFormData = new FormData();
    DealFormData.append(dealsKeys.title, dealInfo.title);
    DealFormData.append(dealsKeys.status, "open");
    DealFormData.append(dealsKeys.stage_id, dealInfo.stage_id); // TODO:: to be set to 93
    DealFormData.append(dealsKeys.person_id, dealInfo.person_id);
    DealFormData.append(dealsKeys.promo_name, "MHIAA AU Winter '18");
    DealFormData.append(dealsKeys.supply_or_install, dealInfo.action_type); 
    DealFormData.append(dealsKeys.promotional_source, dealInfo.promotion);
    DealFormData.append(dealsKeys.number_of_claims, dealInfo.claims_number); 
    DealFormData.append(dealsKeys.model_no_1, dealInfo.prod1_model_number);
    DealFormData.append(dealsKeys.indoor_model_no_1, dealInfo.prod1_indoor_model_number); 
    DealFormData.append(dealsKeys.indoor_serial_no_1, dealInfo.prod1_indoor_serial_number); 
    DealFormData.append(dealsKeys.consumer_bonus_1, dealInfo.prod1_consumer_bonus); 
    DealFormData.append(dealsKeys.arbitrary_serial_1, dealInfo.prod1_arbitrary_serial); 
    
    
    dealInfo.invoice_link ? DealFormData.append(dealsKeys.invoice_link, dealInfo.invoice_link) : ""; // <------- ??
    
    dealInfo.claim_submitted ? DealFormData.append(dealsKeys.claim_submitted, dealInfo.claim_submitted) : "";
    dealInfo.expected_close_date ? DealFormData.append(dealsKeys.expected_close_date, dealInfo.expected_close_date) : ""; 
    
    // Prod2 details check
    dealInfo.prod2_model_number ? DealFormData.append(dealsKeys.model_no_2, dealInfo.prod2_model_number) : "";
    dealInfo.prod2_indoor_model_number ? DealFormData.append(dealsKeys.indoor_model_no_2, dealInfo.prod2_indoor_model_number) : "";
    dealInfo.prod2_indoor_serial_number ? DealFormData.append(dealsKeys.indoor_serial_no_2, dealInfo.prod2_indoor_serial_number) : ""; 
    dealInfo.prod2_consumer_bonus ? DealFormData.append(dealsKeys.consumer_bonus_2, dealInfo.prod2_consumer_bonus) : ""; 
    dealInfo.prod2_arbitrary_serial ? DealFormData.append(dealsKeys.arbitrary_serial_2, dealInfo.prod2_arbitrary_serial) : ""; 
    
    // Prod3 details check
    dealInfo.prod3_model_number ? DealFormData.append(dealsKeys.model_no_3, dealInfo.prod3_model_number) : "";
    dealInfo.prod3_indoor_model_number ? DealFormData.append(dealsKeys.indoor_model_no_3, dealInfo.prod3_indoor_model_number) : "";
    dealInfo.prod3_indoor_serial_number ? DealFormData.append(dealsKeys.indoor_serial_no_3, dealInfo.prod3_indoor_serial_number) : "";
    dealInfo.prod3_consumer_bonus ? DealFormData.append(dealsKeys.consumer_bonus_3, dealInfo.prod3_consumer_bonus) : ""; 
    dealInfo.prod3_arbitrary_serial ? DealFormData.append(dealsKeys.arbitrary_serial_3, dealInfo.prod3_arbitrary_serial) : ""; 
    
    
    dealInfo.installer_email ? DealFormData.append(dealsKeys.installer_email, dealInfo.installer_email) : "";
    dealInfo.installer_contact_name ? DealFormData.append(dealsKeys.installer_contact_name, dealInfo.installer_contact_name) : "";
    dealInfo.installer_abn ? DealFormData.append(dealsKeys.installer_abn, dealInfo.installer_abn) : "";
    dealInfo.installer_trade_license ? DealFormData.append(dealsKeys.installer_trade_license, dealInfo.installer_trade_license) : "";
    
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", createDealURL, false);
    
    
    xhr.send(DealFormData);
    var response = JSON.parse(xhr.getResponse().getResponseBody());
    return response;
}


function getAppSettings(page) {
    log.info('getAppSettings > page={}', page);

    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;

    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }

    var app = applications.get(APP_NAME);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }

    return null;
}

function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);
    
    var enableFor = params.enableFor || '';    
    page.setAppSetting(APP_NAME, 'enableFor', enableFor);
    
    return views.jsonResult(true);
}

