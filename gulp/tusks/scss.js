import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';
import webpCss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import gulpGroupCssMediaQueries from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp
    .src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(app.plugins.if(app.isBuild, gulpGroupCssMediaQueries()))
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpCss({
          webpClass: '.webp',
          noWebpClass: '.no-webp',
        })
      )
    )
    .pipe(app.plugins.if(app.isBuild, autoprefixer('last 3 versions')))
    .pipe(app.plugins.if(app.isBuild, cleanCss()))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream());
};
