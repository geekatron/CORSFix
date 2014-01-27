/**
 * Created with WebStorm.
 * Date: 1/27/2014
 * Time: 2:27 PM
 * @author Adam C. Nowak
 * @description
 */

/*global module:false*/

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            sip : {
//        src: ['lib/<%= pkg.name %>.js'],
                src: [
                    'public/js/app/src/config/config.js',
                    'public/js/app/src/util/util.js',
                    'public/js/app/src/util/util_jquery.js',

                    //'public/js/app/src/ko/ko_custom_bindings.js',

                    'views/template/template.js',
                    'views/template/global/template_global.js',
                    'views/template/error/template_error.js',
                    'views/template/layouts/template_layouts.js',
                    'views/template/layouts/template_onecolumn.js',
                    'views/template/layouts/template_twocolumn.js',
                    'views/template/authentication/template_authentication.js',
                    'views/template/home/template_home.js',
                    //Add the rest of the template JS files here for concatenation
                    'views/template/interviewprepprofile/template_ipp.js',
                    'views/template/authentication/template_signup.js',
                    'views/template/config/template_config.js',
                    'views/template/admin/template_admin.js',
                    'views/template/admin/template_admin_home.js',
//                    'views/template/admin/template_admin_config.js',
                    'views/template/admin/template_admin_cp.js',
                    'views/template/admin/template_admin_ep.js',
                    'views/template/admin/template_admin_pp.js',
                    'views/template/admin/template_admin_mp.js',
                    'views/template/admin/template_admin_uam.js',

                    /* Related to Content Management */
//                    'public/js/app/src/contentmanagement/content.js',
//                    'public/js/app/src/content/content.js',
//                    'public/js/app/src/promotion/promotion.js',
//                    'public/js/app/src/promotion/promotion_management.js',
//                    'public/js/app/src/promotion/promotion_player.js',
//                    'public/js/app/src/promotion/promotion_template.js',

                    /* Integration related components - e.g. Calling DB Functions*/
                    'public/js/app/src/integration/integration.js',
                    'public/js/app/src/integration/sip/login_rest.js',
                    'public/js/app/src/integration/sip/uam_rest.js',
                    'public/js/app/src/integration/sip/cp_rest.js',
                    'public/js/app/src/integration/sip/ipp_rest.js',
                    'public/js/app/src/integration/sip/ep_rest.js',
                    'public/js/app/src/integration/sip/mp_rest.js',
                    'public/js/app/src/integration/sip/pp_rest.js',

//                    'public/js/app/src/report/3rdpartyreport.js',
//                    'public/js/app/src/schedule/schedule.js',

                    /* Schema for Concepts */
//                    'public/js/app/src/schema/campaign_schema.js',
//                    'public/js/app/src/schema/scp/schema_scp.js',

                    /* View Models */
                    'public/js/app/src/viewmodel/vm_helper.js',
//                    'public/js/app/src/viewmodel/vm_genericconcepts.js',
                    'public/js/app/src/viewmodel/interviewprepprofile/vm_ipp.js',
                    'public/js/app/src/viewmodel/login/vm_login.js',
                    'public/js/app/src/viewmodel/login/vm_signup.js',
                    'public/js/app/src/viewmodel/config/vm_config.js',
                    'public/js/app/src/viewmodel/admin/vm_admin.js',
//                    'public/js/app/src/viewmodel/admin/vm_admin_config.js',
                    'public/js/app/src/viewmodel/admin/vm_admin_cp.js',
                    'public/js/app/src/viewmodel/admin/vm_admin_ep.js',
                    'public/js/app/src/viewmodel/admin/vm_admin_pp.js',
                    'public/js/app/src/viewmodel/admin/vm_admin_mp.js',
                    'public/js/app/src/viewmodel/admin/vm_admin_uam.js',

                    /* Sample Data */
                    'views/data/sampledata/sampledata.js',
                    'views/data/sampledata/sd_multimedia.js',
                    'views/data/sampledata/sd_companyprofile.js',
                    'views/data/sampledata/sd_employeeprofile.js',
                    'views/data/sampledata/sd_positionprofile.js',
                    'views/data/sampledata/sd_ipp.js',
                    'views/data/sampledata/sd_uam.js'
                ],
                dest: 'public/js/app/build/<%= pkg.name %>.js'
            },
            node : {
                src: [
                    'views/template/template_export.js',
                    'views/template/global/template_global.js',
                    'views/template/error/template_error.js',
                    'views/template/layouts/template_layouts.js',
                    'views/template/layouts/template_onecolumn.js',
                    'views/template/layouts/template_twocolumn.js',
                    'views/template/authentication/template_authentication.js',
                    'views/template/home/template_home.js',
                    'views/template/interviewprepprofile/template_ipp.js',
                    'views/template/authentication/template_signup.js',
                    'views/template/admin/template_admin.js',
                    'views/template/admin/template_admin_home.js',
//                    'views/template/admin/template_admin_config.js',
                    'views/template/admin/template_admin_cp.js',
                    'views/template/admin/template_admin_ep.js',
                    'views/template/admin/template_admin_pp.js',
                    'views/template/admin/template_admin_mp.js',
                    'views/template/admin/template_admin_uam.js',
                    'views/template/config/template_config.js'
                    //Add the rest of the templates - e.g. Interview Prep Profile, Company Profile, Administration
                ],
                dest: 'views/template.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.sip.dest %>',
                dest: 'public/js/app/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                reporter: 'checkstyle',
                reporterOutput: './checkstyle.xml',
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            sources: {
                src: ['libs/**/*.js', 'test/**/*.js', 'views/template/**/*js', 'public/js/app/src/**/*.js' ]
            }
        },
//    qunit: {
//      files: ['test/**/*.html']
//    },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            sourcefiles: {
                files: '**/*.js',
                tasks: ['concat', 'uglify', 'copy']
            }
//            lib_test: {
//                files: '<%= jshint.lib_test.src %>',
//                tasks: ['jshint:lib_test', 'qunit']
//            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: ['public/js/app/build/<%= pkg.name %>.js'],
                        dest: 'public/js/lib/<%= pkg.name %>.js'
                    }
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
//    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);
    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
//    grunt.registerTask('default', ['concat', 'uglify', ©'copy', 'watch']);

};