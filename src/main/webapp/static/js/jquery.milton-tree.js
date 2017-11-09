(function ($) {
    var methods = {
        init: function (options) {
            var container = this;
            flog('init tree', this.options, this);
            var config = $.extend({
                pageUrl: window.location,
                basePath: window.location,
                onlyFolders: false,
                excludedEndPaths: [],
                showToolbar: true,
                theme: 'default',
                includeContentTypes: [],
                onselect: function (n) {
                    flog('def: selected', n);
                },
                onselectFile: function (n) {
                    flog('def: file selected', n);
                },
                onselectFolder: function (n) {
                    flog('def: folder selected', n);
                },
                ondelete: function (n, isFolder) {
                    flog('def: ondelete', n, isFolder);
                },
                onnewfolder: function (n) {
                    flog('def: onnewfolder', n);
                },
                isInCkeditor: false
            }, options);
            config.hrefMap = new Array();
            config.nodeMap = new Object();
            config.hashMap = new Object();
            flog('set options on', this);
            this.data('options', config);

            if (config.showToolbar) {
                var buttonClass = config.isInCkeditor ? 'cke_dialog_ui_button' : 'btn btn-danger';
                var buttonPrimaryClass = config.isInCkeditor ? 'cke_dialog_ui_button cke_dialog_ui_button_ok' : 'btn btn-success';
                var spanClass = config.isInCkeditor ? 'cke_dialog_ui_button' : '';

                container.prepend(
                    '<div class="milton-tree-toolbar">' +
                    '   <a class="btn-delete-tree ' + buttonClass + '" title="Delete">' +
                    '       <span class="' + spanClass + '"><i class="fa fa-times"></i></span>' +
                    '   </a>' +
                    '   <a class="btn-add-folder ' + buttonPrimaryClass + '" title="Add Folder">' +
                    '       <span class="' + spanClass + '"><i class="fa fa-plus"></i></span>' +
                    '   </a>' +
                    '</div>'
                );
                container.find('.btn-delete-tree').on('click', function (e) {
                    e.preventDefault();
                    var selectedItem = $(config.selectedItem);

                    flog('Selected item:', selectedItem);

                    if (selectedItem.length > 0) {
                        var isFolder = selectedItem.children('a').find('.jstree-icon').hasClass('folder');
                        deleteTreeItem(config, isFolder);
                    } else {
                        alert('Please select item which you want to deleted!');
                    }
                });

                container.find('.btn-add-folder').on('click', function (e) {
                    e.preventDefault();

                    createTreeItemFolder(container, config);
                });
            }

            var tree = $('<div class="milton-tree"></div>');
            tree.data('options', config); // set data on tree and tree container for ease of use
            flog('set options on', tree);

            container.append(tree);
            initTree(tree, config);
        },
        getSelectedUrl: function (x) {
            var options = this.data('options');
            node = $(options.selectedItem);
            var url = toFullUrl(node, options);
            return url;
        },
        // if the selected item is a folder. If its a file, returns the parent url
        getSelectedFolderUrl: function (x) {
            var options = this.data('options');
            node = $(options.selectedItem);
            var icon = node.find('> a > ins.jstree-icon');
            flog('check if folder', node, icon);
            if (icon.hasClass('file')) {
                node = node.parent().closest('li');
                flog('is file, get parent', node);
            } else {
                flog('is folder');
            }
            var url = toFullUrl(node, options);
            return url;
        },
        refreshSelected: function () {
            var options = this.data('options');
            var tree = this.find('.jstree')[0];
            $.jstree._reference(tree).refresh(options.selectedItem);
        },
        // Add a file node to the current node
        addFile: function (name, href, hash) {
            var options = this.data('options');
            var tree = this.find('.jstree');
            flog('mtree:addFile', name, href, options);
            var js = {
                data: name,
                attr: {
                    'id': createNodeId(href, hash, options)
                }
            };
            var parentNode = $(options.selectedItem);
            flog('addFile, parentNode', parentNode);
            var icon = parentNode.find('> a > ins.jstree-icon');
            if (icon.hasClass('file')) {
                parentNode = parentNode.parent().closest('li');
                flog('addFile, parentNode2', parentNode);
            } else {
                flog('not a file', parentNode, icon);
            }
            var parent = null;
            if (parentNode && parentNode.length > 0) {
                parent = parentNode[0];
            } else {
                parent = null;
            }

            var r;
            if (parent) {
                flog('add inside', parent);
                r = $.jstree._reference(tree[0]).create_node(parent, 'inside', js);
            } else {
                flog('add root', parent);
                r = $.jstree._reference(tree[0]).create_node(-1, 'first', js);
            }
            flog('addFile: r=', r);
            if (r) {
                r.find('a ins').addClass('file');
                var ul = r.closest('ul');
                ul.find('li').sort(asc_sort).appendTo(ul);
                tree.mtree('select', r);
                //this.select(r);
                flog('done select', r);
            }
            parentNode.removeClass('jstree-closed');
            parentNode.addClass('jstree-open');
        },
        // Make the given node selected
        select: function (node, callback) {
            flog('select', node);
            var options = this.data('options');
            if (!options) {
                flog('Could not find options data in', this);
            }
            var tree;
            if (this.hasClass('jstree')) {
                tree = this; // this is the tree
            } else {
                tree = this.find('.jstree'); // given node is parent
            }
            tree.find('.jstree-clicked').removeClass('jstree-clicked');
            node.find('> a').addClass('jstree-clicked');
            var parentNode = node.closest('li');
            flog('open node', parentNode);
            var treeDom = tree[0];
            var treeRef = $.jstree._reference(treeDom);
            if (!treeRef) {
                flog('Couldnt find tree for: ', this, tree);
            }
            treeRef.open_node(parentNode, callback);

            options.onselect(node);
            options.selectedItem = node;
            var icon = node.find('> a > ins.jstree-icon');
            var url = toFullUrl(node, options);
            var hash = toHash(node, options);
            if (icon.hasClass('file')) {
                options.onselectFile(node, url, hash);
            } else {
                options.onselectFolder(node, url);
            }
        }
    };

    $.fn.mtree = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.tooltip");
        }

    };
})(jQuery);

