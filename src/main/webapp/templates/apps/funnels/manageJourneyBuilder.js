$(function(){
    initSideBar();
    initContextMenu();
    initSaveButton();
});

jsPlumb.ready(function () {

    var json = $("#funnelJson").text();
    var funnel = $.parseJSON(json);
    var funnelNodes = {};

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
        instance.draggable(el);
        var maxConnections = 1;
        if (type === 'decision'){
            maxConnections = 2;
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

    function newNode(node, type) {
        var d = document.createElement("div");
        d.className = "w " + type;
        d.id = node.nodeId;
        if (type !=='timeout'){
            if (node.name){
                d.innerHTML = '<div class="inner">' + node.name + ' <div class="ep"></div></div>';
            } else {
                d.innerHTML = '<div class="inner">' + node.nodeId + ' <div class="ep"></div></div>';
            }
        }
        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        instance.getContainer().appendChild(d);
        initNode(d, type);
        return d;
    }
    window.newNode = newNode;

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
                instance.connect({ source: node.nodeId, target: dest.nodeId, type:"basic" });
            } else {
                var timeoutNode = {nodeId: node.nodeId+'-timeout', name: 'timeout', x: node.x + 20, y: node.y + 20};
                newNode(timeoutNode, 'timeout');
                instance.connect({ source: node.nodeId, target: timeoutNode.nodeId, type:"basic" });
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

    window.jsPlumpInstance = instance;
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
            var node = {nodeId: 'node'+ id, name: 'New '+type, x: ui.offset.left-200, y: ui.offset.top-300};
            newNode(node, type);
            console.log('drop',ui);
        }
    });
}

function initContextMenu(){
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".w",
        // define the elements of the menu
        items: {
            edit: {name: "Edit", icon: "fa-pencil", callback: function(key, opt){
                // Alert the key of the item and the trigger element's id.
                //alert("Clicked on " + key + " on element " + opt.$trigger.attr("id"));
                $('#modalEditNode').modal();
            }},
            delete: {name: "Delete", icon: 'fa-trash', callback: function(key, opt){
                var c = confirm('Are you sure you want to delete this node?');
                if (c) {
                    opt.$trigger.remove();
                }
            }}
        }
        // there's more, have a look at the demos and docs...
    });
}

function initSaveButton(){
    $('#btnSave').on('click', function(e){
        e.preventDefault();

        var connections = jsPlumpInstance.getAllConnections();
        console.log(connections);
    });
}