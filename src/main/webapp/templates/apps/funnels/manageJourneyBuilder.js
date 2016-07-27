'use strict';

var JBApp = {
    funnel: null,
    initialized: false,
    availableTriggers: null,
    ACTIONS: {
        'emailAction': '<i class="fa fa-envelope" aria-hidden="true"></i> Send Email',
        'createTaskAction': '<i class="fa fa-tasks" aria-hidden="true"></i> Create Task',
        'createDataSeriesAction': '<i class="fa fa-database" aria-hidden="true"></i> Create Data Series',
        'calendarEventAction': '<i class="fa fa-calendar-check-o" aria-hidden="true"></i> Calendar Event',
        'setField': '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Set Field',
        'addToGroup': '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Add to group',
        'removeProfile': '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Remove profile'
    }
};

$(function () {
    initSideBar();
    initSaveButton();
    initNodeActions();
    initSettingPanel();
    initBuilderHeightAdjuster();
});

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
        Endpoint: ["Dot", {
            radius: 2
        }],
        Connector: ["Flowchart", {
            cornerRadius: 5,
            gap: 1,
            stub: 15,
            alwaysRespectStubs: true,
            midpoint: 1
        }],
        HoverPaintStyle: {
            strokeStyle: "#1e8151",
            lineWidth: 2
        },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 10,
                width: 10,
                foldback: 0.5
            }],
            ["Label", {
                label: "",
                id: "label",
                cssClass: "aLabel"
            }],
            ["Custom", {
                create: function (component) {
                    return $('<div><a href="#" title="Click to delete connection" class="buttonX"><i class="fa fa-times"></i></a></div>');
                },
                events: {
                    click: function (labelOverlay, originalEvent) {
                        flog("click on label overlay", labelOverlay, labelOverlay.component);
                        originalEvent.preventDefault();
                        labelOverlay.component.setParameter('clickedButtonX', true);
                        var c = confirm('Are you sure you want to delete this connection?');
                        if (c) {
                            deleteConnection(labelOverlay.component);
                            instance.detach(labelOverlay.component);
                            saveFunnel('Connection is deleted!');
                        } else {
                            labelOverlay.component.setParameter('clickedButtonXCancelled', true);
                        }
                    }
                },
                location: 0.7,
                id: "buttonX",
                visible: false
            }]
        ],
        Container: "paper"
    });
    
    instance.registerConnectionType("basic", {anchors: ["RightMiddle", ["LeftMiddle", "TopCenter", "BottomCenter"]], connector: "StateMachine"});
    instance.registerConnectionType("transition", {anchors: ["RightMiddle", ["LeftMiddle", "TopCenter", "BottomCenter"]], connector: "StateMachine"});
    instance.registerConnectionType("decisionDefault", {anchors: [[1, 0.88, 1, 0], ["LeftMiddle", "TopCenter", "BottomCenter"]], connector: "StateMachine"});
    instance.registerConnectionType("decisionChoices", {anchors: ["RightMiddle", ["LeftMiddle", "TopCenter", "BottomCenter"]], connector: "StateMachine"});
    instance.registerConnectionType("timeout", {anchors: [[1, 0.88, 1, 0], ["LeftMiddle", "TopCenter", "BottomCenter"]], connector: "StateMachine"});
    
    window.jsp = instance;
    
    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        if (c) {
            var clickedButtonXCancelled = c.getParameter('clickedButtonXCancelled');
            if (clickedButtonXCancelled) {
                c.setParameter('clickedButtonXCancelled', false);
                return false;
            }
        }
        
        var sourceId = c.sourceId;
        var targetId = c.targetId;

        flog('click on jsplump', c, sourceId, targetId);

        if (c && sourceId && targetId) {
            flog('edit connection ', c);
            var nodes = JBApp.funnel.nodes;
            
            var filteredGoal = nodes.filter(function (item) {
                return item.hasOwnProperty('goal') && item['goal'].nodeId === sourceId;
            });
            
            var filteredBegin = nodes.filter(function (item) {
                return item.hasOwnProperty('begin') && item['begin'].nodeId === sourceId;
            });
            flog('filteredBegin', filteredBegin);
            
            var filteredDecision = nodes.filter(function (item) {
                return item.hasOwnProperty('decision') && item['decision'].nodeId === sourceId;
            });
            flog('filteredDecision', filteredDecision);
            
            var filteredTimeout = filteredGoal.filter(function (item) {
                return item['goal'].timeoutNode === targetId;
            });
            flog('filteredDecision', filteredDecision);
            
            if (filteredGoal.length > 0) {
                var node = filteredGoal[0]['goal'];
                if (filteredTimeout.length > 0) {
                    // timeout node
                    showTimeoutModal(node, sourceId, targetId);
                } else {
                    if (node.hasOwnProperty('transitions') && node.transitions.length) {
                        var trans = node.transitions.filter(function (item) {
                            return item.nextNodeId === targetId;
                        });
                        if (trans.length) {
                            showTransitionForm(trans[0], sourceId, targetId);
                        }
                    }
                }
            } else if (filteredBegin.length > 0) {
                var node = filteredBegin[0]['begin'];
                if (node.transition) {
                    showTransitionForm(node.transition, sourceId, targetId);
                }
            } else if (filteredDecision.length > 0) {
                var node = filteredDecision[0]['decision'];
                var choice = node.choices[targetId];
                if (choice) {
                    showDecisionForm(choice, sourceId, targetId);
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
        var arr = instance.select({
            source: conn.sourceId,
            target: conn.targetId
        });
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
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                for (var key in node) {
                    if (node[key].nodeId === conn.sourceId) {
                        if (node[key].hasOwnProperty('transition')) {
                            flog('started from a begin node');
                            node[key].transition.nextNodeId = conn.targetId;
                        } else if (node[key].hasOwnProperty('transitions')) {
                            flog('started from a goal node');
                            if (info.connection.hasType('timeout')) {
                                node[key].timeoutNode = conn.targetId;
                            } else {
                                if (!node[key].transitions) {
                                    node[key].transitions = [];
                                }
                                node[key].transitions.push({nextNodeId: conn.targetId});
                            }
                        } else if (node[key].hasOwnProperty('choices')) {
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

            saveFunnel();
        }
    });
    
    //
    // initialise element as connection targets and source.
    //
    function initNode(el, type) {
        // initialise draggable elements.
        instance.draggable(el, {
            stop: function () {
                saveFunnel();
            },
            grid: [10, 10]
        });
        
        if (type === 'goal') {
            instance.makeSource(el, {
                filter: ".ep-timeout",
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
                connectorStyle: {strokeStyle: "#008000", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
                connectionType: "decisionChoices",
                extract: {
                    "action": "decisionChoices-action"
                },
                maxConnections: -1
            });
        } else {
            instance.makeSource(el, {
                filter: ".ep-basic",
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
                allowLoopback: false
            });
        }
    }
    
    function newNode(node, type, action) {
        flog('newNode', node, type, action);

        var d = document.createElement("div");
        d.className = "w " + type;
        d.id = node.nodeId;
        d.setAttribute('data-type', type);

        var nodeName = node.title ? '<span class="node-title-inner">' + node.title + '</span>' : '<span class="node-title-inner text-muted">Enter title</span>';
        var nodeHtml = '';

        if (type === 'goal') {
            nodeHtml += '<div class="title">';
            nodeHtml += '   <i class="fa fa-trophy" aria-hidden="true"></i> Goal';
            nodeHtml += '   <span class="node-buttons clearfix">';
            nodeHtml += '       <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
            nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
            nodeHtml += '   </span>';
            nodeHtml += '</div>';
            nodeHtml += '<div class="inner">';
            nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>';
            nodeHtml += '   <span title="Connect to transition node" class="ep ep-transition"></span>';
            nodeHtml += '   <span title="Connect to timeout node" class="ep ep-timeout"></span>';
            nodeHtml += '</div>';
        } else if (type === 'decision') {
            nodeHtml += '<div class="title">';
            nodeHtml += '   <i class="fa fa-question-circle" aria-hidden="true"></i> Decision';
            nodeHtml += '   <span class="node-buttons clearfix">';
            nodeHtml += '       <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
            nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
            nodeHtml += '   </span>';
            nodeHtml += '</div>';
            nodeHtml += '<div class="inner">';
            nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>';
            nodeHtml += '   <span title="Make new choice" class="ep ep-green"></span> ';
            nodeHtml += '   <span title="Default next action" class="ep ep-red"></span>';
            nodeHtml += '</div>'
        } else if (type == 'begin') {
            nodeHtml += '<div class="title">';
            nodeHtml += '   <i class="fa fa-play" aria-hidden="true"></i> Begin';
            nodeHtml += '   <span class="node-buttons clearfix">';
            nodeHtml += '       <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
            nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
            nodeHtml += '   </span>';
            nodeHtml += '</div>';
            nodeHtml += '<div class="inner">';
            nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>';
            nodeHtml += '   <span title="Connect to other node" class="ep ep-basic"></span>';
            nodeHtml += '</div>';
        } else {
            var actionName = JBApp.ACTIONS[action];
            nodeHtml += '<div class="title">' + actionName;
            nodeHtml += '   <span class="node-buttons clearfix">';
            nodeHtml += '       <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
            nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
            nodeHtml += '   </span>';
            nodeHtml += '</div>';
            nodeHtml += '<div class="inner">';
            nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>';
            nodeHtml += '   <span title="Connect to other node" class="ep ep-basic"></span>';
            nodeHtml += '</div>';
        }

        d.innerHTML = nodeHtml;
        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        instance.getContainer().appendChild(d);
        initNode(d, type);
        return d;
    }
    
    JBApp.newNode = newNode;
    JBApp.initNode = initNode;
    
    function initConnection(node) {
        flog('initConnection', node);

        var nextNodeId;
        var nextNodeIds = [];
        if (node.hasOwnProperty('choices')) {
            // a decision node
            if (node.nextNodeId) {
                instance.connect({
                    source: node.nodeId,
                    target: node.nextNodeId,
                    type: "decisionDefault"
                });
            }
            
            if (node.choices) {
                for (var key in node.choices) {
                    instance.connect({
                        source: node.nodeId,
                        target: key,
                        type: "decisionChoices"
                    });
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
                    instance.connect({
                        source: node.nodeId,
                        target: timeoutNode,
                        type: "timeout"
                    });
                }
            }
            
            if (nextNodeIds.length) {
                for (var i = 0; i < nextNodeIds.length; i++) {
                    instance.connect({
                        source: node.nodeId,
                        target: nextNodeIds[i],
                        type: "transition"
                    });
                }
            } else if (nextNodeId) {
                instance.connect({
                    source: node.nodeId,
                    target: nextNodeId,
                    type: "basic"
                });
            }
        }
    }
    
    // suspend drawing and initialise.
    instance.batch(function () {
        if (JBApp.funnel && JBApp.funnel.nodes && JBApp.funnel.nodes.length) {
            for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                var node = JBApp.funnel.nodes[i];

                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        var nodeData = node[key];
                        var type = key;
                        if (['goal', 'decision', 'begin'].indexOf(key) === -1) {
                            type = 'action';
                        }

                        newNode(nodeData, type, key);
                    }
                }
            }

            for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                var node = JBApp.funnel.nodes[i];

                for (var key in node) {
                    if (node.hasOwnProperty(key)) {
                        var nodeData = node[key];
                        initConnection(nodeData);
                    }
                }
            }
        }
    });
    
    jsPlumb.fire("jsPlumbDemoLoaded", instance);
    JBApp.jsPlumpInstance = instance;
    JBApp.initialized = true;
    flog('JBApp init done');
});

