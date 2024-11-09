import { configFTP } from '../config/ftp.js';
import ftp from 'vinyl-ftp';
import util from 'gulp-util';

export const ftpDeploy = () => {
  configFTP.log = util.log;
  const ftpConnect = ftp.create(configFTP);

  return app.gulp
    .src(`${app.path.buildFolder}/**/*.*`, {})
    .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`));
};
