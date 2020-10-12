/* eslint valid-jsdoc: "off" */

'use strict';
const os = require('os');
const path = require('path');

let localhost = '';
try {
  const network = os.networkInterfaces();
  localhost = network[Object.keys(network)[0]].filter((item) => item.family == 'IPv4')[0].address;
} catch (e) {
  localhost = '0.0.0.0';
}

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // serve配置
  config.cluster = {
    listen: {
      path: '',
      port: 8880,
      hostname: localhost
    }
  };

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  };

  // 本地请求跨域
  config.cors = {
    origin: `*`,
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };

  config.view = {
    root: path.join(appInfo.baseDir, '/app/view'),
    mapping: { '.ejs': 'ejs', '.html': 'ejs' },
    defaultViewEngine: 'ejs',
    cache: false
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};