function initSettingPanel() {
    flog('initSettingPanel');

    var settingPanel = $('.panel-setting');

    settingPanel.find('.btn-close-setting').on('click', function (e) {
        e.preventDefault();

        hideSettingPanel();
    });

    settingPanel.find('.btn-save-setting').on('click', function (e) {
        e.preventDefault();

        settingPanel.find('.panel-body form.active').trigger('submit');
    });

    initTitleForm();
    initTransitionForm();
    initDecisionForm();
    initTimeoutForm();
}

function initTitleForm() {
    flog('initTitleForm');

    var form = $('form.panel-edit-title');
    form.on('submit', function (e) {
        e.preventDefault();

        updateNode(form);
    });
}

function updateNode(form) {
    flog('updateNode', form);

    var sourceId = form.find('[name=sourceId]').val();
    var title = form.find('[name=title]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {
                node[key].title = title;

                saveFunnel('Title is updated', function () {
                    var nodeTitleInner = $('#' + sourceId).find('.nodeTitle .node-title-inner');
                    if (nodeTitleInner.hasClass('text-muted')) {
                        nodeTitleInner.removeClass('text-muted')
                    }
                    nodeTitleInner.html(title);

                    hideSettingPanel();
                });

                break;
            }
        }
    }
}

function initBuilderHeightAdjuster() {
    flog('initBuilderHeightAdjuster');

    var builder = $('#builder');

    $('.btn-increase-height').on('click', function (e) {
        e.preventDefault();

        builder.css('height', (builder.height() + 50) + 'px');
    });

    $('.btn-decrease-height').on('click', function (e) {
        e.preventDefault();

        var currentHeight = builder.height();
        var newHeight = currentHeight - 50;

        builder.css('height', (newHeight <= 500 ? 500 : newHeight) + 'px');
    });
}

