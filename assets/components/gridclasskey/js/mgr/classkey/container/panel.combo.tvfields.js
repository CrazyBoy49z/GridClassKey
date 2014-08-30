GridClassKey.panel.TVFieldsCombo = function(config) {
    config = config || {};

    var items = [];
    if (!config.fieldLabel) {
        items.push({
            html: '<div class="x-form-item-label">' + _('gridclasskey.settings_add_tv_field') + ': </div>'
            , border: false
        });
    }
    items.push({
        xtype: 'gridclasskey-combo-tvfields'
        , id: config.id + '-combo' || ''
        , comboWidth: config.comboWidth || ''
    }, {
        xtype: 'button'
        , text: _('add')
        , handler: function() {
            if (config.applyToGrid) {
                var targetGrid = Ext.getCmp(config.applyToGrid),
                        store = targetGrid.getStore();
                var fieldsCombo = Ext.getCmp(config.id + '-combo');
                var comboValue = fieldsCombo.getValue();
                var array = [];
                Ext.each(store.data.items, function(item){
                    array.push(item.data.name);
                });
                var text = fieldsCombo.lastSelectionText;
                if (indexOf.call(array, text) !== -1) {
                    return false;
                }
                if (comboValue) {
                    var r = new store.recordType({"sort": store.getCount() + 1, "name": text, "type": "tv"}); 
                    r.commit();
                    store.add(r);
                    store.commitChanges();
                    Ext.getCmp('modx-panel-resource').markDirty();
                    var btn = Ext.getCmp('modx-abtn-save');
                    if (btn) {
                        btn.enable();
                    }
                }
            }
        }
        , scope: this
    }, {
        xtype: 'button'
        , text: _('gridclasskey.clear')
        , handler: function() {
            var fieldsCombo = Ext.getCmp(config.id + '-combo');
            fieldsCombo.setValue('');

            var btn = Ext.getCmp('modx-abtn-save');
            if (btn) {
                btn.enable();
            }
        }
        , scope: this
    });

    Ext.apply(config, {
        layout: 'hbox'
        , layoutConfig: {
            align: 'middle'
            , pack: 'start'
        }
        , defaults: {
            margins: '0 5 0 0'
        }
        , items: items
    });

    GridClassKey.panel.TVFieldsCombo.superclass.constructor.call(this, config);
};


Ext.extend(GridClassKey.panel.TVFieldsCombo, MODx.Panel);
Ext.reg('gridclasskey-panel-tvfieldscombo', GridClassKey.panel.TVFieldsCombo);