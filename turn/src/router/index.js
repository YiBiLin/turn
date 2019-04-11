import Vue from 'vue'
import Router from 'vue-router'
import lottery from '../components/lottery.vue'
import home from '../page/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home ',
      component: home
    },
    {
      path: '/turn',
      name: 'turn ',
      component: lottery
    }
  ]
})
