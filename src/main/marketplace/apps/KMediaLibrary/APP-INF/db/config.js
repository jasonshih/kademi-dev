(function (g) {

    function config() {
        var _self = this;

        _self.APP_ID = g.APP_NAME;
        _self.DB_NAME = _self.APP_ID + '_db';
        _self.DB_TITLE = g.APP_NAME + ' DB';

        _self.RECORD_NAMES = {
            MEDIA_ITEM: function (uuid) {
                return 'media_item_' + uuid;
            },
            MEDIA_CATEGORY: function (uuid) {
                return 'media_category_' + uuid;
            }
        };

        _self.RECORD_TYPES = {
            MEDIA_ITEM: 'MEDIA_ITEM',
            MEDIA_CATEGORY: 'MEDIA_CATEGORY'
        };
    }

    g._config = new config();

})(this);