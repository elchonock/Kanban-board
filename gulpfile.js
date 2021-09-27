// function defaultTask(cb) {
//     // place code for your default task here
//     cb();
//   }
  
//   exports.default = defaultTask;
// это был тестовый код, его можно удалить


const project_folder = "dist";  // папка с готовым, собранным проектом
const source_folder = "#src";  // рабочая папка

const path = {
    build: {   // пути, куда gulp будет отгружать уже обработанные файлы
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },  
    src: {   // пути файлов исходников
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // ** значит, что будут слушаться все подпапки папки img
        // /*.{}названия файлов.{расширения}
        fonts: source_folder + "/fonts/*.ttf",  // расширение ttf
    }, 
    // файлы, которые нужно слушать постоянно и сразу налету выполнять
    watch: {  
        html: source_folder + "/**/*.html", //все подпапки с расширением html
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // ** значит, что будут слушаться все подпапки папки img
        // /*.{}названия файлов.{расширения}
    }, 
    // ?? путь к папке проекта, удаление ее каждый раз при запуске Gulp
    clean: "./" + project_folder + "/",
};

const {src, dest} = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHTML  = require("gulp-webp-html");
const webpcss  = require("gulp-webpcss");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require("fs"); //file system



function browserSync(params) {  // название функции должно отличаться от переменной
    browsersync.init({
         server :{
            baseDir: "./" + project_folder + "/",
        },
        port:3000,
        notify:false,
    });
}


// функция для работы с html:
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webpHTML())
        .pipe(dest(path.build.html))  // перебросить файлы из исходной в папку назначения
        .pipe(browsersync.stream());  // внутри этой функции пишем команды для галпа
  
}


function css(params) {
    return src(path.src.css) //include не нужен так как scss и без этого умеет подключать внешние файлы
    .pipe(scss({
        outputStyle: "expanded"
    }))
    .pipe(group_media())
    .pipe(autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
    }))

    .pipe(webpcss({webpClass: '.webp',noWebpClass: '.no-webp'}))

    .pipe(dest(path.build.css)) // выгружаем файл до того как мы его сжимаем и переименовуем

    .pipe(clean_css())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(dest(path.build.css))

    .pipe(browsersync.stream());
}


function js() {
    return src(path.src.js)
        .pipe(fileinclude()) // понадобится, чтобы собрать файлы по частям в один
        .pipe(dest(path.build.js)) // перебросить файлы из исходной в папку назначения
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))

        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(path.build.js)) // создать в папке dist/js уже сжатый, переименованный файл

        .pipe(browsersync.stream());  
    
}


function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 3,  // 0 to 7
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}


function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
    
}


gulp.task("svgSprite", function () { // эту функцию будем вызывать отдельно в терминале
    return gulp.src([source_folder + "/iconsprite/*.svg"])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",   //куда будет выводиться готовый собранный файл
                    // example: true  // будет создавать html файл с примерами иконок
                }
            },

        }))
        .pipe(dest(path.build.img)); 
}); // такая конструкция для одноразовых или нечастых задач, функцию для использования нужно вызывать отдельно
// командой в терминале gulp svgSprite


function fontsStyle(params) {  // отвечает за запить и подключение шрифтов к файлу стилей

    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
    if (items) {
    let c_fontname;
    for (var i = 0; i < items.length; i++) {
    let fontname = items[i].split('.');
    fontname = fontname[0];
    if (c_fontname != fontname) {
    fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
    }
    c_fontname = fontname;
    }
    }
    });
    }
    }
    
    function cb() {}  //callback функция


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);  // ([путь], функция)
    gulp.watch([path.watch.img], images);
    
}


// удаляет папку dist
function clean(params) {
    return del(path.clean);
    
}


const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);   //series(функции, которые должны выполняться)
const watch = gulp.parallel(build, watchFiles, browserSync);

// подружить gulp с новыми переменными:

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch; 
// при запуске gulp по умолчанию будет выполняться watch, 
//которая запустит browserSync






