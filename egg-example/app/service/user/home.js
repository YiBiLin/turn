'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async index() {
    return 'service index';
  }
}

module.exports = HomeService;
