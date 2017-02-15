module.exports = {
    newPageAdmin: {
        files: [
            {
                src: '<%= pathAssetsAdminTpl %>/base/templates/_base.template.html',
                dest: '<%= pathAssetsAdminTpl %>/base/<%= filename %>.html'
            }
        ]
    }
};
