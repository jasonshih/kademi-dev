module.exports = {
    layoutAdmin: {
        files: [{
            expand: true,
            cwd: '<%= pathAssetsAdminTpl %>/css',
            src: ['**/*.css', '!**/*.min.css'],
            dest: '<%= pathAssetsAdminTpl %>/css',
            ext: '.min.css'
        },
        {
            '<%= pathAssetsAdminTpl %>/fonts/clip-font.min.css': ['<%= pathAssetsAdminTpl %>/fonts/clip-font.css']
        }]        
    },
    libs: {
        files: {
            //'<%= pathAssetsAdminTpl %>/plugin/jquery-ui.custom.min.css': ['<%= pathAssetsAdminTpl %>/plugin/jquery-ui.custom.css']
        }
    }
};