function initTree(tree, config) {
    flog('initTree', tree, config);
    config.nodeMap = [];
    // map of node id"s keyed by href (relative to base path eg href=Documents/Folder1
    config.hrefMap = [];
    config.nodeMapNextId = 0;

    tree.bind('loaded.jstree', function () {
        flog('tree loaded', config.pagePath);
        if (config.pagePath) {
            var relPagePath = config.pagePath.substring(config.basePath.length, config.pagePath.length);
            flog('relPagePath', relPagePath);
            urlParts = relPagePath.split('/');
            if (urlParts.length > 0) {
                flog('do autoopen', config.pagePath, config.basePath, config.hrefMap);
                autoOpen(tree, config, '', 0, urlParts);
            }
        }
    });

    tree.jstree({
        'plugins': ['themes', 'json_data', 'ui'],
        'load_open': true,
        'json_data': {
            'ajax': {
                'url': function (n) {
                    var url = toUrl(n, config);
                    url = toPropFindUrl(url, config);
                    return url;
                },
                dataType: 'json',
                // this function is executed in the instance"s scope (this refers to the tree instance)
                // the parameter is the node being loaded (may be -1, 0, or undefined when loading the root nodes)
                'data': function (n) {
                    // the result is fed to the AJAX request `data` option
                    return '';
                },
                'error': function (data) {
                    flog('error loading tree data', data);
                    var obj = $.parseJSON(data.responseText);
                    flog('parsed', obj);

                },
                'success': function (data) {
                    flog('milton-tree: success', data);
                    var newData = new Array();
                    // Add some properties, and drop first result
                    $.each(data, function (key, value) {
                        flog('milton-tree: value=', value);
                        if (value.iscollection || !config.onlyFolders) {
                            flog('milton-tree: value2');
                            if (key > 0 && isDisplayable(value, config)) {
                                value.state = 'closed'; // set the initial state
                                //value.data = value.name; // copy name to required property
                                var icon = 'file';
                                if (value.iscollection)
                                    icon = 'folder';
                                value.data = {
                                    title: value.name,
                                    icon: icon
                                };
                                value.metadata = value;
                                value.attr = {
                                    id: createNodeId(value.href, value.hash, config), // set the id attribute so we know its href
                                    'class': value.templateName,
                                    'data-hash': value.hash
                                };
                                newData[newData.length] = value;
                            } else {
                                flog('not displaying', key, value);
                            }
                        }
                    });
                    flog('milton-tree: success, returning', newData);
                    return newData;
                }
            }
        },
        'themes': {
            'theme': config.theme,
            'url': '/static/js/themes/default/style.css'
        },
        'ui': {
            'select_limit': 1,
            'select_multiple_modifier': 'alt',
            'selected_parent_close': 'select_parent'
        }
    });

    tree.on('click', 'li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        config.selectedItem = this;
        config.onselect(config.selectedItem);
        var node = $(this);
        $.jstree._reference(tree[0]).open_node(node);

        var icon = node.find('> a > ins.jstree-icon');
        flog('base url', toUrl(node, config), node);
        var url = toFullUrl(node, config);
        var hash = toHash(node, config);
        flog("item hash", hash);
        if (icon.hasClass('file')) {
            config.onselectFile(node, url, hash);
        } else {
            config.onselectFolder(node, url, hash);
        }
    });
}

