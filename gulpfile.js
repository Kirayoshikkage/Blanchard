const {src,dest,series,watch} = require('gulp')
var build = { 
        html: 'build/',
        js: 'build/js/',
        css: 'build/styles/',
        img: 'build/img/',
        fonts: 'build/fonts/'
};
var dev = { 
    html: 'dev/',
    js: 'dev/js/',
    css: 'dev/styles/',
    img: 'dev/img/',
    fonts: 'dev/fonts/'
};
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autopref = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const browsersync = require('browser-sync').create()
const svgsprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const delcom = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps')
const webp = require('gulp-webp')
const woff2 = require('gulp-ttf2woff2')
const del = require('del')
const sass = require('gulp-sass')(require('sass'));
/*
sass compile
*/
const sasscompile = () => {
    return src('dev/styles/**/*.scss')
    .pipe(sass())
    .pipe(dest('dev/styles/'))
    .pipe(browsersync.stream());
}
/*
объединение
кроссбраузерность
минификация
удаление комментариев
*/
const styles = () =>{
    return src('dev/styles/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(autopref({
        overrideBrowserslist: ['last 2 versions'],
        cascade:false,
        grid:true,
    }))
    .pipe(cleancss({
        level:2,
    }))
    .pipe(sourcemaps.init())
    .pipe(dest(build.css))
}
/*
Минификация 
объединение
удаление комментариев
*/
const htmlminify = () =>{
    return src('dev/**/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
    }))
    .pipe(delcom())
    .pipe(dest(build.html))
}
/*
спрайты
*/
const svgsprites = () =>{
    return src('src/img/**/*.svg')
    .pipe(svgsprite({
        mode: {
            symbol:true
        }
    }))
    .pipe(dest(dev.img))
}
/*
объединение
использование новых стандартов
минификация
удаление комментариев
*/
const scripts = () =>{
    return src('dev/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(concat('script.js'))
    .pipe(delcom())
    .pipe(sourcemaps.init())
    .pipe(dest(build.js))
}
/*
сжатие картинок
перевод в webp
*/
const images = () =>{
    return src([
        "src/img/**/*.jpg",
        "src/img/**/*.png",
        "src/img/**/*.jpeg"
])
    .pipe(webp())
    .pipe(image())
    .pipe(dest(dev.img))
}
/*
да
*/
const bs = () =>{
    browsersync.init({
        server:{
            baseDir: 'dev'
        }
    });

    watch('dev/styles/**/*.scss', sasscompile)
    watch('dev/**/*.html').on('change', browsersync.reload); 
    watch('dev/js/**/*.js').on('change', browsersync.reload); 
}
/*
конвертация в woff2
*/
const fonts = () =>{
    return src('src/fonts/**/*.ttf')
    .pipe(woff2())
    .pipe(dest(dev.fonts))
}
/*
перенос
*/
const imagesbuild = () => {
    return src('dev/img/**/*.*')
    .pipe(dest(build.img))
}
const fontsbuild = () => {
    return src('dev/fonts/**/*.*')
    .pipe(dest(build.fonts))
}
exports.src = series(svgsprites, images, fonts) 

exports.dev = series(bs) 

exports.build = series(htmlminify, scripts, styles, imagesbuild, fontsbuild);
