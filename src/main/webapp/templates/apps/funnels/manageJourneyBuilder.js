var funnel;
var availableTriggers;
var funnelNodes = {};
var JBApp = {};
$(function(){
    initSideBar();
    initContextMenu();
    initSaveButton();
});

jsPlumb.ready(function () {

    try {
        funnel = $.parseJSON($("#funnelJson").text());
    } catch (e) {
        flog('no funnel found');
        funnel = { nodes: [
            {
                "begin" : {
                    "nodeId" : "beginNode",
                    "transition" : {
                        "nextNodeId" : "",
                        "trigger" : {
                            "contactFormTrigger" : {
                                "contactFormPath" : "/contactus",
                                "websiteName" : "",
                                "description" : "Contact form: /contactus"
                            }
                        }
                    },
                    "onePerProfile" : false,
                    "stageName" : "",
                    "source" : "",
                    "x" : 0,
                    "y" : 0
                }
            }
        ]};
    }
    availableTriggers = $.parseJSON($("#triggers").text());

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"StateMachine",
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.5
            } ],
            [ "Label", { label: "", id: "label", cssClass: "aLabel" }]
        ],
        Container: "paper"
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    window.jsp = instance;

    var canvas = document.getElementById("paper");
    var windows = jsPlumb.getSelector("#paper .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        instance.detach(c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        if (info.targetId.indexOf('timeout')!==-1){
            info.connection.getOverlay("label").setLabel('timeout');
        } else {
            info.connection.getOverlay("label").setLabel('then');
        }
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    //jsPlumb.on(canvas, "dblclick", function(e) {
    //    var nodeId = prompt('Enter nodeId');
    //    if (nodeId){
    //        newNode(nodeId, e.offsetX, e.offsetY);
    //    }
    //});

    //
    // initialise element as connection targets and source.
    //
    function initNode(el, type) {

        // initialise draggable elements.
        instance.draggable(el, {containment:true});
        var maxConnections = 1;
        if (type === 'decision'){
            maxConnections = 2;
        } else if (type === 'goal'){
            maxConnections = 5;
        }
        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: maxConnections,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: false
        });

        if (type === 'action'){
            instance.addEndpoint(el, {
                anchor:[ "Perimeter", { shape:"Diamond" } ]
            });
        }


        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    }

    function newNode(node, type, newNode) {
        var d = document.createElement("div");
        d.className = "w " + type;
        if (newNode) {
            node.nodeId = 'new-'+ node.nodeId;
            node.name = 'new-'+ node.name;
        }
        d.id = node.nodeId;
        d.setAttribute('data-type', type);
        if (type !=='timeout'){
            if (node.name){
                d.innerHTML = '<div class="inner"><span>' + node.name + '</span> <div class="ep"></div></div>';
            } else {
                d.innerHTML = '<div class="inner"><span>' + node.nodeId + '</span> <div class="ep"></div></div>';
            }
        }
        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        instance.getContainer().appendChild(d);
        initNode(d, type);
        return d;
    }
    JBApp.newNode = newNode;
    JBApp.initNode = initNode;

    function initConnection(node, type){
        var nextNodeId;
        var nextNodeIds = [];
        if (node.nextNodeId){
            nextNodeId = node.nextNodeId;
        } else if (node.transition && node.transition.nextNodeId){
            nextNodeId = node.transition.nextNodeId;
        } else if (node.transitions && node.transitions.length){
            for(var i = 0; i < node.transitions.length; i++){
                nextNodeIds.push(node.transitions[i].nextNodeId);
            }
        }

        if (node.hasOwnProperty('timeoutNode')){
            var dest = node.timeoutNode;
            if (dest) {
                instance.connect({ source: node.nodeId, target: dest, type:"basic" });
            } else {
                //var timeoutNode = {nodeId: node.nodeId+'-timeout', name: 'timeout', x: node.x -100, y: node.y +100};
                //newNode(timeoutNode, 'timeout');
                //instance.connect({ source: node.nodeId, target: timeoutNode.nodeId, type:"basic" });
            }
        }


        if (nextNodeIds.length){
            for (var i = 0; i < nextNodeIds.length; i++){
                instance.connect({ source: node.nodeId, target: nextNodeIds[i], type:"basic" });
                if (funnelNodes[nextNodeIds[i]]){
                    initConnection(funnelNodes[nextNodeIds[i]]);
                }
            }
        } else if (nextNodeId) {
            instance.connect({ source: node.nodeId, target: nextNodeId, type:"basic" });
            if (funnelNodes[nextNodeId]){
                initConnection(funnelNodes[nextNodeId]);
            }
        }
    }

    // suspend drawing and initialise.
    instance.batch(function () {
        if (funnel && funnel.nodes && funnel.nodes.length){
            // Finding begin node
            var beginNode;
            for(var i = 0; i < funnel.nodes.length; i++){
                var node = funnel.nodes[i];
                for (var key in node){
                    if (node.hasOwnProperty(key)){
                        funnelNodes[node[key].nodeId] = node[key];
                        var type = key;
                        if (['goal', 'decision', 'begin'].indexOf(key)===-1){
                            type = 'action';
                        }
                        newNode(node[key], type);
                        if (key === 'begin') {
                           beginNode = node[key];
                        }
                    }
                }
            }
        }
        // and finally, make first connection start from begin node
        if (beginNode){
            initConnection(beginNode);
        }
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

    JBApp.jsPlumpInstance = instance;
});

