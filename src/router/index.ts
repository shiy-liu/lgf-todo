import { createRouter, createWebHashHistory } from 'vue-router'
//引入组件
import Todo from '../view/Todo.vue'
import Error from '../Error.vue'
//配置路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path:'/',
      redirect:'/all'
    },
    {
      path:'/all',
      component:Todo,
    },
    {
      path:'/active',
      component:Todo,
    },
    {
      path:'/done',
      component:Todo,
    },
    {
      path: '/404',
      name: '404',
      component:Error
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})
//暴露路由
export default router;