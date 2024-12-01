import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import HomePage from '../components/HomePage.vue'
import User from '../components/user/User.vue'
import Admin from '../components/admin/Admin.vue'
import Category from '../components/category/Category.vue';
import Book from '../components/book/Book.vue';
import Borrow from '../components/borrow/Borrow.vue';


import Cookies from 'js-cookie'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect:'/homePage',
    children: [
      { path: '/homePage', component: HomePage },
      { path: '/user', component: User },
      { path: '/admin', component: Admin },
      { path: '/category', component: Category },
      { path: '/book', component: Book },
      { path: '/borrow', component: Borrow },
    ]
  }
]

const router = new VueRouter({
  routes
})


//挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const admin = Cookies.get('admin')
  if (!admin) return next('/login')
  next()
})

export default router
