import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store"
Vue.config.productionTip = false
Vue.use(ElementUI);
import FastClick from 'fastclick'
FastClick.attach(document.body);//解决移动端300ms延迟问题
import "./assets/global.css"
import "./assets/el-reset.css"
//路由全局前置钩子(路由守卫)
console.log("main.js")
router.beforeEach(function (to, from, next) {
  //判断localstorage有没有token 如果有放行 
  //如果没有 判断用户是否访问的是login 如果是=>放行 如果不是=>强行跳转login
  let token = localStorage.getItem("qftoken") || ""
  if (token) {
    if (!store.state.sideMenu.length) {
      //如果没有,那么开始获取
      store.dispatch("FETCH_MENULIST")
        .then(() => {
          console.log(to)
          next({ path: to.path })  //这里要注意, next里面要传参数即要进入的页面的路由信息，因为next传参数后，当前要进入的路由会被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保addRoutes生效了。
        })
    } else {
      next()
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  //没有next
  //to.matched所有被匹配到的路由选项
  store.commit("SET_CRUBMS", to.matched)
  console.log(to)
  console.log(router)
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
