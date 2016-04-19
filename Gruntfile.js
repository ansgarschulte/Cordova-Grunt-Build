/* global module,require*/

/**
 Before first time launch todos:

 npm install
 sudo gem install xcodeproj
 */

//Start of Grunt Job
module.exports = function (grunt) {

    // Load grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var _ = require('lodash');

    /******************************************************************************
     * Configuration (has to be changed for every project)
     *****************************************************************************/

    /******************************************************************************
     * iOS specific stuff
     *****************************************************************************/

    // IPA Filename
    var ipaFilename = 'MovieDatabaseApp';
    // Provisioning Profile ID
    var provisioningProfileID = '"12053891-c8c8-411d-b5d1-497d63c09caa"';
    // Code Sign ID
    var codeSignId = '"iPhone Developer: Ansgar Schulte (5T8QE3AQWS)"'

    /******************************************************************************
     * Blackberry specific stuff
     *****************************************************************************/
    var bbKeystorepass = grunt.option('bbKeystorepass') || 'DUMMYPASSWORD';

    /******************************************************************************
     * Android specific stuff
     *****************************************************************************/
    var androidKeystorePassword = grunt.option('androidKeystorePassword') || 'DUMMYPASSWORD';
    var androidKeyStorePath = '../codecentric.keystore';
    var androidKeyStorePathAlias = '"codecentric AG"';

    /******************************************************************************
     * Overall stuff
     *****************************************************************************/
    // bundle id
    var appIdentifier = 'de.codecentric.moviedatabaseapp';
    // app name
    var appName = 'MovieDatabase';

    // App Version
    var version = '1.0.0';

    /******************************************************************************
     * Source Pathes (should work without changes)
     *****************************************************************************/
    var config = {
        paths: {
            cordovaProj: './cordova/', // genereated cordova project path
            vcsWWW: './www/', // Location of the webapp
            cordovaWWW: './cordova/www/', //cordova www folder
            defaultIcon: './icons/icon.png', // iOS icons and splash screen
            defaultSplash: './icons/splash.png', // iOS icons and splash screen
            resourcesBBSrc: './icons/', // icons and splash screen
            resourcesBBDest: './cordova/platforms/blackberry10/platform_www/',
            resourcesBBDest2: './cordova/platforms/blackberry10/www/',
            xcodeProj: './cordova/platforms/ios/',
            buildsDir: './builds/', // folder of genereted apps
            bgShellIpa: '../../../builds/' + ipaFilename + '.ipa',
            bgShellApks: './platforms/android/build/outputs/apk/*.apk',
            ipa: './builds/' + ipaFilename + '.ipa',
            iosPlatformFolder: './cordova/platforms/ios/',
            xcodeProj: './cordova/platforms/ios/' + appName + '.xcodeproj',
            htmlFiles: './cordova/www/*.html',
            configXml: './cordova/config.xml',
            configXmlPlatform: './cordova/platforms/blackberry10/www/config.xml',
            bbResultDir: './cordova/platforms/blackberry10/build/device/',
            androidResultDir: './cordova/platforms/android/build/outputs/apk/'
        },

        /**
         * Helper funciton which returns the folder path
         *
         * @param {string}
         *            name Object path for the folder with dot notation
         * @return {string} Folder path
         */
        getFolder: function (name, subfolder) {
            return config.paths[name] + (subfolder ? subfolder + '/' : '');
        },

        /**
         * Append notify-task to task-list if the notify option (--notify) is
         * set in the CLI
         *
         * @param {Array}
         *            tasks Tasks array
         * @param {String}
         *            notifyTask Notify task
         * @return {Array} Task array
         */
        appendNotifyTask: function (tasks, notifyTask) {
            return grunt.option('notify') ? tasks.concat(notifyTask) : tasks;
        }
    };


    // Load user specific config
    try {
        _.extend(config, grunt.file.readJSON('./grunt-custom.json'));
    } catch (e) {
    }

    /******************************************************************************
     * Start of Tool Definition
     *****************************************************************************/
    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),

            copy: {
                www: {
                    expand: true,
                    cwd: config.getFolder('vcsWWW'),
                    src: '**',
                    dest: config.getFolder('cordovaWWW')
                },
                resourcesBB: {
                    expand: true,
                    cwd: config.getFolder('resourcesBBSrc'),
                    src: '**',
                    dest: config.getFolder('resourcesBBDest')
                },
                resourcesBB2: {
                    expand: true,
                    cwd: config.getFolder('resourcesBBSrc'),
                    src: '**',
                    dest: config.getFolder('resourcesBBDest2')
                },
                copyBBBar: {
                    expand: true,
                    cwd: config.getFolder('bbResultDir'),
                    src: '**',
                    dest: config.getFolder('buildsDir')
                },
                copyAndroidAPK: {
                    expand: true,
                    cwd: config.getFolder('androidResultDir'),
                    src: '**',
                    dest: config.getFolder('buildsDir')
                }
            },

            /******************************************************************************
             * Cordova command line interface
             *****************************************************************************/
            cordovacli: {
                options: {
                    path: config.getFolder('cordovaProj'),
                    notify: true,
                    cli: 'cordova'
                },

                create: {
                    options: {
                        command: [
                            'create',
                            'platform',
                            'plugin'
                        ],
                        platforms: [
                            'ios@latest',
                            'blackberry10@latest',
                            'android@latest'
                        ],
                        plugins: [
                            'cordova-plugin-statusbar',
                            'cordova-plugin-splashscreen',
                            'cordova-plugin-inappbrowser',
                            'cordova-plugin-dialogs'
                        ],
                        path: config.getFolder('cordovaProj'),
                        id: appIdentifier,
                        name: appName
                    }
                },
                emulateIOS: {
                    options: {
                        command: 'emulate',
                        platforms: [
                            'ios'
                        ],
                        args: [
                            '--target=iPhone-6'
                        ]
                    }
                },
                emulateAndroid: {
                    options: {
                        command: 'emulate',
                        platforms: ['android'],
                        args: [
                            '--verbose --stacktrace'
                        ]
                    }
                },
                runAndroid: {
                    options: {
                        command: 'run',
                        platforms: ['android'],
                        args: [
                            '--verbose --stacktrace'
                        ]
                    }
                },
                buildIOS: {
                    options: {
                        command: 'build',
                        platforms: [
                            'ios'
                        ],
                        args: [
                            '--release '
                        ]
                    }
                },
                buildBB: {
                    options: {
                        command: 'build',
                        platforms: [
                            'blackberry10'
                        ],
                        args: [
                            '--release --keystorepass ' + bbKeystorepass
                        ]
                    }
                },
                buildAndroid: {
                    options: {
                        command: 'build',
                        platforms: [
                            'android'
                        ],
                        args: [
                            '--release'
                        ]
                    }
                },
                emulateBB: {
                    options: {
                        command: 'emulate',
                        platforms: [
                            'blackberry10'
                        ]
                    }
                }
            },

            /******************************************************************************
             * shell commands
             *****************************************************************************/
            bgShell: {
                deleteCordovaFolder: {
                    cmd: 'rm -fR ' + config.getFolder('cordovaProj'),
                    execOpts: {
                        cwd: './'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: true,
                    done: function () {
                    }
                },
                createBuildsDir: {
                    cmd: '[ -d ' + config.getFolder('buildsDir') + ' ] || mkdir ' + config.getFolder('buildsDir'),
                    execOpts: {
                        cwd: './'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: false,
                    done: function () {
                    }
                },
                fixXcodeSchemes: {
                    cmd: 'export xcodeProj=' + config.getFolder('xcodeProj') + ' && chmod +x ./fix_xcode_schemes.rb && ./fix_xcode_schemes.rb',
                    execOpts: {
                        cwd: './'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: true,
                    done: function () {
                    }
                },
                archiveIpa: {
                    cmd: 'xcodebuild -scheme '+appName+' -sdk iphoneos -configuration AppStoreDistribution archive -archivePath '+appName+'.xcarchive CODE_SIGN_IDENTITY=' + codeSignId+ ' PROVISIONING_PROFILE='+provisioningProfileID,
                    execOpts: {
                        cwd: config.getFolder('iosPlatformFolder')
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: false,
                    done: function () {
                    }
                },
                exportIpa: {
                    cmd: 'xcodebuild -exportArchive -archivePath '+appName+'.xcarchive -exportPath '+ config.getFolder('bgShellIpa')+ ' -exportOptionsPlist /Users/ansgarcc/Sites/cordovaBuilds/exportOptions.plist  CODE_SIGN_IDENTITY=' + codeSignId+ ' PROVISIONING_PROFILE='+provisioningProfileID,
                    execOpts: {
                        cwd: config.getFolder('iosPlatformFolder')
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: false,
                    done: function () {
                    }
                },
                signApk: {
                    cmd: 'rm -f ' + config.getFolder('bgShellApks') + ' && cordova build android --release -- --keystore=' + androidKeyStorePath + ' --storePassword=' + androidKeystorePassword + ' --password=' + androidKeystorePassword + ' --alias=' + androidKeyStorePathAlias + ' && cp ' + config.getFolder('bgShellApks') + ' ../' + config.getFolder('buildsDir') + '/',
                    execOpts: {
                        cwd: './cordova/'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: false,
                    done: function () {
                    }
                },
                buildBB: {
                    cmd: 'platforms/blackberry10/cordova/build --release --keystorepass ' + bbKeystorepass,
                    execOpts: {
                        cwd: './cordova'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: false,
                    done: function () {
                    }
                },
                ionicResourcesIconSplash: {
                    cmd: 'mkdir -p resources && cp ../' + config.getFolder('defaultIcon') + ' ./resources &&  cp ../' + config.getFolder('defaultSplash') + ' ./resources  && ionic resources',
                    execOpts: {
                        cwd: './cordova'
                    },
                    stdout: true,
                    stderr: true,
                    bg: false,
                    fail: true,
                    done: function () {
                    }
                }

            },

            /******************************************************************************
             * string utilities for text files (e. g. change config.xml)
             *****************************************************************************/
            'string-replace': {
                addCordovaJS: {
                    files: [{
                        src: config.getFolder('htmlFiles'),
                        dest: config.getFolder('cordovaWWW')
                    }],
                    options: {
                        replacements: [{
                            pattern: '</body>',
                            replacement: '<script src="cordova.js"></script><script type="text/javascript" src="cordova-plugins.js"></script></body>'
                        }]
                    }
                },
                onDeviceReady: {
                    files: [{
                        src: config.getFolder('htmlFiles'),
                        dest: config.getFolder('cordovaWWW')
                    }],
                    options: {
                        replacements: [{
                            pattern: '</body>',
                            replacement: '<script type="text/javascript" charset="utf-8">' +
                            'document.addEventListener("deviceready", function(){' +
                            '    if (cordova.platformId == \'android\') {' +
                            '       StatusBar.show();' +
                            '       StatusBar.backgroundColorByHexString("#000000");' +
                            '    }' +
                            '}, true);' +
                            '</script></body>'
                        }]
                    }
                },
                setStatusbarAndOrientation: {
                    files: [{
                        src: config.getFolder('configXml'),
                        dest: config.getFolder('configXml')
                    }],
                    options: {
                        replacements: [{
                            pattern: '</widget>',
                            replacement: '\n<platform name="ios"><preference name="orientation" value="all" />\n</platform>'
                            + '<preference name="fullscreen" value="false" />\n'
                            + '<preference name="StatusBarOverlaysWebView" value="false" />\n'
                            + '<preference name="StatusBarBackgroundColor" value="#FFFFFF" />\n'
                            + '<preference name="StatusBarStyle" value="default" />\n'
                            + '<platform name="android"><preference name="StatusBarBackgroundColor" value="#000000" />\n'
                            + '<preference name="StatusBarStyle" value="lightcontent" />\n'
                            + '</platform>\n'
                            + '</widget>'
                        }]
                    }
                },
                setVersionInConfigXML: {
                    files: [{
                        src: config.getFolder('configXml'),
                        dest: config.getFolder('configXml')
                    }],
                    options: {
                        replacements: [{
                            pattern: 'version="0.0.1"',
                            replacement: 'version="' + version + '"'
                        }]
                    }
                },
                setBBIcons: {
                    files: [{
                        src: config.getFolder('configXml'),
                        dest: config.getFolder('configXml')
                    }],
                    options: {
                        replacements: [{
                            pattern: '</widget>',
                            replacement: '\n<platform name="blackberry10">\n<icon src="icon.png" />\n<rim:splash src="splash.png"/>\n</platform></widget>'
                        }]
                    }
                },
                setBBPermissions: {
                    files: [{
                        src: config.getFolder('configXml'),
                        dest: config.getFolder('configXml')
                    }],
                    options: {
                        replacements: [{
                            pattern: '</widget>',
                            replacement: '<access origin="https://abc.com" subdomains="true" />\n<preference name="websecurity" value="disable" />\n<rim:permissions>\n<rim:permit>access_shared</rim:permit>\n<rim:permit>access_location_services</rim:permit>\n<rim:permit>use_camera</rim:permit>\n</rim:permissions>\n</widget>'
                        }]
                    }
                }
            }
        });

    /******************************************************************************
     * Grunt Tasks
     *****************************************************************************/

    /**
     * Grunt build task for all platforms (android, ios, bb)
     */
    grunt.registerTask('build', [
        'bgShell:deleteCordovaFolder',
        'bgShell:createBuildsDir',
        'cordovacli:create',
        'copy:www',
        'string-replace:setVersionInConfigXML',
        'string-replace:addCordovaJS',
        'string-replace:onDeviceReady',
        'string-replace:setStatusbarAndOrientation',
        'string-replace:setBBIcons',
        'bgShell:ionicResourcesIconSplash'

    ]);

    grunt.registerTask('buildIOS', [
        'build',
        'bgShell:fixXcodeSchemes',
        'cordovacli:buildIOS'
    ]);

    grunt.registerTask('buildBB', [
        'build',
        'string-replace:setBBPermissions',
        'copy:resourcesBB',
        'copy:resourcesBB2',
        'cordovacli:buildBB',
        'bgShell:buildBB',
        'copy:copyBBBar'
    ]);

    grunt.registerTask('buildAndroid', [
        'build',
        'bgShell:ionicResourcesIconSplash',
        'cordovacli:buildAndroid',
        'copy:copyAndroidAPK'
    ]);


    grunt.registerTask('emulateIOS', [
        'buildIOS',
        'cordovacli:emulateIOS'
    ]);

    grunt.registerTask('emulateBB', [
        'buildBB',
        'cordovacli:emulateBB'
    ]);

    grunt.registerTask('emulateAndroid', [
        'buildAndroid',
        'cordovacli:emulateAndroid'
    ]);

    grunt.registerTask('runAndroid', [
        'buildAndroid',
        'cordovacli:runAndroid'
    ]);

    grunt.registerTask('exportIOS', [
        'buildIOS',
        'bgShell:archiveIpa',
        'bgShell:exportIpa'
    ]);

    grunt.registerTask('exportAndroid', [
        'buildAndroid',
        'bgShell:signApk'
    ]);

    grunt.registerTask('exportALL', [
        'buildBB',
        'exportIOS',
        'exportAndroid'
    ]);

};
