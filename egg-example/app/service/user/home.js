'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async index() {
    return 'service index';
  }

  async addUser(name,email){
    console.log(name,email);
    return `用户${name}的邮箱号为${email}`;
  }
}

module.exports = HomeService;
