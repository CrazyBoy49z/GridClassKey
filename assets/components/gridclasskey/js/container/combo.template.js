GridClassKey.combo.Template = function(config) {
    config = config || {};

    Ext.apply(config, {
        url: GridClassKey.connector_url
        , baseParams: {
            action: 'element/template/getList'
        }
    });
    GridClassKey.combo.Template.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.combo.Template, MODx.combo.Template);
Ext.reg('gridclasskey-combo-template', GridClassKey.combo.Template);