function initSideBar(){
    $('.right-panel .list-group-item').draggable({
        revert: 'invalid',
        tolerance: 'pointer',
        helper: 'clone',
        start: function (e, ui) {

        },
        stop: function (e, ui) {
            console.log('stop',ui);
        }
    });

    $('#paper').droppable({
        drop: function( event, ui ) {
            var type = ui.draggable.attr('data-type');
            var id = jsPlumbUtil.uuid();
            var node = {nodeId: 'node-'+type+'-'+ id, name: 'node-'+type+'-'+ id, x: ui.offset.left-200, y: ui.offset.top-300};
            JBApp.newNode(node, type, true);
            var objToPush = {};
            if (type === 'action'){
                objToPush.createDataSeriesAction = node; // default task name
                delete objToPush.createDataSeriesAction.name;
            } else {
                objToPush[type] = node;
            }
            funnel.nodes.push(objToPush);
            flog('drop', ui);
        }
    });
}

function initContextMenu(){
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".w",
        // define the elements of the menu
        items: {
            edit: {name: "Edit node id", icon: "fa-pencil", callback: function(key, opt){
                // Alert the key of the item and the trigger element's id.
                var id =  opt.$trigger.attr("id");
                if (!id.startsWith('new-') && id.length < 36){
                    alert('Could not edit existing node id');
                } else {
                    var id =  opt.$trigger.attr("id");
                    var p = prompt('Please enter new node id', id);
                    if (p && p!== id && !nodeExisted(p)){
                        var node = updateNode(id, p);
                        var type = opt.$trigger.attr('data-type');
                        if (type === 'action') {
                            delete node.name;
                        }
                        JBApp.newNode(node, type);
                        JBApp.jsPlumpInstance.remove(id);
                    } else {
                        alert('Could not change node id: '+ p);
                    }
                }
            }},
            transitions: {name: 'Transitions', icon: 'fa-bus', callback: function(key, opt){
                if (opt.$trigger.hasClass('goal')){
                    var id =  opt.$trigger.attr("id");
                    var connections = JBApp.jsPlumpInstance.getAllConnections();
                    showTransitionsModal(id, connections);
                } else {
                    Msg.warning('Transitions is not available for selected node');
                }
            }},
            detail: {name: "Node detail", icon: "fa-link", callback: function(key, opt){
                // Alert the key of the item and the trigger element's id.
                var id =  opt.$trigger.attr("id");
                var href = window.location.pathname;
                if (!href.endsWith('/')){
                    href += '/';
                }
                window.location.pathname = href + id;
            }},
            delete: {name: "Delete node", icon: 'fa-trash', callback: function(key, opt){
                var c = confirm('Are you sure you want to delete this node?');
                if (c) {
                    var id =  opt.$trigger.attr("id");
                    deleteNode(id);
                    JBApp.jsPlumpInstance.remove(id);
                }
            }}
        }
        // there's more, have a look at the demos and docs...
    });
}

function updateNode(oldNodeId, newNodeId){
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for(var key in node){
            if(node[key].nodeId === oldNodeId){
                node[key].nodeId = newNodeId;
                node[key].name = newNodeId;
                return node[key];
            }
        }
    }
}

function deleteNode(nodeId){
    var index = -1;
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for(var key in node){
            if(node[key].nodeId === nodeId){
                index = i;
                break;
            }
        }
    }

    if (index>-1){
        funnel.nodes.splice(index, 1);
    }
}

