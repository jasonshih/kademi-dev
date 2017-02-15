module.exports = function (grunt) {

    //It returns the time of each task
    require('time-grunt')(grunt);


    require('load-grunt-tasks')(grunt);
    require('load-grunt-config')(grunt, {
        // data passed into config.  Can use with <%= pathAssetsAdminTpl %>
        data: {
            pathAssetsAdminTpl: "./",
            pathBowerComponents: "plugin"
        }
    });

    // LTR version
    grunt.registerTask('buildadmin', ['compass:layoutAdmin', 'cssmin:layoutAdmin']);
    //grunt.registerTask('buildadmin', ['compass:layoutAdmin', 'cssmin:layoutAdmin', 'uglify:layoutAdmin', 'htmlbuild:admin']);
    grunt.registerTask('buildpageadmin', ['prompt:setNameNewPageAdmin', 'copy:newPageAdmin', 'htmlbuild:admin']);
    grunt.registerTask('buildlibs', ['concat:libs', 'uglify:libs', 'cssmin:libs', 'less:libs', 'less:libsCompress']);
};
