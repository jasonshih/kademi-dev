/* global transactionManager, log, Utils, formatter */

(function (g) {
    g._getOrCreateUrlDb = function (page) {
        var jsonDb = page.find('/jsondb');
        var db = jsonDb.child(g._config.DB_NAME);
        log.info("jsonDb = {} db = {}", jsonDb, db);
        try {
            if (Utils.isNull(db)) {
                db = jsonDb.createDb(g._config.DB_NAME, g._config.DB_TITLE, g._config.DB_NAME);

                g._updateMappings(db);

                g._setAllowAccess(db, true);
            }
        } catch (e) {
            log.error('Error checking DB exists: {}', e.message, e);
        }

        return db;
    };

    g._setAllowAccess = function (jsonDB, allowAccess) {
        transactionManager.runInTransaction(function () {
            jsonDB.setAllowAccess(allowAccess);
        });
    };

    g._updateMappings = function (db) {
        var b = formatter.newMapBuilder();

        if (Utils.isNotNull(g.MAPPINGS)) {
            for (var i = 0; i < g.MAPPINGS.length; i++) {
                var m = g.MAPPINGS[i];
                b.field(m.TYPE, JSON.stringify(m.MAPPING));
            }
        }

        log.info('Update mappings for {} | {}', db, b);

        db.updateTypeMappings(b);
    };
})(this);