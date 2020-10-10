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
}

module.exports = HomeController;
