GridClassKey.grid.Containers = function(config) {
    config = config || {};

    var _this = this;
    var actionItems = [];
    if (MODx.perm['edit_document']) {
        actionItems.push({
            iconCls: 'icon-gridclasskey-edit icon-gridclasskey-actioncolumn-img'
            , tooltip: _('edit')
            , altText: _('edit')
            , handler: function(grid, row, col) {
                var rec = this.store.getAt(row);
                MODx.loadPage(MODx.action['resource/update'], 'id=' + rec.get('id'));
            },
            scope: this
        });
    }
    
    actionItems.push({
        iconCls: 'icon-gridclasskey-view icon-gridclasskey-actioncolumn-img'
        , tooltip: _('view')
        , altText: _('view')
        , handler: function(grid, row, col) {
            var rec = this.store.getAt(row);
            window.open(rec.get('preview_url'));
        },
        scope: this
    });
    
    if (MODx.perm['publish_document'] && MODx.perm['unpublish_document']) {
        actionItems.push({
            handler: function(grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.publishResource(rec.data);
            },
            getClass: function(v, meta, rec) {
                if (rec.get('published')) {
                    this.items[2].tooltip = _('resource_unpublish');
                    this.items[2].altText = _('resource_unpublish');
                    return 'icon-gridclasskey-mute icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[2].tooltip = _('resource_publish');
                    this.items[2].altText = _('resource_publish');
                    return 'icon-gridclasskey-publish icon-gridclasskey-actioncolumn-img';
                }
            }
        });
    }
    
    if (MODx.perm['delete_document'] && MODx.perm['undelete_document']) {
        actionItems.push({
            handler: function(grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.removeResource(rec.data);
            },
            getClass: function(v, meta, rec) {
                if (rec.get('deleted')) {
                    this.items[3].tooltip = _('resource_undelete');
                    this.items[3].altText = _('resource_undelete');
                    return 'icon-gridclasskey-recycle icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[3].tooltip = _('resource_delete');
                    this.items[3].altText = _('resource_delete');
                    return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                }
            }
        });
    }

    Ext.applyIf(config, {
        id: 'gridclasskey-grid-containers'
        , url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/cmp/containers/getlist'
        }
        , fields: ['id', 'pagetitle', 'deleted', 'published', 'action_edit', 'preview_url', 'context_key', 'properties'
                    , 'gridclasskey-property-grid-default_per_page', 'gridclasskey-property-fields'
                    , 'gridclasskey-property-grid-sortby', 'gridclasskey-property-grid-sortdir'
                    , 'gridclasskey-property-grid-css', 'gridclasskey-property-grid-top-js', 'gridclasskey-property-grid-bottom-js'
                    , 'gridclasskey-property-grid-childrentab-text', 'gridclasskey-property-grid-addnewdocbtn-text'
                    , 'gridclasskey-property-child-backbutton-text', 'gridclasskey-property-child-template'
                    , 'gridclasskey-property-child-class_key', 'gridclasskey-property-child-content_type'
                    , 'gridclasskey-property-child-hidemenu', 'gridclasskey-property-child-searchable'
                    , 'gridclasskey-property-child-richtext', 'gridclasskey-property-child-cacheable'
                    , 'gridclasskey-property-child-deleted', 'gridclasskey-property-child-properties'
        ]
        , paging: true
        , remoteSort: true
        , autoExpandColumn: 'pagetitle'
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , getRowClass: function(record, index, rowParams, store) {
                var clsName = 'gridclasskey-row';
                if (record.get('published') === false) {
                    clsName += ' gridclasskey-unpublished';
                }
                if (record.get('deleted') === true) {
                    clsName += ' gridclasskey-deleted';
                }
                if (record.get('hidemenu') === true) {
                    clsName += ' gridclasskey-hidden';
                }
                return clsName;
            }
        }
        , columns: [
            {
                header: _('id')
                , dataIndex: 'id'
                , sortable: true
                , fixed: true
                , width: 60
            }, {
                header: _('pagetitle')
                , dataIndex: 'pagetitle'
                , sortable: true
                , renderer: {
                    fn: this._renderPageTitle
                    , scope: this
                }
            }, {
                header: _('actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'id'
                , sortable: false
                , editable: false
                , fixed: true
                , width: 107
                , items: actionItems
            }
        ]
        , tbar: [
            '->', {
                xtype: 'textfield'
                , emptyText: _('gridclasskey.search...')
                , listeners: {
                    'render': {
                        fn: function(cmp) {
                            var _this = this;
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER
                                , fn: function() {
                                    _this.search(cmp);
                                    this.blur();
                                    return true;
                                }
                                , scope: cmp
                            });
                        }
                        , scope: this
                    }
                }
            }
        ]
    });
    this._makeTemplates();

    GridClassKey.grid.Containers.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.grid.Containers, MODx.grid.Grid, {
    search: function(tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    , _makeTemplates: function() {
        this.tplPageTitle = new Ext.XTemplate('<tpl for="."><a href="{action_edit}" onclick="return event.button || event.ctrlKey || event.metaKey ? true : (MODx.loadPage(\'{action_edit}\'), false)" title="' + _('edit') + ' {pagetitle}">{pagetitle}</a></tpl>', {
            compiled: true
        });
    }
    , _renderPageTitle: function(v, md, rec) {
        return this.tplPageTitle.apply(rec.data);
    }
    , getMenu: function() {
        var deleteTitle = this.menu.record.deleted ? _('resource_undelete') : _('resource_delete');
        var publishTitle = this.menu.record.published ? _('unpublish') : _('publish');
        return [
            {
                text: _('gridclasskey.update_settings')
                , handler: this.updateSettings
            }, '-', {
                text: _('edit')
                , handler: function(btn, e) {
                    this.updateResource(this.menu.record);
                }
            }, {
                text: _('view')
                , handler: function(btn, e) {
                    window.open(this.menu.record.preview_url);
                }
            }, {
                text: publishTitle
                , handler: function(btn, e) {
                    this.publishResource(this.menu.record);
                }
            }, {
                text: _('resource_duplicate')
                , handler: this.duplicateResource
            }, '-', {
                text: deleteTitle
                , handler: function(btn, e) {
                    this.removeResource(this.menu.record);
                }
            }
        ];
    }
    , updateSettings: function(btn, e) {
        var check = Ext.getCmp('gridclasskey-window-setting');
        if (check) {
            check.destroy();
        }
        var settingsGrid = Ext.getCmp('gridclasskey-grid-gridsettings');
        if (settingsGrid) {
            settingsGrid.loadData(this.menu.record['gridclasskey-property-fields']);
            settingsGrid.getView().refresh();
        }
        var updateSettingWindow = MODx.load({
            xtype: 'gridclasskey-window-setting'
            , id: 'gridclasskey-window-setting'
            , title: _('settings')
            , baseParams: {
                action: 'mgr/cmp/containers/update'
                , id: this.menu.record.id
            }
            , record: this.menu.record
        });
        updateSettingWindow.setValues(this.menu.record);
        updateSettingWindow.show(e.target);
        var _this = this;
        updateSettingWindow.on('success', function(o) {
            _this.refresh();
        });
    }
    , updateResource: function(record) {
        MODx.loadPage(MODx.action['resource/update'], 'id=' + record.id);
    }
    , removeResource: function(record) {
        var title = record.deleted ? _('resource_undelete') : _('resource_delete');
        var text = record.deleted ? _('resource_undelete_confirm') : _('resource_delete_confirm');
        var action = record.deleted ? (MODx.version_is22 < 0 ? 'resource/undelete' : 'undelete') : (MODx.version_is22 < 0 ? 'resource/delete' : 'delete');
        MODx.msg.confirm({
            title: title
            , text: text
            , url: MODx.config.connectors_url + (MODx.version_is22 < 0 ? 'index.php' : 'resource/index.php')
            , params: {
                action: action
                , id: record.id
            }
            , listeners: {
                'success': {
                    fn: function(response){
                        this.refresh();
                        var t = Ext.getCmp('modx-resource-tree');
                        if (t) {
                            var treeNode = t.getNodeById(record.context_key + '_' + record.id);
                            var ui = treeNode.getUI();
                            
                            if (record.deleted) {
                                ui.removeClass('deleted');
                            } else {
                                ui.addClass('deleted');
                            }
                            treeNode.cascade(function(nd) {
                                nd.getUI().addClass('deleted');
                                if (record.deleted) {
                                    nd.getUI().removeClass('deleted');
                                } else {
                                    nd.getUI().addClass('deleted');
                                }
                            }, t);
                            Ext.get(ui.getEl()).frame();
                        }
                    },
                    scope: this
                }
            }
        });
    }
    , publishResource: function(record) {
        var action = record.published ? (MODx.version_is22 < 0 ? 'resource/unpublish' : 'unpublish') : (MODx.version_is22 < 0 ? 'resource/publish' : 'publish');
        MODx.Ajax.request({
            url: MODx.config.connectors_url + (MODx.version_is22 < 0 ? 'index.php' : 'resource/index.php')
            , params: {
                action: action
                , id: record.id
            }
            , listeners: {
                'success': {
                    fn: function(response){
                        this.refresh();
                        var t = Ext.getCmp('modx-resource-tree');
                        if (t) {
                            var treeNode = t.getNodeById(record.context_key + '_' + record.id);
                            var ui = treeNode.getUI();
                            
                            if (record.published) {
                                ui.addClass('unpublished');
                            } else {
                                ui.removeClass('unpublished');
                            }
                            treeNode.cascade(function(nd) {
                                if (record.published) {
                                    nd.getUI().addClass('unpublished');
                                } else {
                                    nd.getUI().removeClass('unpublished');
                                }
                            }, t);
                            Ext.get(ui.getEl()).frame();
                        }
                    },
                    scope: this
                }
            }
        });
    }
    , duplicateResource: function(item, e) {
        var r = {
            resource: this.menu.record.id
            , is_folder: this.menu.record.isfolder
        };

        var w = MODx.load({
            xtype: 'modx-window-resource-duplicate'
            , resource: this.menu.record.id
            , hasChildren: this.menu.record.has_children
            , listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
        w.config.hasChildren = this.menu.record.has_children;
        w.setValues(r);
        w.show(e.target);
    }
});
Ext.reg('gridclasskey-grid-containers', GridClassKey.grid.Containers);