function hideSettingPanel() {
    flog('hideSettingPanel');

    var settingPanel = $('.panel-setting');
    settingPanel.attr('class', 'panel panel-default panel-setting');
    settingPanel.find('.panel-body .active').removeClass('active');
}

function showSettingPanel(formName) {
    flog('showSettingPanel', formName);

    var settingPanel = $('.panel-setting');
    var settingPanelBody = settingPanel.find('.panel-body');
    var formPanel = settingPanelBody.find('.panel-' + formName);
    settingPanel.attr('class', 'panel panel-default panel-setting showed panel-' + formName);
    settingPanelBody.find('.active').removeClass('active');
    formPanel.addClass('active');
    setTimeout(function () {
        formPanel.find('input:text').first().trigger('focus');
    }, 250);
}

function initSideBar() {
    flog('initSideBar');

    var rightPanel = $('.right-panel');

    rightPanel.find('.list-group, .panel-body').niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        cursorborder: '',
        disablemutationobserver: true
    });

    rightPanel.find('.list-group-item').draggable({
        revert: 'invalid',
        tolerance: 'pointer',
        helper: 'clone'
    });

    var paper = $('#paper');
    paper.droppable({
        drop: function (event, ui) {
            var type = ui.draggable.attr('data-type');
            var id = uuid();
            var node = {
                nodeId: type + '-' + id,
                x: ui.offset.left - paper.offset().left,
                y: ui.offset.top - paper.offset().top
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
            saveFunnel('New node is added!');
        }
    });
}

