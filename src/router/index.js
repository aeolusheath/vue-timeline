import Vue from 'vue'
import Router from 'vue-router'
import TimeLine from '@/components/TimeLine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: TimeLine
    }
  ]
})