function nodeExisted(nodeId){
    var filter = funnel.nodes.filter(function(item){
        for(var key in item){
            return item[key].nodeId === nodeId;
        }
    });
    return filter.length > 0;
}

function initSaveButton(){
    $('#btnSave').on('click', function(e){
        e.preventDefault();

        var connections = JBApp.jsPlumpInstance.getAllConnections();

        Msg.info("Saving..");
        for (var i = 0; i < funnel.nodes.length; i++){
            var node = funnel.nodes[i];
            for (var key in node) {
                if (node.hasOwnProperty(key)) {
                    var nodeId = node[key].nodeId;
                    node[key].x = parseInt($('#'+nodeId).css('left').replace('px',''));
                    node[key].y = parseInt($('#'+nodeId).css('top').replace('px',''));
                }

                findNextNodeId(key, node[key], connections);
            }
        }



        $.ajax({
            url: 'funnel.json',
            type: 'PUT',
            data: JSON.stringify(funnel),
            success: function () {
                Msg.success('File is saved!');
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
            }
        });
    });
}

function findNextNodeId(type, node, connections){
    for(var i = 0; i < connections.length; i++){
        var conn = connections[i];
        if (conn.sourceId === node.nodeId){
            if (type === 'goal'){

            } else if (type === 'begin'){
                node.transition.nextNodeId = conn.targetId;
            } else {
                node.nextNodeId = conn.targetId;
            }

        }
    }
}

function findTransitions(nodeId, connections) {
    var arr = [];
    for(var i = 0; i < connections.length; i++){
        var conn = connections[i];
        if (conn.sourceId === nodeId){
            arr.push(conn.targetId);
        }
    }
    return arr;
}

function getAvailableTrans(currentNode, connections, currentTransNodeId){
    var availableTrans = findTransitions(currentNode.nodeId, connections);
    var availableTransHtml = '';
    for(var i = 0; i < availableTrans.length; i++){
        if (currentTransNodeId === availableTrans[i]){
            availableTransHtml += '<option selected value="'+availableTrans[i]+'">'+availableTrans[i]+'</option>';
        } else {
            availableTransHtml += '<option value="'+availableTrans[i]+'">'+availableTrans[i]+'</option>';
        }
    }
    return availableTransHtml;
}

function showTransitionsModal(nodeId, connections){
    var modal = $('#modalTransitions');
    var currentNode;
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for (var key in node) {
            if (node.hasOwnProperty(key)) {
                if (node[key].nodeId == nodeId){
                    currentNode = node[key];
                    break;
                }
            }
        }
    }
    if (currentNode) {
        var title = 'Transitions for ' + currentNode.nodeId;
        modal.find('.modal-title').text(title);
        var transitions = currentNode.transitions || [];
        var availableTrans = findTransitions(currentNode.nodeId, connections);
        for (var i = 0; i < availableTrans.length; i++){
            if (currentNode.nodeId === availableTrans[i].sourceId) {

            }
        }
        var transitions = currentNode.transitions || [];
        var html = '';
        for (var i = 0; i < transitions.length; i++){
            html+=  '<div class="form-group transitionItem">' +
                        '<label for=""><strong>nextNodeId</strong></label>' +
                        '<select name="" class="form-control">' +
                            getAvailableTrans(currentNode, connections, transitions[i].nextNodeId) +
                        '</select>' +
                        '<br><label for=""><strong>trigger</strong></label><br>';
            var count = 0;
            for(var key in transitions[i].trigger) {
                var t = transitions[i].trigger[key];
                if (Object.keys(transitions[i].trigger).length > count + 1){
                    html += '<hr>';
                }
                html+='<p>'+key+'</p>';
                html+='<ul>';
                for (j in t){
                    html += '<li>' + j +': '+ t[j] + '</li>';
                }
                html += '</ul>';
                count++;

            }

            html += '</div><hr>';
        }
    }
    if (!html) {
        html = '<p>No transition found</p>';
    }
    modal.find('form').html(html);
    modal.modal();
}

function buildTriggerDropdown(selected){
    var html = '<select name="trigger">';
    for(var i = 0; i < availableTriggers.triggers.length; i++) {
        if (selected === availableTriggers.triggers[i].name) {
            html+= '<option selected value="'+availableTriggers.triggers[i].type+'">'+availableTriggers.triggers[i].name+'</option>';
        } else {
            html+= '<option value="'+availableTriggers.triggers[i].type+'">'+availableTriggers.triggers[i].name+'</option>';
        }
    }
    return html;
}