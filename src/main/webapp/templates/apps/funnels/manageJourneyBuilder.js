var funnel;
var availableTriggers;
var funnelNodes = {};
var JBApp = {
    initialized: false,
    ACTIONS: {
        'emailAction': '<i class="fa fa-envelope" aria-hidden="true"></i> Send Email',
        'createTaskAction': '<i class="fa fa-tasks" aria-hidden="true"></i> Create Task',
        'createDataSeriesAction': '<i class="fa fa-database" aria-hidden="true"></i> Create Data Series',
        'calendarEventAction': '<i class="fa fa-calendar-check-o" aria-hidden="true"></i> Create Calendar Event',
        'setField': '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Set Field'
    }
};
$(function () {
    initSideBar();
    initContextMenu();
    initSaveButton();
    initTranModal();
});

jsPlumb.ready(function () {
    try {
        funnel = $.parseJSON($("#funnelJson").text());
    } catch (e) {
        flog('no funnel found');
        funnel = {
            nodes: [
                {
                    "begin": {
                        "nodeId": "beginNode",
                        "transition": {
                            "nextNodeId": "",
                            "trigger": {
                                "contactFormTrigger": {
                                    "contactFormPath": "",
                                    "websiteName": "",
                                    "description": ""
                                }
                            }
                        },
                        "onePerProfile": false,
                        "stageName": "",
                        "source": "",
                        "x": 0,
                        "y": 0
                    }
                }
            ]
        };
    }
    availableTriggers = $.parseJSON($("#triggers").text());

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector: "StateMachine",
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2},
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.5
            }],
            ["Label", {label: "", id: "label", cssClass: "aLabel"}]
        ],
        Container: "paper"
    });

    instance.registerConnectionType("basic", {anchor: "Continuous", connector: "StateMachine"});
    instance.registerConnectionType("timeout", {anchor: "Continuous", connector: "StateMachine"});

    window.jsp = instance;

    var canvas = document.getElementById("paper");
    var windows = jsPlumb.getSelector("#paper .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        flog('edit connection ', c);
        var sourceId = c.sourceId;
        var targetId = c.targetId;
        var nodes = funnel.nodes;

        var filtered = nodes.filter(function(item){
            return item.hasOwnProperty('goal') && item['goal'].nodeId === sourceId;
        });

        var filtered1 = nodes.filter(function(item){
            return item.hasOwnProperty('begin') && item['begin'].nodeId === sourceId;
        });

        if (filtered.length > 0) {
            var node = filtered[0]['goal'];
            if (node.hasOwnProperty('transitions') && node.transitions.length) {
                var trans = node.transitions.filter(function(item){
                    return item.nextNodeId === targetId;
                });
                if (trans.length){
                    showTranModal(trans[0], sourceId, targetId);
                }
            }
        } else if (filtered1.length > 0) {
            var node = filtered1[0]['begin'];
            if (node.transition) {
                showTranModal(node.transition, sourceId, targetId);
            }
        } else {
            Msg.warning('No transition found');
        }
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        if (info.connection.hasType('timeout')) {
            info.connection.getOverlay("label").setLabel('timeout');
        } else {
            info.connection.getOverlay("label").setLabel('then');
        }
        if (JBApp.initialized){
            flog('new connection was made', info.connection);
            var conn = info.connection;
            var nodes = funnel.nodes;
            for(var i = 0; i < nodes.length; i ++){
                var node = nodes[i];
                for (var key in node) {
                    if (node[key].nodeId === conn.sourceId){
                        if (node[key].hasOwnProperty('transition')) {
                            flog('found a begin node');
                            node[key].transition.nextNodeId = conn.targetId;
                        } else if (node[key].hasOwnProperty('transitions')){
                            flog('found a goal node');
                            if (!node[key].transitions) {
                                node[key].transitions = [];
                            }
                            node[key].transitions.push({nextNodeId: conn.targetId});
                        } else {
                            flog('found a action or decision node');
                            node[key].nextNodeId = conn.targetId;
                        }
                        break;
                    }
                }
            }
        }
    });

    //
    // initialise element as connection targets and source.
    //
    function initNode(el, type) {

        // initialise draggable elements.
        instance.draggable(el, {containment: true});
        var maxConnections = 1;
        if (type === 'decision') {
            maxConnections = 2;
        } else if (type === 'goal') {
            maxConnections = -1;
        }
        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: {strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
            connectionType: "basic",
            extract: {
                "action": "the-action"
            },
            maxConnections: maxConnections,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            dropOptions: {hoverClass: "dragHover"},
            anchor: "Continuous",
            allowLoopback: false
        });

        //if (type === 'action') {
        //    instance.addEndpoint(el, {
        //        anchor: ["Perimeter", {shape: "Diamond"}]
        //    });
        //}


        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
    }

    function newNode(node, type, action) {
        var d = document.createElement("div");
        d.className = "w " + type;
        d.id = node.nodeId;
        d.setAttribute('data-type', type);
        var nodeName = node.name? node.name : node.nodeId;
        if (type === 'goal') {
            d.innerHTML = '<div class="title"><i class="fa fa-trophy" aria-hidden="true"></i> Goal</div>';
            d.innerHTML += '<div class="inner"><span>' + nodeName + ' <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></span> <span title="Connect to transition node" class="ep"></span> <span title="Connect to timeout node" class="ep ep-timeout"></span></div>';
        } else if(type === 'decision') {
            d.innerHTML = '<div class="title"><i class="fa fa-question-circle" aria-hidden="true"></i> Decision</div>';
            d.innerHTML += '<div class="inner"><span>' + nodeName + ' <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></span> <span title="Yes" class="ep ep-green"></span> <span title="No" class="ep ep-red"></span></div>'
        } else if (type == 'begin') {
            d.innerHTML = '<div class="title"><i class="fa fa-play" aria-hidden="true"></i> Begin</div>';
            d.innerHTML += '<div class="inner"><span>' + nodeName + ' <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></span> <span title="Connect to other node" class="ep"></span></div>';
        } else {
            var actionName = JBApp.ACTIONS[action];
            d.innerHTML = '<div class="title">'+actionName+'</div>';
            d.innerHTML += '<div class="inner"><span>' + nodeName + ' <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></span> <span title="Connect to other node" class="ep"></span></div>';
        }

        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        instance.getContainer().appendChild(d);
        initNode(d, type);
        return d;
    }

    JBApp.newNode = newNode;
    JBApp.initNode = initNode;
    JBApp.connectionInitilized = false;

    function initConnection(node, type) {
        var nextNodeId;
        var nextNodeIds = [];
        if (node.nextNodeId) {
            nextNodeId = node.nextNodeId;
        } else if (node.transition && node.transition.nextNodeId) {
            nextNodeId = node.transition.nextNodeId;
        } else if (node.transitions && node.transitions.length) {
            for (var i = 0; i < node.transitions.length; i++) {
                nextNodeIds.push(node.transitions[i].nextNodeId);
            }
        }

        if (node.hasOwnProperty('timeoutNode')) {
            var dest = node.timeoutNode;
            if (dest) {
                instance.connect({source: node.nodeId, target: dest, type: "timeout"});
            }
        }


        if (nextNodeIds.length) {
            for (var i = 0; i < nextNodeIds.length; i++) {
                instance.connect({source: node.nodeId, target: nextNodeIds[i], type: "basic"});
                if (funnelNodes[nextNodeIds[i]]) {
                    initConnection(funnelNodes[nextNodeIds[i]]);
                }
            }
        } else if (nextNodeId) {
            instance.connect({source: node.nodeId, target: nextNodeId, type: "basic"});
            if (funnelNodes[nextNodeId]) {
                initConnection(funnelNodes[nextNodeId]);
            }
        }
    }

    // suspend drawing and initialise.
    instance.batch(function () {
        if (funnel && funnel.nodes && funnel.nodes.length) {
            // Finding begin node
            var beginNode;
            for (var i = 0; i < funnel.nodes.length; i++) {
                var node = funnel.nodes[i];
                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        funnelNodes[node[key].nodeId] = node[key];
                        var type = key;
                        if (['goal', 'decision', 'begin'].indexOf(key) === -1) {
                            type = 'action';
                        }
                        newNode(node[key], type, key);
                        if (key === 'begin') {
                            beginNode = node[key];
                        }
                    }
                }
            }
        }
        // and finally, make first connection start from begin node
        if (beginNode) {
            initConnection(beginNode);
        }
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
    JBApp.jsPlumpInstance = instance;
    JBApp.initialized = true;
    flog('JBApp init done');
});

