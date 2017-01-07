/// <binding />
var gulp = require("gulp");

// Delete the dist directory
var clean = require("gulp-clean");
gulp.task("clean",
    function () {
        return gulp.src("./wwwroot/")
            .pipe(clean());
    });

// Node Modules --> nm
gulp.task("nm",
    () => {
        gulp.src([
            "core-js/client/**",
            "systemjs/dist/system.src.js",
            "reflect-metadata/**",
            "rxjs/**",
            "zone.js/dist/**",
            "@angular/**",
            "jquery/dist/jquery.*js",
            "bootstrap/dist/js/bootstrap.*js",
            "ms-signalr/jquery.signalR.js"
        ],
        {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest("./wwwroot/node_modules"));
    });

// TypeScript --> ts
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
gulp.task("ts",
    function () {
        return tsProject.src()
            .pipe(ts(tsProject))
            .js.pipe(gulp.dest("wwwroot/app"));
    });

// less
var less = require("gulp-less");
gulp.task("less",
    function () {
        var appFiles = [
            "./app/**/*.less"
        ];

        var rootFiles = [
            "./node_modules/bootstrap/less/bootstrap.less"
            //"./node_modules/font-awesome/less/font-awesome.less"
        ];

        return gulp.src(appFiles)
            .pipe(less())
            .pipe(gulp.dest("./wwwroot/app")) &&
            gulp.src(rootFiles)
            .pipe(less())
            .pipe(gulp.dest("./wwwroot/styles"));
    });

// html
gulp.task("html",
    function () {
        var appFiles = [
            "./app/**/*.html"
        ];

        var rootFiles = [
            "./index.html",
            "./systemjs.config.js"
        ];

        return gulp.src(appFiles)
            .pipe(gulp.dest("./wwwroot/app")) &&
            gulp.src(rootFiles)
            .pipe(gulp.dest("./wwwroot"));

    });

gulp.task("init", ["html", "less", "ts", "nm"]);

gulp.task("watch", ["watch.ts", "watch.html", "watch.less"]);

        gulp.task("watch.ts",
            ["ts"],
            function () {
                return gulp.watch("app/**/*.ts", ["ts"]);
            });

        gulp.task("watch.html",
            ["html"],
            function () {
                return gulp.watch("app/**/*.html", ["html"]);
            });

        gulp.task("watch.less",
            ["less"],
            function () {
                return gulp.watch("app/**/*.less", ["less"]);
            });

gulp.task("default", ["nm", "watch"]);