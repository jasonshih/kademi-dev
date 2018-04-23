(function (g) {

    function config() {
        var _self = this;

        _self.APP_ID = 'travelDeals';
        _self.REPO_NAME = _self.APP_ID + '_repo';
        _self.DB_NAME = _self.APP_ID + '_db';
        _self.DB_TITLE = 'Travel Deals DB';

        _self.DEFAULT_GROUP = 'dealEnquires';
        _self.DEFAULT_ROOT_PATH = 'ourDeals';
        _self.DEFAULT_CATEGORYPATH = 'ourDealsByCategory';
        _self.DEFAULT_MENU_TITLE = 'Our Deals';

        _self.DEFAULT_BANNER_DIMENSIONS = '650x216';
        _self.DEFAULT_PREVIEW_DIMENSIONS = '360x232';

        _self.DEFAULT_PATHS = {
            'rootPath': _self.DEFAULT_ROOT_PATH,
            'categoryPath': _self.DEFAULT_CATEGORYPATH
        };

        _self.RECORD_NAMES = {
            DEAL: function (name) {
                return 'deal_' + name;
            },
            CATEGORY: function (name) {
                return 'cat_' + name;
            },
            TAG: function (name) {
                return 'tag_' + name;
            },
            ENQUIRY: function () {
                return 'enquiry_' + (new Date()).getTime();
            }
        };

        _self.RECORD_TYPES = {
            DEAL: 'DEAL',
            CATEGORY: 'CATEGORY',
            TAG: 'TAG',
            ENQUIRY: 'ENQUIRY'
        };
    }

    g._config = new config();
})(this);