function initSideBar() {
    $('.right-panel .list-group-item').draggable({
        revert: 'invalid',
        tolerance: 'pointer',
        helper: 'clone',
        start: function (e, ui) {

        },
        stop: function (e, ui) {
            console.log('stop', ui);
        }
    });

    $('#paper').droppable({
        drop: function (event, ui) {
            var type = ui.draggable.attr('data-type');
            var id = uuid();
            var node = {
                nodeId: type + '-' + id,
                //name: type + '-' + id,
                x: ui.offset.left - 200,
                y: ui.offset.top - 300
            };

            var objToPush = {};
            var action;
            if (type === 'action') {
                action = ui.draggable.attr('data-action');
                objToPush[action] = node; // default task name
            } else if (type === 'goal') {
                node.transitions = null;
                objToPush[type] = node;
            } else {
                objToPush[type] = node;
            }
            JBApp.newNode(node, type, action);
            funnel.nodes.push(objToPush);
            flog('drop', ui);
        }
    });
}

function initTranModal(){
    var modal = $('#modalTransitions');
    modal.on('click', '.btnAddTrigger', function(e){
        e.preventDefault();
        var clone = modal.find('.placeholderform').clone();
        clone.removeClass('hide placeholderform');
        modal.find('.transitionItems').append(clone);
        $(this).addClass('hide');
    });

    modal.on('change', '[name=triggerType]', function(e) {
        $(this).siblings('.'+this.value).removeClass('hide').siblings('.triggerDiv').addClass('hide');
    });
    modal.find('form').on('submit', function(e){
        e.preventDefault();

        doSaveTrigger($(this));
        modal.modal('hide');
    });
}