function autoOpen(tree, config, loadUrl, part, urlParts) {
    flog('autoOpen', loadUrl, part, urlParts);
    if (part >= urlParts.length) {
        return;
    }
    loadUrl = loadUrl + urlParts[part] + '/';
    var nodeId = '#' + toNodeId(loadUrl, config);
    var node = $(nodeId);
    if (node.length == 0) {
        flog('Couldnt find node', nodeId);
        return;
    }
    tree.mtree('select', node, function () {
        autoOpen(tree, config, loadUrl, part + 1, urlParts);
    });

}

// Just get the url for the given node (a LI element)
function toUrl(n, config) {
    // n should be an LI
    if (n.attr) {
        var id = n.attr('id');
        flog('toUrl', n, id);
        var url = config.nodeMap[id];
        if (url) {
            return url;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

function toHash(n, config) {
    if (n.attr) {
        var id = n.attr('id');
        flog('toHash', n, id);
        var hash = config.hashMap[id];
        if (hash) {
            return hash;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

function toNodeId(url, config) {
    var nodeId = config.hrefMap[url];
    if (nodeId) {
        flog('found', url, nodeId);
    } else {
        flog('not found', url, 'in map', config.hrefMap);
    }
    return nodeId;
}

function toFullUrl(n, config) {
    var url = toUrl(n, config);
    if (url) {
        if (config.basePath != '/') {
            url = config.basePath + url;
        }
    }
    return url;
}

function createNodeId(href, hash, config) {
    flog("createNodeId", href, hash, config);
    var newId = 'node_' + config.nodeMapNextId;
    config.nodeMapNextId = config.nodeMapNextId + 1;
    var newHref = href.replace(config.basePath, '');
    config.nodeMap[newId] = newHref;
    config.hrefMap[newHref] = newId;
    if (hash !== null && hash !== "") {
        config.hashMap[newId] = hash;
    }
    flog('createNodeId', href, config.hrefMap);
    return newId;
}

function toPropFindUrl(path, config) {
    var url;
    if (path == '') {
        url = config.basePath;
    } else {
        url = config.basePath + path;
    }
    if (!url.endsWith('/')) {
        url += '/';
    }
    url = url + '_DAV/PROPFIND?fields=name,milton:hash,getcontenttype>contentType,href,iscollection&depth=1';
    //flog('toPropFindUrl','base:', config.basePath, 'path:', path,'final url:', url);
    return url;
}

function isDisplayable(item, config) {
    flog('isDisplayable', item, config);

    // If includeContentTypes is set, then must be of correct content type, or a collection
    if (!item.iscollection) { // only consider content types for files
        if (config.includeContentTypes.length > 0) {
            var isCorrectType;
            for (i = 0; i < config.includeContentTypes.length; i++) {
                var ct = config.includeContentTypes[i];
                if (item.contentType && item.contentType.contains(ct)) {
                    isCorrectType = true;
                    break;
                }
            }
            if (!isCorrectType) {
                return false;
            }
        }
    }
    if (isExcluded(item.href, config)) {
        return false;
    } else if (!isDisplayableFileHref(item.href, config)) {
        return false;
    }
    return true;
}

function isExcluded(href, config) {
    var excludedEndPaths = [];
    if (config && config.excludedEndPaths) {
        excludedEndPaths = config.excludedEndPaths;
    }

    for (i = 0; i < excludedEndPaths.length; i++) {
        var p = excludedEndPaths[i];
        if (href.endsWith(p)) {
            return true;
        }
    }
    return false;
}

function isDisplayableFileHref(href, config) {
    flog('isDisplayableFileHref', href);

    if (href == "Thumbs.db")
        return false;
    if (endsWith(href, "/regs/"))
        return false;
    if (endsWith(href, ".MOI"))
        return false;
    if (endsWith(href, ".THM"))
        return false;

    return true;
}

function deleteTreeItem(config, isFolder) {
    var node = $(config.selectedItem);
    var href = config.basePath + toUrl(node, config);
    var name = node.find('a').text();
    flog('deleteTreeItem', config.selectedItem, name, href);
    confirmDelete(href, name, function () {
        config.ondelete(node, isFolder);
        if (isFolder) {
            config.selectedItem = null;
        }
        node.remove();
    });
}

function createTreeItemFolder(tree, config) {
    var node = $(config.selectedItem);
    if (node.hasClass('jstree-leaf')) {
        flog('node is a leaf, use parent', node, node.parent());
        node = node.parent();
    } else {
        flog('is not a leaf', node);
    }
    var nodePath = toUrl(node, config);
    flog('nodePath', nodePath);
    var href = config.basePath + nodePath;
    var name = node.find('a').text();

    flog('createTreeItemFolder', node, name, href);
    var newName = prompt('Please enter a name for the new folder');
    if (newName) {
        createFolder(newName, href, function () {
            var treeNode = tree.find('.jstree')[0];
            var nodeToRefresh = node[0];
            flog('refresh tree', tree, treeNode, 'selected', nodeToRefresh);
            $.jstree._reference(treeNode).refresh(nodeToRefresh);
            config.onnewfolder(nodeToRefresh);
        })
    }

}