function initTransitionForm() {
    flog('initTransitionForm');

    var form = $('form.panel-transition');
    form.on('click', '.btnAddTrigger', function (e) {
        e.preventDefault();
        var clone = form.find('.placeholderform').clone();
        clone.removeClass('hide placeholderform');
        form.find('.transitionItems').append(clone);
        $(this).addClass('hide');
    });
    
    form.on('change', '[name=triggerType]', function (e) {
        $(this).siblings('.' + this.value).removeClass('hide').siblings('.triggerDiv').addClass('hide');
    });
    form.on('submit', function (e) {
        e.preventDefault();
        
        doSaveTrigger(form);
    });
}

function showTransitionForm(tran, sourceId, targetId) {
    flog('showTransitionForm', tran, sourceId, targetId);

    var form = $('form.panel-transition');
    form.find('[name=sourceId]').val(sourceId);
    form.find('[name=targetId]').val(targetId);
    form.find('.transitionItems').html('');
    var trigger = tran.trigger;
    if (!trigger) {
        form.find('.btnAddTrigger').removeClass('hide');
    }
    for (var key in trigger) {
        var t = trigger[key];
        var clone = form.find('.placeholderform').clone();
        clone.find('[name=triggerType]').val(key);
        clone.find('.' + key).removeClass('hide').siblings('.triggerDiv').addClass('hide');
        for (var k in t) {
            clone.find('[name=' + k + ']').val(t[k]);
        }
        clone.removeClass('hide placeholderform').siblings('.triggerDiv').addClass('hide');
        form.find('.transitionItems').append(clone)
    }

    showSettingPanel('transition');
}

function showDecisionForm(choice, sourceId, targetId) {
    flog('showDecisionForm', choice, sourceId, targetId);

    var form = $('form.panel-decision');
    form.find('[name=sourceId]').val(sourceId);
    form.find('[name=targetId]').val(targetId);
    form.find('.choiceItems').html('');
    if (!Object.keys(choice.constant).length) {
        choice.constant = {
            value: ''
        };
    }
    for (var key in choice.constant) {
        if (key === 'label') continue;
        var value = choice.constant[key];
        var clone = form.find('.placeholderform').clone();
        clone.find('[name=constKey]').val(key);
        clone.find('[name=constValue]').val(value);
        clone.removeClass('hide placeholderform');
        form.find('.choiceItems').append(clone);
    }
    
    showSettingPanel('decision');
}

function showTimeoutModal(node, sourceId, targetId) {
    flog('showTimeoutModal', node, sourceId, targetId);

    var form = $('form.panel-timeout');
    form.find('[name=sourceId]').val(sourceId);
    form.find('[name=targetId]').val(targetId);
    form.find('[name=timeoutMins]').val(node.timeoutMins);

    showSettingPanel('timeout');
}

function initTimeoutForm() {
    flog('initTimeoutForm');

    var form = $('form.panel-timeout');
    form.on('submit', function (e) {
        e.preventDefault();
        
        doSaveTimeout(form);
    });
}

function doSaveTimeout(form) {
    flog('doSaveTimeout', form);

    var sourceId = form.find('[name=sourceId]').val();
    var targetId = form.find('[name=targetId]').val();
    var timeoutMins = form.find('[name=timeoutMins]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId && node[key].hasOwnProperty('timeoutNode')) {
                if (node[key].timeoutNode === targetId) {
                    node[key].timeoutMins = timeoutMins;
                    break;
                }
            }
        }
    }

    saveFunnel('Timeout is updated', function () {
        hideSettingPanel();
    });
}