function showTranModal(tran, sourceId, targetId){
    var modal = $('#modalTransitions');
    modal.find('[name=sourceId]').val(sourceId);
    modal.find('[name=targetId]').val(targetId);
    modal.find('.transitionItems').html('');
    var trigger = tran.trigger;
    if (!trigger) {
        modal.find('.btnAddTrigger').removeClass('hide');
    }
    for (var key in trigger) {
        var t = trigger[key];
        var clone = modal.find('.placeholderform').clone();
        clone.find('[name=triggerType]').val(key);
        clone.find('.'+key).removeClass('hide').siblings('.triggerDiv').addClass('hide');
        for(var k in t){
            clone.find('[name='+k+']').val(t[k]);
        }
        clone.removeClass('hide placeholderform').siblings('.triggerDiv').addClass('hide');
        modal.find('.transitionItems').append(clone)
    }

    modal.modal();
}

function doSaveTrigger(form){
    var trigger = {};
    form.find('.transitionItems .form-group').each(function(){
        var type = $(this).find('[name=triggerType]').val();
        if (type) {
            trigger[type] = {};
            $(this).find('input:visible').each(function(){
                trigger[type][$(this).attr('name')] = $(this).val();
            });
        }
    });

    var sourceId = form.find('[name=sourceId]').val();
    var targetId = form.find('[name=targetId]').val();
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {

                if (node[key].hasOwnProperty('transitions')) {
                    var transitions = node[key].transitions;
                    for(var j = 0; j < transitions.length; j++){
                        if(transitions[j].nextNodeId === targetId){
                            transitions[j].trigger = trigger;
                            break;
                        }
                    }
                } else if (node[key].hasOwnProperty('transition')) {
                    var transition = node[key].transition;
                    transition.trigger = trigger;
                }
            }
        }
    }
    Msg.info('Transition trigger updated');
}

function initContextMenu() {
    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btnNodeSetting",
        trigger: 'left',
        build: function ($trigger, e) {

            var items = {
                detail: {
                    name: "Node detail", icon: "fa-link", callback: function (key, opt) {
                        // Alert the key of the item and the trigger element's id.
                        var domElement = opt.$trigger.parents('.w');
                        var id = domElement.attr("id");
                        var href = window.location.pathname;
                        if (!href.endsWith('/')) {
                            href += '/';
                        }
                        window.location.pathname = href + id;
                    }
                },
                delete: {
                    name: "Delete", icon: 'fa-trash', callback: function (key, opt) {
                        var domElement = opt.$trigger.parents('.w');
                        var c = confirm('Are you sure you want to delete this node?');
                        if (c) {
                            var id = domElement.attr("id");
                            deleteNode(id);
                            JBApp.jsPlumpInstance.remove(id);
                        }
                    }
                }
            };

            return {items: items}
        }

    });
}

function updateNode(nodeid, title) {
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === nodeid) {
                node[key].name = title;
                break;
            }
        }
    }
}

function deleteNode(nodeId) {
    var index = -1;
    for (var i = 0; i < funnel.nodes.length; i++) {
        var node = funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === nodeId) {
                index = i;
                break;
            }
        }
    }

    if (index > -1) {
        funnel.nodes.splice(index, 1);
    }
}

function initSaveButton() {
    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        Msg.info("Saving..");
        for (var i = 0; i < funnel.nodes.length; i++) {
            var node = funnel.nodes[i];
            for (var key in node) {
                if (node.hasOwnProperty(key)) {
                    var nodeId = node[key].nodeId;
                    node[key].x = parseInt($('#' + nodeId).css('left').replace('px', ''));
                    node[key].y = parseInt($('#' + nodeId).css('top').replace('px', ''));
                }
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



function uuid() {
    return ('xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}