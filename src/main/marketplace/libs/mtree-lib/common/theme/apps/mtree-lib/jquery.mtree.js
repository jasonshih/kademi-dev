(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    var log = function () {
        var args = Array.prototype.slice.apply(arguments);
        args[0] = '[MTree] ' + args[0];
        flog.apply(null, args);
    };
    
    var ASSETS_ID = 'kademi-asset-folder';
    var ASSETS_NAME = 'Assets';
    var ASSETS_HREF = '/assets/';
    
    var DEFAULTS = {
        pagePath: window.location.href,
        basePath: window.location.href,
        showToolbar: true,
        onlyFolders: false,
        theme: 'default',
        excludedEndPaths: [],
        includeContentType: null,
        onSelect: function (node, type, url, hash, isAsset) {
            
        },
        onDelete: function (node, parentFolder, type) {
            
        },
        onCreate: function (node, parentNode, type) {
            
        }
    };
    
    function MTree(target, options) {
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    };
    
    MTree.DEFAULTS = DEFAULTS;
    
    MTree.prototype.init = function () {
        var self = this;
        var options = self.options;
        var target = self.target;
        
        var htmlContent = '';
        htmlContent += '<div class="mtree-wrapper">';
        if (options.showToolbar) {
            htmlContent += '   <div class="mtree-toolbar">';
            htmlContent += '       <button type="button" class="btn btn-success btn-sm mtree-btn-add-folder" title="Add folder"><i class="fa fa-plus"></i></button>';
            htmlContent += '       <button type="button" class="btn btn-danger btn-sm mtree-btn-delete" title="Delete"><i class="fa fa-times"></i></button>';
            htmlContent += '   </div>';
        }
        htmlContent += '   <div class="mtree"></div>';
        htmlContent += '</div>';
        
        target.html(htmlContent);
        
        self.tree = target.find('.mtree');
        
        if (options.showToolbar) {
            self.toolbar = target.find('.mtree-toolbar');
            self.btnDelete = self.toolbar.find('.mtree-btn-delete').on('click', function (e) {
                e.preventDefault();
                
                var selectedNode = self.getSelectedNode();
                
                if (selectedNode) {
                    self.deleteNode(selectedNode);
                }
            });
            
            self.btnAddFolder = self.toolbar.find('.mtree-btn-add-folder').on('click', function (e) {
                e.preventDefault();
                
                self.addFolder(prompt('Please enter name of new folder'));
            });
        }
        
        self.initTree();
    };
    
    MTree.prototype.deleteNode = function (node) {
        var self = this;
        var options = self.options;
        
        var name = node.attr('data-name');
        var href = node.attr('href');
        var type = node.attr('data-type');
        var isAsset = node.attr('data-asset');
        var nodeWrapper = node.parent();
        var callbackAfterDeleted = function () {
            log('Node is deleted');
            
            var parentFolders = nodeWrapper.parents('.mtree-folder-wrapper');
            var parentFolder = null;
            if (parentFolders.length > 0) {
                parentFolder = parentFolders.eq(0).children('.mtree-node.mtree-folder');
            }
            
            if (typeof options.onDelete) {
                options.onDelete.call(self, node, parentFolder, type);
            }
            
            self.jstree.delete_node([node.attr('id')]);
            self.jstree.select_node(parentFolder);
        };
        
        if (isAsset) {
            if (confirm('Are you sure you want to delete ' + name + '?')) {
                $.ajax({
                    type: 'DELETE',
                    url: href,
                    success: function () {
                        callbackAfterDeleted();
                    },
                    error: function (resp) {
                        log('Error in deleting asset', resp);
                        alert('Sorry, an error occured deleting ' + href + '. Please check your internet connection');
                    }
                });
            }
        } else {
            confirmDelete(href, name, callbackAfterDeleted);
        }
    };
    
    MTree.prototype.initTree = function () {
        var self = this;
        var options = self.options;
        
        // Init jstree
        self.tree.jstree({
            'core': {
                'check_callback': true,
                'multiple': false,
                'data': function (node, callback) {
                    log('Load data for folder node', node);
                    
                    var isAssetsFolder = node.id === ASSETS_ID;
                    var loadUrl;
                    var dataRequest;
                    if (isAssetsFolder) {
                        loadUrl = ASSETS_HREF;
                        dataRequest = {
                            q: '',
                            type: options.includeContentType
                        }
                    } else {
                        if (node.id === '#') {
                            loadUrl = options.basePath;
                        } else {
                            loadUrl = node.a_attr.href;
                        }
                        
                        loadUrl = self.getPropFindUrl(loadUrl);
                    }
                    log('Load url: ' + loadUrl);
                    
                    $.ajax({
                        url: loadUrl,
                        dataType: 'json',
                        type: 'get',
                        data: dataRequest,
                        success: function (resp) {
                            log('Tree data from server', resp);
                            
                            var treeData = [];
                            
                            if (node.id === '#') {
                                treeData.push(self.generateItemData({
                                    iscollection: true,
                                    id: ASSETS_ID,
                                    href: ASSETS_HREF,
                                    name: ASSETS_NAME
                                }));
                            }
                            
                            var data = resp;
                            if (isAssetsFolder) {
                                data = resp.data;
                            }
                            
                            $.each(data, function (index, item) {
                                if (isAssetsFolder) {
                                    treeData.push(self.generateItemData(item, index));
                                } else {
                                    if (item.iscollection || !options.onlyFolders) {
                                        if (index > 0 && self.isDisplayable(item)) {
                                            treeData.push(self.generateItemData(item, index));
                                        }
                                    }
                                }
                            });
                            
                            log('Tree data', treeData);
                            callback(treeData);
                        },
                        error: function (xhr, statusCode, errorThrown) {
                            log('[MTree] Error when loading tree data', xhr, statusCode, errorThrown);
                        }
                    });
                }
            }
        });
        self.jstree = self.tree.jstree(true);
        
        self.tree.on('loaded.jstree', function () {
            if (options.pagePath) {
                self.openPath(options.pagePath);
            }
        });
        
        self.tree.on('select_node.jstree', function (e, data) {
            var type = data.node.a_attr['data-type'];
            var url = data.node.a_attr['href'];
            var hash = data.node.a_attr['data-hash'] || '';
            var selectedNode = self.tree.find('.mtree-node[id="' + data.node.a_attr['id'] + '"]');
            
            var isAsset = data.node.id === ASSETS_ID;
            if (!isAsset) {
                if (self.getSelectedFolderUrl() === ASSETS_HREF) {
                    isAsset = true;
                }
            }
            
            if (isAsset) {
                if (self.btnAddFolder) {
                    self.btnAddFolder.prop('disabled', true).attr('title', 'You can not create sub folder in ' + ASSETS_NAME + ' folder');
                }
                
                if (self.btnDelete) {
                    if (data.node.id === ASSETS_ID) {
                        self.btnDelete.prop('disabled', true).attr('title', 'You can not delete ' + ASSETS_NAME + ' folder');
                    } else {
                        self.btnDelete.prop('disabled', false).attr('title', '');
                    }
                }
            } else {
                if (self.btnAddFolder) {
                    self.btnAddFolder.prop('disabled', false).attr('title', '');
                    self.btnDelete.prop('disabled', false).attr('title', '');
                }
            }
            
            if (typeof options.onSelect === 'function') {
                options.onSelect.call(self, selectedNode, type, url, hash, isAsset);
            }
        });
    };
    
    MTree.prototype.getSelectedNode = function () {
        var self = this;
        var selectedNodeIds = self.jstree.get_selected();
        
        if (selectedNodeIds && selectedNodeIds.length > 0) {
            return self.tree.find('#' + selectedNodeIds[0]).find('.mtree-node').eq(0);
        }
        
        return null;
    }
    
    MTree.prototype.getSelectedFolder = function () {
        log('getSelectedFolder');
        
        var self = this;
        var selectedNode = self.getSelectedNode();
        log('Selected node', selectedNode);
        
        if (selectedNode) {
            if (selectedNode.attr('data-type') === 'folder') {
                return selectedNode;
            } else {
                var folder = selectedNode.closest('.mtree-folder-wrapper');
                
                if (folder.length > 0) {
                    return folder.children('.mtree-node.mtree-folder');
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    };
    
    MTree.prototype.getFolderUrl = function (url) {
        log('getFolderUrl', url);
        
        if (this.endsWith(url, '/')) {
            return url;
        } else {
            return url.substr(0, url.lastIndexOf('/') + 1);
        }
    };
    
    MTree.prototype.addNode = function (path) {
        log('addNode', path);
        
        var self = this;
        var options = self.options;
        var parentPath = self.getFolderUrl(path);
        
        self.openPath(parentPath, function (parentNode) {
            var parentId = parentNode ? parentNode.attr('id') : null;
            
            setTimeout(function () {
                $.ajax({
                    url: self.getPropFindUrl(path),
                    cache: false
                }).done(function (data) {
                    if (data && data[0]) {
                        var item = self.generateItemData(data[0]);
                        log('Data for new node', item);
                        
                        var existingNode = self.tree.find('.mtree-node[href="' + path + '"]');
                        
                        if (existingNode && existingNode.length > 0) {
                            log('Delete old node', existingNode);
                            self.jstree.delete_node(existingNode);
                        }
                        
                        log('Add new node to parent id: ' + parentId);
                        self.jstree.create_node(parentId, item, 'first', function () {
                            var newNode = self.tree.find('#' + item.id);
                            
                            if (typeof options.onCreate === 'function') {
                                options.onCreate.call(self, newNode, parentNode, item.type);
                            }
                            
                            self.deselectNode();
                            self.jstree.select_node(newNode);
                        });
                    }
                });
            })
        }, 300);
    }
    
    MTree.prototype.deselectNode = function (node) {
        this.jstree.deselect_node(node || this.tree.find('.mtree-node.jstree-clicked'));
    };
    
    MTree.prototype.addFile = function (path) {
        this.addNode(path);
    };
    
    MTree.prototype.generateItemData = function (item, itemIndex) {
        var self = this;
        
        var type = item.iscollection ? 'folder' : 'file';
        item.type = type;
        item.id = item.id || self.generateId(type, itemIndex);
        item.icon = 'fa fa-' + type + '-o';
        item.text = item.name;
        item.state = {
            opened: false
        };
        
        item.a_attr = {
            class: 'mtree-node mtree-' + type,
            id: item.id,
            href: item.href || ASSETS_HREF + item.uniqueId,
            'data-name': item.name,
            'data-type': type
        };
        item.li_attr = {
            class: 'mtree-node-wrapper mtree-' + type + '-wrapper'
        };
        
        if (item.hash) {
            item.a_attr['data-hash'] = item.hash;
        }
        
        if (item.iscollection) {
            item.children = true;
        }
        
        if (item.uniqueId) {
            item.a_attr['data-asset'] = true;
        }
        
        return item;
    };
    
    MTree.prototype.getSelectedFolderUrl = function () {
        log('getSelectedFolderUrl');
        
        var self = this;
        var selectedFolder = self.getSelectedFolder();
        log('Selected folder', selectedFolder);
        
        if (selectedFolder) {
            return selectedFolder.attr('href');
        } else {
            return self.options.basePath;
        }
    };
    
    MTree.prototype.addFolder = function (name) {
        var self = this;
        
        if (name) {
            var selectedFolderHref = self.getSelectedFolderUrl();
            createFolder(name, selectedFolderHref, function () {
                self.addNode(selectedFolderHref + name)
            })
        }
    };
    
    MTree.prototype.getRelativePath = function (url) {
        return url.substring(this.options.basePath.length, url.length);
    };
    
    MTree.prototype.generateId = function (type, suffix) {
        return 'mtree-' + type + '-' + (new Date()).getTime() + (suffix || '');
    };
    
    MTree.prototype.openPath = function (url, callback) {
        log('openPath: ' + url);
        
        var self = this;
        var relPath = self.getRelativePath(url);
        if (self.endsWith(relPath, '/')) {
            relPath = relPath.substring(0, relPath.length - 1);
        }
        log('Relative path: ' + relPath);
        
        var pathParts = relPath ? relPath.split('/') : [];
        var autoOpen = function (partIndex) {
            if (partIndex >= pathParts.length) {
                return;
            }
            
            var node = self.tree.find('.mtree-node[data-name="' + pathParts[partIndex] + '"]');
            if (node.length > 0) {
                self.openNode(node, function () {
                    if (partIndex < pathParts.length) {
                        autoOpen(partIndex + 1);
                    }
                    
                    if (partIndex === pathParts.length - 1) {
                        log('Last folder', node);
                        
                        self.deselectNode();
                        self.jstree.select_node(node);
                        
                        if (typeof callback === 'function') {
                            flog('Path "' + url + '" is opened');
                            callback(node);
                        }
                    }
                });
            }
        };
        
        if (pathParts.length > 0) {
            autoOpen(0);
        } else {
            self.deselectNode();
            
            if (typeof callback === 'function') {
                flog('Path "' + url + '" is opened');
                callback(null);
            }
        }
    };
    
    MTree.prototype.openNode = function (node, callback) {
        if (node.length === 0) {
            log('Node does not exist', node);
            return;
        }
        
        this.jstree.open_node(node, callback);
    };
    
    MTree.prototype.isDisplayable = function (item) {
        var self = this;
        var options = self.options;
        
        if (!item.iscollection) {
            if (options.includeContentType) {
                var isCorrectType;
                if (item.contentType && item.contentType.contains(options.includeContentType)) {
                    isCorrectType = true;
                }
                
                if (!isCorrectType) {
                    return false;
                }
            }
        }
        
        if (self.isExcluded(item.href)) {
            return false;
        } else if (!self.isDisplayableFileHref(item.href)) {
            return false;
        }
        
        return true;
    };
    
    MTree.prototype.isExcluded = function (href) {
        var self = this;
        var options = self.options;
        
        for (var i = 0; i < options.excludedEndPaths.length; i++) {
            var p = options.excludedEndPaths[i];
            if (self.endsWith(href, p)) {
                return true;
            }
        }
        return false;
    }
    
    MTree.prototype.isDisplayableFileHref = function (href) {
        var self = this;
        
        if (href == 'Thumbs.db') {
            return false;
        }
        if (self.endsWith(href, '/regs/')) {
            return false;
        }
        if (self.endsWith(href, '.MOI')) {
            return false;
        }
        if (self.endsWith(href, '.THM')) {
            return false;
        }
        
        return true;
    }
    
    MTree.prototype.endsWith = function (str, suffix) {
        if (typeof str === 'string') {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        } else {
            return false;
        }
    };
    
    MTree.prototype.getCleanUrl = function (url) {
        return (url || '').replace(/\/\//g, '/');
    };
    
    MTree.prototype.getPropFindUrl = function (url) {
        var self = this;
        url = self.getCleanUrl(url + '/');
        
        url = url + '_DAV/PROPFIND?fields=name,milton:hash,getcontenttype>contentType,href,iscollection&depth=1';
        return url;
    };
    
    $.fn.mtree = function (options) {
        var element = $(this)
        var data = element.data('mtree');
        
        if (!data) {
            element.data('mtree', (data = new MTree(element, options)));
        }
        
        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };
    
    $.fn.mtree.constructor = MTree;
}));
