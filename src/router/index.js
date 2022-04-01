import Vue from 'vue'
import VueRouter from 'vue-router'
import Base from "../layout/Base";
import Login from '../views/Login.vue'
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Base,
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  let isAuthenticated = false;
  let userData = localStorage.getItem('bemo-user')
  if (userData && JSON.parse(userData)['token'] != null)
    isAuthenticated = true;
  else
    isAuthenticated = false;

  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }

  if (to.name == 'Login' && isAuthenticated) {
    next({ name: 'Base' })
  } else {
    next()
  }
})

export default router
