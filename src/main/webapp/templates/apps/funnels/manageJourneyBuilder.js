'use strict';

var JBApp = {
    funnel: null,
    funnelNodes: {},
    initialized: false,
    availableTriggers: null,
    isDirty: false,
    ACTIONS: {
        'emailAction': '<i class="fa fa-envelope" aria-hidden="true"></i> Send Email',
        'createTaskAction': '<i class="fa fa-tasks" aria-hidden="true"></i> Create Task',
        'createDataSeriesAction': '<i class="fa fa-database" aria-hidden="true"></i> Create Data Series',
        'calendarEventAction': '<i class="fa fa-calendar-check-o" aria-hidden="true"></i> Calendar Event',
        'setField': '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Set Field'
    }
};
$(function () {
    initSideBar();
    initContextMenu();
    initSaveButton();
    initTranModal();
    initChoiceModal();
    initTimeoutModal();
    initEditTitle();
});

window.onbeforeunload = function(e){
    if (JBApp.isDirty){
        return 'Changes you made may not be saved.';
    }
}

jsPlumb.ready(function () {
    try {
        JBApp.funnel = $.parseJSON($("#funnelJson").text());
    } catch (e) {
        flog('no funnel found');
        JBApp.funnel = {
            nodes: []
        };
    }
    JBApp.availableTriggers = $.parseJSON($("#triggers").text());

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
            ["Label", {label: "", id: "label", cssClass: "aLabel"}],
            ["Custom", {
                create: function(component) {
                    return $('<div><a href="#" title="Click to delete connection" class="buttonX"><i class="fa fa-times"></i></a></div>');
                },
                events:{
                    click: function(labelOverlay, originalEvent) {
                        flog("click on label overlay",labelOverlay,  labelOverlay.component);
                        originalEvent.preventDefault();
                        labelOverlay.component.setParameter('clickedButtonX', true);
                        var c = confirm('Are you sure you want to delete this connection?');
                        if (c) {
                            JBApp.isDirty = true;
                            deleteConnection(labelOverlay.component);
                            instance.detach(labelOverlay.component);
                        }
                    }
                },
                location: 0.7,
                id:"buttonX",
                visible: false
            }]
        ],
        Container: "paper"
    });

    instance.registerConnectionType("basic", {anchor: "Continuous", connector: "StateMachine"});
    instance.registerConnectionType("transition", {anchor: "Continuous", connector: "StateMachine"});
    instance.registerConnectionType("decisionDefault", {anchor: "Continuous", connector: "StateMachine"});
    instance.registerConnectionType("decisionChoices", {anchor: "Continuous", connector: "StateMachine"});
    instance.registerConnectionType("timeout", {anchor: "Continuous", connector: "StateMachine"});

    window.jsp = instance;

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        var sourceId = c.sourceId;
        var targetId = c.targetId;
        if (c && sourceId && targetId){
            flog('edit connection ', c);
            var nodes = JBApp.funnel.nodes;

            var filteredGoal = nodes.filter(function(item){
                return item.hasOwnProperty('goal') && item['goal'].nodeId === sourceId;
            });

            var filteredBegin = nodes.filter(function(item){
                return item.hasOwnProperty('begin') && item['begin'].nodeId === sourceId;
            });

            var filteredDecision = nodes.filter(function(item){
                return item.hasOwnProperty('decision') && item['decision'].nodeId === sourceId;
            });

            var filteredTimeout = filteredGoal.filter(function(item){
                return item['goal'].timeoutNode === targetId;
            });

            if (filteredGoal.length > 0) {
                var node = filteredGoal[0]['goal'];
                if (filteredTimeout.length > 0){
                    // timeout node
                    showTimeoutModal(node, sourceId, targetId);
                } else {
                    if (node.hasOwnProperty('transitions') && node.transitions.length) {
                        var trans = node.transitions.filter(function(item){
                            return item.nextNodeId === targetId;
                        });
                        if (trans.length){
                            showTranModal(trans[0], sourceId, targetId);
                        }
                    }
                }
            } else if (filteredBegin.length > 0) {
                var node = filteredBegin[0]['begin'];
                if (node.transition) {
                    showTranModal(node.transition, sourceId, targetId);
                }
            } else if (filteredDecision.length > 0){
                var node = filteredDecision[0]['decision'];
                var choice = node.choices[targetId];
                if (choice){
                    showChoiceModal(choice, sourceId, targetId);
                }
            }
        } else {
            flog('clicked to non-connection ', c);
        }
    });

    instance.bind("mouseover", function (connection, originalEvent) {
        if (connection.getOverlay("buttonX")) {
            connection.getOverlay("buttonX").show();
        }
    });

    instance.bind("mouseout", function (connection, originalEvent) {
        if (connection.getOverlay("buttonX")) {
            connection.getOverlay("buttonX").hide();
        }
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {

        // Validate connection, we just allow only one connection between 2 endpoint within a direction
        var conn = info.connection;
        var arr = instance.select({source: conn.sourceId, target: conn.targetId});
        if (arr.length > 1) {
            instance.detach(conn);
            return;
        }

        var label = 'then';
        if (conn.hasType('timeout')) {
            label = 'timeout';
        } else if (conn.hasType('decisionDefault')) {
            label = 'default';
        } else if (conn.hasType('decisionChoices')) {
            label = 'choice';
        } else if (conn.hasType('transition')) {
            label = 'transition';
        }

        conn.getOverlay("label").setLabel(label);

        if (JBApp.initialized) {
            flog('new connection was made', info.connection);
            var nodes = JBApp.funnel.nodes;
            for(var i = 0; i < nodes.length; i ++){
                var node = nodes[i];
                for (var key in node) {
                    if (node[key].nodeId === conn.sourceId){
                        if (node[key].hasOwnProperty('transition')) {
                            flog('started from a begin node');
                            node[key].transition.nextNodeId = conn.targetId;
                        } else if (node[key].hasOwnProperty('transitions')){
                            flog('started from a goal node');
                            if (info.connection.hasType('timeout')) {
                                node[key].timeoutNode = conn.targetId;
                            } else {
                                if (!node[key].transitions) {
                                    node[key].transitions = [];
                                }
                                node[key].transitions.push({nextNodeId: conn.targetId});
                            }
                        } else if (node[key].hasOwnProperty('choices')){
                            flog('started from a decision node');
                            if (conn.hasType('decisionDefault')) {
                                node[key].nextNodeId = conn.targetId;
                            } else if (conn.hasType('decisionChoices')) {
                                // decision choices
                                if (!node[key].choices) {
                                    node[key].choices = {};
                                }
                                node[key].choices[conn.targetId] = {constant: {}};
                            }
                        } else {
                            flog('started from an action node');
                            node[key].nextNodeId = conn.targetId;
                        }
                        break;
                    }
                }
            }
            JBApp.isDirty = true;
        }
    });

    //
    // initialise element as connection targets and source.
    //
    function initNode(el, type) {

        // initialise draggable elements.
        instance.draggable(el, {containment: true});

        if (type === 'goal') {
            instance.makeSource(el, {
                filter: ".ep-timeout",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: "#e5910f", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "timeout",
                extract: {
                    "action": "timeout-action"
                },
                maxConnections: 1,
                onMaxConnections: function (info, e) {
                    Msg.warning("Timeout connection exists. Please delete it and add new one");
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            instance.makeSource(el, {
                filter: ".ep-transition",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: "#00f", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "transition",
                extract: {
                    "action": "transition-action"
                },
                maxConnections: -1
            });
        } else if (type === 'decision') {
            instance.makeSource(el, {
                filter: ".ep-red",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: "#f00", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "decisionDefault",
                extract: {
                    "action": "decisionDefault-action"
                },
                maxConnections: 1,
                onMaxConnections: function (info, e) {
                    Msg.warning("Default action node exists. Please delete it and add new one");
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            instance.makeSource(el, {
                filter: ".ep-green",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: "#0f0", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "decisionChoices",
                extract: {
                    "action": "decisionChoices-action"
                },
                maxConnections: -1
            });
        } else {
            instance.makeSource(el, {
                filter: ".ep-basic",
                anchor: "Continuous",
                connectorStyle: {strokeStyle: "#e50051", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "basic",
                extract: {
                    "action": "basic-action"
                },
                maxConnections: 1,
                onMaxConnections: function (info, e) {
                    Msg.warning("Maximum connections (" + info.maxConnections + ") reached. Please delete current connection and make a new one");
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        if (type !== 'begin') {
            instance.makeTarget(el, {
                dropOptions: {hoverClass: "dragHover"},
                anchor: "Continuous",
                allowLoopback: false
            });
        }

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
        var nodeName = node.title? node.title : node.nodeId;
        if (type === 'goal') {
            d.innerHTML = '<div class="title"><i class="fa fa-trophy" aria-hidden="true"></i> Goal <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></div>';
            d.innerHTML += '<div class="inner"><span class="nodeTitle">' + nodeName + ' <i class="fa fa-pencil"></i></span> <span title="Connect to transition node" class="ep ep-transition"></span> <span title="Connect to timeout node" class="ep ep-timeout"></span></div>';
        } else if(type === 'decision') {
            d.innerHTML = '<div class="title"><i class="fa fa-question-circle" aria-hidden="true"></i> Decision <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></span></div>';
            d.innerHTML += '<div class="inner"><span class="nodeTitle">' + nodeName + ' <i class="fa fa-pencil"></i></span>  <span title="Make new choice" class="ep ep-green"></span> <span title="Default next action" class="ep ep-red"></span></div>'
        } else if (type == 'begin') {
            d.innerHTML = '<div class="title"><i class="fa fa-play" aria-hidden="true"></i> Begin <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></div>';
            d.innerHTML += '<div class="inner"><span class="nodeTitle">' + nodeName + ' <i class="fa fa-pencil"></i></span> <span title="Connect to other node" class="ep ep-basic"></span></div>';
        } else {
            var actionName = JBApp.ACTIONS[action];
            d.innerHTML = '<div class="title">'+actionName+' <i style="font-size: 15px" class="fa fa-cog btnNodeSetting"></i></div>';
            d.innerHTML += '<div class="inner"><span class="nodeTitle">' + nodeName + ' <i class="fa fa-pencil"></i></span> <span title="Connect to other node" class="ep ep-basic"></span></div>';
        }

        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        instance.getContainer().appendChild(d);
        initNode(d, type);
        return d;
    }

    JBApp.newNode = newNode;
    JBApp.initNode = initNode;

    function initConnection(node) {
        var nextNodeId;
        var nextNodeIds = [];
        if (node.hasOwnProperty('choices')){
            // a decision node
            if (node.nextNodeId) {
                instance.connect({source: node.nodeId, target: node.nextNodeId, type: "decisionDefault"});
                if (JBApp.funnelNodes[node.nextNodeId]) {
                    initConnection(JBApp.funnelNodes[node.nextNodeId]);
                }
            }

            if (node.choices) {
                for (var key in node.choices) {
                    instance.connect({source: node.nodeId, target: key, type: "decisionChoices"});
                    if (JBApp.funnelNodes[key]) {
                        initConnection(JBApp.funnelNodes[key]);
                    }
                }
            }
        } else {
            if (node.nextNodeId) {
                // action node
                nextNodeId = node.nextNodeId;
            } else if (node.transition && node.transition.nextNodeId) {
                // begin node
                nextNodeId = node.transition.nextNodeId;
            } else if (node.transitions && node.transitions.length) {
                // goal node
                for (var i = 0; i < node.transitions.length; i++) {
                    nextNodeIds.push(node.transitions[i].nextNodeId);
                }
            }


            if (node.hasOwnProperty('timeoutNode')) {
                // goal node with timeout
                var timeoutNode = node.timeoutNode;
                if (timeoutNode) {
                    instance.connect({source: node.nodeId, target: timeoutNode, type: "timeout"});
                    if (JBApp.funnelNodes[timeoutNode]) {
                        initConnection(JBApp.funnelNodes[timeoutNode]);
                    }
                }
            }

            if (nextNodeIds.length) {
                for (var i = 0; i < nextNodeIds.length; i++) {
                    instance.connect({source: node.nodeId, target: nextNodeIds[i], type: "transition"});
                    if (JBApp.funnelNodes[nextNodeIds[i]]) {
                        initConnection(JBApp.funnelNodes[nextNodeIds[i]]);
                    }
                }
            } else if (nextNodeId) {
                instance.connect({source: node.nodeId, target: nextNodeId, type: "basic"});
                if (JBApp.funnelNodes[nextNodeId]) {
                    initConnection(JBApp.funnelNodes[nextNodeId]);
                }
            }
        }
    }

    // suspend drawing and initialise.
    instance.batch(function () {
        if (JBApp.funnel && JBApp.funnel.nodes && JBApp.funnel.nodes.length) {
            // Finding begin node
            var beginNodes = [];
            for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                var node = JBApp.funnel.nodes[i];
                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        JBApp.funnelNodes[node[key].nodeId] = node[key];
                        var type = key;
                        if (['goal', 'decision', 'begin'].indexOf(key) === -1) {
                            type = 'action';
                        }
                        newNode(node[key], type, key);
                        if (key === 'begin') {
                            beginNodes.push(node[key]);
                        }
                    }
                }
            }
        }
        // and finally, make first connection start from begin node
        if (beginNodes.length) {
            beginNodes.forEach(function(item){
                initConnection(item);
            });
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
            } else if (type === 'begin') {
                node.transition = {
                    nextNodeId: '',
                    trigger: null
                };
            }

            if (type !== 'action') {
                objToPush[type] = node;
            }
            JBApp.newNode(node, type, action);
            JBApp.funnel.nodes.push(objToPush);
            JBApp.isDirty = true;
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

function showChoiceModal(choice, sourceId, targetId){
    var modal = $('#modalChoice');
    modal.find('[name=sourceId]').val(sourceId);
    modal.find('[name=targetId]').val(targetId);
    modal.find('.choiceItems').html('');
    if (!Object.keys(choice.constant).length) {
        choice.constant = {
            value: ''
        };
    }
    for (var key in choice.constant) {
        if (key === 'label') continue;
        var value = choice.constant[key];
        var clone = modal.find('.placeholderform').clone();
        clone.find('[name=constKey]').val(key);
        clone.find('[name=constValue]').val(value);
        clone.removeClass('hide placeholderform');
        modal.find('.choiceItems').append(clone)
    }

    modal.modal();
}

function showTimeoutModal(node, sourceId, targetId){
    var modal = $('#modalTimeoutNode');
    modal.find('[name=sourceId]').val(sourceId);
    modal.find('[name=targetId]').val(targetId);
    modal.find('[name=timeoutMins]').val(node.timeoutMins);
    modal.modal();
}

function initTimeoutModal(){
    var modal = $('#modalTimeoutNode');
    modal.find('form').on('submit', function(e){
        e.preventDefault();

        doSaveTimeout($(this));
        modal.modal('hide');
    });
}

function doSaveTimeout(form){
    var sourceId = form.find('[name=sourceId]').val();
    var targetId = form.find('[name=targetId]').val();
    var timeoutMins = form.find('[name=timeoutMins]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId && node[key].hasOwnProperty('timeoutNode')) {
                if (node[key].timeoutNode === targetId){
                    node[key].timeoutMins = timeoutMins;
                    break;
                }
            }
        }
    }
    JBApp.isDirty = true;
    Msg.info('timeoutMins updated');
}

function initChoiceModal(){
    var modal = $('#modalChoice');
    modal.on('click', '.btnAddChoice', function(e){
        e.preventDefault();
        var clone = modal.find('.placeholderform').clone();
        clone.removeClass('hide placeholderform');
        modal.find('.choiceItems').append(clone);
    });

    modal.find('form').on('submit', function(e){
        e.preventDefault();

        doSaveChoice($(this));
        modal.modal('hide');
    });
}

function doSaveChoice(form){
    var constant = {};
    form.find('.choiceItems .form-group').each(function(){
        var key = $(this).find('[name=constKey]').val();
        var value = $(this).find('[name=constValue]').val();
        constant[key] = value;
    });
    var sourceId = form.find('[name=sourceId]').val();
    var targetId = form.find('[name=targetId]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {
                if (node[key].hasOwnProperty('choices')) {
                    var choices = node[key].choices;
                    if (!choices) {
                        choices = {};
                    }
                    choices[targetId] = { constant: constant };
                    node[key].choices = choices;
                    break;
                }
            }
        }
    }
    JBApp.isDirty = true;
    Msg.info('Decision choices updated');
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
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
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
    JBApp.isDirty = true;
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

function showModalTitle(node){
    var title = node.title;
    if (!title){
        title = node.nodeId;
    }
    var modal = $('#modalNodeTitle');
    modal.find('[name=title]').val(title);
    modal.find('[name=sourceId]').val(node.nodeId);
    modal.modal();
}

function initEditTitle(){
    $(document.body).on('click', '.nodeTitle', function(e){
        e.preventDefault();
        var nodeId = $(this).parents('.w').attr('id');
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            for (var key in node) {
                if (node[key].nodeId === nodeId) {
                    showModalTitle(node[key]);
                    break;
                }
            }
        }
    });
    var modal = $('#modalNodeTitle');
    modal.find('form').on('submit', function(e){
        e.preventDefault();

        updateNode($(this));
        modal.modal('hide');
    });
}

function updateNode(form) {
    var sourceId = form.find('[name=sourceId]').val();
    var title = form.find('[name=title]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {
                node[key].title = title;
                JBApp.isDirty = true;
                $('#' + sourceId).find('.nodeTitle').html(title + ' <i class="fa fa-pencil"></i>');
                Msg.info('Title updated');
                break;
            }
        }
    }

}

function deleteNode(nodeId) {
    var index = -1;
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === nodeId) {
                index = i;
                break;
            }
        }
    }

    if (index > -1) {
        JBApp.isDirty = true;
        JBApp.funnel.nodes.splice(index, 1);
    }
}

function deleteConnection(connection){
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === connection.sourceId) {
                if (key === 'begin') {
                    node[key].transition.nextNodeId = '';
                } else if (key === 'goal') {
                    if (connection.hasType('timeout')){
                        node[key].timeoutNode = '';
                    } else {
                        node[key].transitions.forEach(function(item, index){
                            if (item.nextNodeId === connection.targetId){
                                node[key].transitions.splice(index, 1);
                                return;
                            }
                        });
                    }
                } else if (key === 'decision'){
                    if (connection.hasType('decisionDefault')){
                        node[key].nextNodeId = '';
                    } else if (connection.hasType('decisionChoices')){
                        if (node[key].choices.hasOwnProperty(connection.targetId)){
                            delete node[key].choices[connection.targetId];
                        }
                    }
                } else {
                    node[key].nextNodeId = '';
                }
                break;
            }
        }
    }
}

function initSaveButton() {
    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        var valid = true;
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            for (var key in node) {
                if (node.hasOwnProperty(key)) {
                    var nodeId = node[key].nodeId;
                    node[key].x = parseInt($('#' + nodeId).css('left').replace('px', ''));
                    node[key].y = parseInt($('#' + nodeId).css('top').replace('px', ''));
                    if (key === 'begin'){
                        if (!node[key].transition.nextNodeId){
                            valid = false;
                        }
                    }
                }
            }
        }
        // validating
        if (JBApp.funnel.nodes.length > 1 && !valid) {
            Msg.error('Begin node MUST connect to other one.');
        } else {
            $.ajax({
                url: 'funnel.json',
                type: 'PUT',
                data: JSON.stringify(JBApp.funnel),
                success: function () {
                    Msg.success('File is saved!');
                    JBApp.isDirty = false;
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                }
            });
        }
    });
}



function uuid() {
    return ('xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}

function formatMins(i) {
    if (i < 120) {
        return i + " mins";
    } else if (i < 60 * 24) {
        return i / 60 + " hours";
    } else {
        return i / (60 * 24) + " days";
    }
}