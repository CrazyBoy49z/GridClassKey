GridClassKey.grid.GridSettings = function(config) {
    config = config || {};

    Ext.apply(config, {
        id: 'gridclasskey-grid-gridsettings'
        , fields: ['sort', 'name', 'type', 'lexicon', 'width', 'fixed', 'sortable', 'hidden', 'editor_type', 'output_filter']
        , sortInfo: {field: 'sort', direction: 'asc'}
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , emptyText: config.emptyText || _('gridclasskey.empty')
        }
        , enableDragDrop: true
        , enableColumnMove: false
        , sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
        , data: []
        , deferredRender: true
        , preventRender: true
        , autoHeight: true
        , autoExpandColumn: 'lexicon'
        , columns: [
            {
                header: _('gridclasskey.sort')
                , dataIndex: 'sort'
                , sortable: true
                , width: 50
                , editable: false
            }, {
                header: _('name')
                , dataIndex: 'name'
            }, {
                header: _('type')
                , dataIndex: 'type'
                , sortable: true
                , width: 70
                , editable: false
//                , hidden: true
            }, {
                header: _('lexicon') + ' / ' + _('caption')
                , dataIndex: 'lexicon'
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.width')
                , xtype: 'numbercolumn'
                , format: '0,000'
                , dataIndex: 'width'
                , width: 50
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.fixed')
                , xtype: 'booleancolumn'
                , dataIndex: 'fixed'
                , sortable: false
                , width: 50
                , trueText: _('yes')
                , falseText: _('no')
                , editor: {
                    xtype: 'modx-combo-boolean'
                    , width: 50
                    , listWidth: 100
                }
            }, {
                header: _('gridclasskey.sortable')
                , xtype: 'booleancolumn'
                , dataIndex: 'sortable'
                , width: 50
                , trueText: _('yes')
                , falseText: _('no')
                , editor: {
                    xtype: 'modx-combo-boolean'
                    , width: 50
                    , listWidth: 100
                }
            }, {
                header: _('gridclasskey.hidden')
                , xtype: 'booleancolumn'
                , dataIndex: 'hidden'
                , width: 50
                , trueText: _('yes')
                , falseText: _('no')
                , editor: {
                    xtype: 'modx-combo-boolean'
                    , width: 50
                    , listWidth: 100
                }
            }, {
                header: _('gridclasskey.editor_type')
                , dataIndex: 'editor_type'
                , width: 100
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.output_filter')
                , description: _('gridclasskey.output_filter_desc')
                , dataIndex: 'output_filter'
                , width: 100
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'id'
                , editable: false
                , width: 50
                , fixed: true
                , items: [
                    {
                        handler: function(grid, row, col) {
                            var _this = Ext.getCmp('gridclasskey-grid-gridsettings'),
                                    rec = _this.store.getAt(row);
                            if (rec.get('name') === 'id') {
                                return false;
                            }
                            _this.getStore().remove(rec);
                            var btn = Ext.getCmp('modx-abtn-save');
                            if (btn) {
                                btn.enable();
                            }
                        },
                        getClass: function(v, meta, rec) {
                            if (rec.get('name') === 'id') {
                                this.items[0].tooltip = '';
                                this.items[0].altText = '';
                                return 'icon-gridclasskey-hidden';
                            } else {
                                this.items[0].tooltip = _('delete');
                                this.items[0].altText = _('delete');
                                return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                            }
                        }
                    }
                ]
            }
        ]
        , bbar: [
            '->', {
                text: _('reset')
                , handler: function() {
                    var fields = config.record
                            && config.record.properties
                            && config.record.properties.gridclasskey
                            && config.record.properties.gridclasskey.fields
                            ? config.record.properties.gridclasskey.fields
                            : {};
                    this.resetData(fields);
                }
                , scope: this
            }, {
                text: _('gridclasskey.back_to_default')
                , handler: this.revertDefaultData
                , scope: this
            }
        ]
        , listeners: {
            'celldblclick': {
                fn: function(grid, rowIndex, columnIndex, e) {
                    Ext.getCmp('modx-panel-resource').markDirty();
                    var btn = Ext.getCmp('modx-abtn-save');
                    if (btn) {
                        btn.enable();
                    }
                }
                , scope: this
            }
            , render: this.initializeDragDropZone
            , afterrender: {
                fn: function() {
                    var fields = config.record
                            && config.record.properties
                            && config.record.properties.gridclasskey
                            && config.record.properties.gridclasskey.fields
                            ? config.record.properties.gridclasskey.fields
                            : {};

                    this.loadData(fields);
                }
                , scope: this
            }
            , afteredit: {
                fn: function(e) {
                    this.getStore().commitChanges();
                }
                , scope: this
            }
        }
    });

    GridClassKey.grid.GridSettings.superclass.constructor.call(this, config);

};
Ext.extend(GridClassKey.grid.GridSettings, MODx.grid.LocalGrid, {
    updateModifiedRecords: function() {
        var records = this.getStore().getRange();
        var newData = [];
        Ext.each(records, function(record, idx){
            var fieldRecord = record.data;
            newData.push([
                idx + 1,
                fieldRecord.name,
                fieldRecord.type,
                fieldRecord.lexicon,
                fieldRecord.width,
                fieldRecord.fixed,
                fieldRecord.sortable,
                fieldRecord.hidden,
                fieldRecord.editor_type,
                fieldRecord.output_filter
            ]);
        });
        this.getStore().loadData(newData);
        this.getView().refresh();
        return newData;
    },
    loadData: function(fields) {
        if (fields.length) {
            var data = [], hasID = false;
            Ext.each(fields, function(item, idx) {
                if (item.name === 'id') {
                    hasID = true;
                    return false;
                }
            });
            if (!hasID) {
                data.push({
                    'name': 'id',
                    'type': 'main',
                    'lexicon': 'id',
                    'width': 75,
                    'fixed': true,
                    'sortable': true,
                    'hidden': false,
                    'editor_type': '',
                    'output_filter': ''
                });
            }
            Ext.each(fields, function(fieldRecord, idx) {
                data.push([
                    idx + 1,
                    fieldRecord.name,
                    fieldRecord.type,
                    fieldRecord.lexicon,
                    fieldRecord.width,
                    fieldRecord.fixed,
                    fieldRecord.sortable,
                    fieldRecord.hidden,
                    fieldRecord.editor_type,
                    fieldRecord.output_filter
                ]);
            });
        } else {
            var data = this.getDefaultData();
        }
        this.data = data;
        this.getStore().loadData(this.data);
        this.getView().refresh();
    }
    , getDefaultData: function() {
        var data = [
            [1, 'id', 'main', 'id', 75, true, true, false],
            [2, 'pagetitle', 'main', 'pagetitle', '', false, true, false, 'textfield']
        ];
        return data;
    }
    , resetData: function(fields) {
        if (fields.length) {
            this.loadData(fields);

            var btn = Ext.getCmp('modx-abtn-save');
            if (btn) {
                btn.enable();
            }
        }
    }
    , revertDefaultData: function(btn, e) {
        this.data = this.getDefaultData();
        this.getStore().loadData(this.data);
        this.getView().refresh();

        var btn = Ext.getCmp('modx-abtn-save');
        if (btn) {
            btn.enable();
        }
    }
    , initializeDragDropZone: function(gridPanel) {
        this.dragZone = new Ext.dd.DragZone(gridPanel.getEl(), {
            getDragData: function(e) {
                var rowEl = e.getTarget(gridPanel.getView().rowSelector, 10);
                var sourceEl = Ext.select('div.x-grid3-col-1', true, rowEl).elements[0].dom;
                if (rowEl && sourceEl) {
                    var d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return {
                        ddel: d,
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        sourceStore: gridPanel.store,
                        draggedRecord: rowEl
                    };
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY;
            }
        });

        this.dropZone = new Ext.dd.DropZone(gridPanel.getView().scroller, {
            getTargetFromEvent: function(e) {
                return e.getTarget(gridPanel.getView().rowSelector);
            },
            onNodeOver: function(target, dd, e, data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            onNodeDrop: function(target, dd, e, data) {
                var targetRowIndex = gridPanel.getView().findRowIndex(target);
                var draggedRowIndex = gridPanel.getView().findRowIndex(data.draggedRecord);
                var isSteppingUp = (targetRowIndex < draggedRowIndex);
                var oldData = gridPanel.updateModifiedRecords();
                var newData = oldData; // initial fills
                var draggedData = oldData[draggedRowIndex];
                if (isSteppingUp) {
                    for (var i = draggedRowIndex; i > targetRowIndex; i--) {
                        var item = oldData[i - 1];
                        item[0] = i + 1;
                        newData[i] = item;
                    }
                } else {
                    for (var i = draggedRowIndex; i < targetRowIndex; i++) {
                        var item = oldData[i + 1];
                        item[0] = i + 1;
                        newData[i] = item;
                    }
                }
                draggedData[0] = targetRowIndex + 1;
                newData[targetRowIndex] = draggedData;

                gridPanel.getStore().loadData(newData);
                gridPanel.getView().refresh();
                var modxPanelResource = Ext.getCmp('modx-panel-resource');
                if (modxPanelResource) {
                    modxPanelResource.markDirty();
                }
                var btn = Ext.getCmp('modx-abtn-save');
                if (btn) {
                    btn.enable();
                }
                return true;
            }
        });
    }
    , beforeDestroy: function() {
        if (this.rendered) {
            this.dragZone.destroy();
            this.dropZone.destroy();
        }
        GridClassKey.grid.GridSettings.superclass.beforeDestroy.call(this);
    }
});
Ext.reg('gridclasskey-grid-gridsettings', GridClassKey.grid.GridSettings);