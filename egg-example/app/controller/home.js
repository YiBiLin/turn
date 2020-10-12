'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, service } = this;
    const { ser } = ctx.query;
    if (ser) {
      ctx.body = await service.user.home.index();
    } else {
      ctx.body = 'hi, egg';
    }
  }
  
  async addUser() {
    const { ctx, service } = this;
    const { name, email} = ctx.request.body;
    // 
    //  参数判断
    //  ...
    //  
    const res = await service.user.home.addUser(name,email);
    ctx.body = res;
  }
}

module.exports = HomeController;