function initDecisionForm() {
    flog('initDecisionForm');

    var form = $('form.panel-decision');
    form.on('click', '.btnAddChoice', function (e) {
        e.preventDefault();
        var clone = form.find('.placeholderform').clone();
        clone.removeClass('hide placeholderform');
        form.find('.choiceItems').append(clone);
    });
    
    form.on('submit', function (e) {
        e.preventDefault();
        
        doSaveChoice(form);
    });
}

function doSaveChoice(form) {
    flog('doSaveChoice', form);

    var constant = {};
    form.find('.choiceItems .form-group').each(function () {
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
                    choices[targetId] = {constant: constant};
                    node[key].choices = choices;
                    break;
                }
            }
        }
    }

    saveFunnel('Decision choices updated', function () {
        hideSettingPanel();
    });
}

function doSaveTrigger(form) {
    flog('doSaveTrigger', form);

    var trigger = {};
    form.find('.transitionItems .form-group').each(function () {
        var type = $(this).find('[name=triggerType]').val();
        if (type) {
            trigger[type] = {};
            $(this).find('input:visible').each(function () {
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
                    for (var j = 0; j < transitions.length; j++) {
                        if (transitions[j].nextNodeId === targetId) {
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

    saveFunnel('Transition trigger updated', function () {
        hideSettingPanel();
    });
}

function showTitleForm(node) {
    flog('showTitleForm', node);

    var title = node.title || '';
    var form = $('form.panel-edit-title');
    form.find('[name=title]').val(title);
    form.find('[name=sourceId]').val(node.nodeId);
    showSettingPanel('edit-title');
}

function initNodeActions() {
    flog('initNodeActions');

    $(document.body).on('click', '.btnNodeEdit', function (e) {
        e.preventDefault();

        var nodeId = $(this).closest('.w').attr('id');
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            for (var key in node) {
                if (node[key].nodeId === nodeId) {
                    showTitleForm(node[key]);
                    break;
                }
            }
        }
    });

    var formDetails = $('form.panel-edit-details');
    formDetails.forms({
        onSuccess: function () {
            hideSettingPanel();
        }
    });

    $(document.body).on('click', '.btnNodeDetails', function (e) {
        e.preventDefault();

        var domElement = $(this).closest('.w');
        var id = domElement.attr("id");
        var href = window.location.pathname;
        if (!href.endsWith('/')) {
            href += '/';
        }
        href = href + id + "?mode=settings";

        formDetails.load(href + ' #frmDetails > *', function () {
            formDetails.attr('action', href);

            showSettingPanel('edit-details');
        });
    });

    $(document.body).on('click', '.btnNodeDelete', function (e) {
        e.preventDefault();

        var domElement = $(this).closest('.w');
        if (confirm('Are you sure you want to delete this node?')) {
            var id = domElement.attr("id");
            deleteNode(id);
            JBApp.jsPlumpInstance.remove(id);
            saveFunnel('Node is deleted!');
        }
    });
}

function deleteNode(nodeId) {
    flog('deleteNode', nodeId);

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
        JBApp.funnel.nodes.splice(index, 1);
    }
}

function deleteConnection(connection) {
    flog('deleteConnection', connection);

    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === connection.sourceId) {
                if (key === 'begin') {
                    node[key].transition.nextNodeId = '';
                } else if (key === 'goal') {
                    if (connection.hasType('timeout')) {
                        node[key].timeoutNode = '';
                    } else {
                        node[key].transitions.forEach(function (item, index) {
                            if (item.nextNodeId === connection.targetId) {
                                node[key].transitions.splice(index, 1);
                                return;
                            }
                        });
                    }
                } else if (key === 'decision') {
                    if (connection.hasType('decisionDefault')) {
                        node[key].nextNodeId = '';
                    } else if (connection.hasType('decisionChoices')) {
                        if (node[key].choices.hasOwnProperty(connection.targetId)) {
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
    flog('initSaveButton');

    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        saveFunnel();
    });
}

function saveFunnel(message, callback) {
    flog('saveFunnel', message);

    var builderStatus = $('#builder-status');
    builderStatus.show().html('Saving...');

    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
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
        data: JSON.stringify(JBApp.funnel),
        success: function () {
            builderStatus.html(message || 'Funnel is saved!').delay(500).fadeOut(2000);

            if (typeof callback === 'function') {
                callback();
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
        }
    });
}

function uuid() {
    return ('xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}
