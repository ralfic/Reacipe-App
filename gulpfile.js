'use strict';

import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';

global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path,
  gulp,
  plugins,
};

import { copy } from './gulp/tusks/copy.js';
import { reset } from './gulp/tusks/rest.js';
import { html } from './gulp/tusks/html.js';
import { server } from './gulp/tusks/server.js';
import { scss } from './gulp/tusks/scss.js';
import { js } from './gulp/tusks/js.js';
import { images } from './gulp/tusks/images.js';
// import { svgSprite } from './gulp/tusks/svgSprite.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tusks/fonts.js';
import { zip } from './gulp/tusks/zip.js';

function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

// export { svgSprite };
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTastks = gulp.series(
  fonts,
  gulp.parallel(copy, html, scss, images, js)
);

const dev = gulp.series(reset, mainTastks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTastks, server);
const deployZIP = gulp.series(reset, mainTastks, zip);
const deployFTP = gulp.series(reset, mainTastks, ftpDeploy);

export { dev, build, deployZIP };

gulp.task('default', dev);
