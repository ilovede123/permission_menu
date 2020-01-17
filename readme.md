# 权限菜单

## 1.将所有的页面都配置好 包括path componet

由于各个账户的权限不同,所以权限菜单不一样,对应的页面也不一样,所以应该按照配置最高权限的页面配置来配置我们的路由

代码角度步骤应当是:

 	1.搭建页面所有菜单的路由

​	 2.根据后台返回的数据生成所需要的路由

​	 3.通过addRoutes方法,动态添加到路由

### 1.1项目结构src

```
│  App.vue
│  main.js
│  
├─api
│      index.js
│      
├─assets
│      el-reset.css
│      global.css
│      
├─components
│      submenu.vue
│      
├─pages
│  │  Login.vue
│  │  page404.vue
│  │  
│  └─Home
│      │  index.vue
│      │  
│      ├─Attendance
│      │      index.vue
│      │      
│      ├─Mine
│      │      index.vue
│      │      
│      ├─Statistics
│      │      index.vue
│      │      
│      ├─Student
│      │      Detail.vue
│      │      Dormitory.vue
│      │      index.vue
│      │      Product.vue
│      │      
│      ├─Users
│      │      index.vue
│      │      
│      └─Welcome
│              index.vue
│              
├─router
│      allRoutes.js
│      index.js
│      
└─store
        index.js
        
```

### 1.2定义全部的路由和组件 

这些路由都是后期通过和后端菜单数据对比,选择需要的;配置完当前的文件必须确保配置是生效的

调试过程: 

1.在router/index.js  引入 allRoutes 

2.由于allRoutes就是一个路由配置项,所以直接加到 home路由配置的children属性上

3.访问配置的路由,看是否生效

```
const Welcome = () => import("../pages/Home/Welcome")
const Student = () => import("../pages/Home/Student")
const Detail = () => import("../pages/Home/Student/Detail")
const Product = () => import("../pages/Home/Student/Product")
const Dormitory = () => import("../pages/Home/Student/Dormitory")
const Mine = () => import("../pages/Home/Mine")
const Statistics = () => import("../pages/Home/Statistics")
const Attendance = () => import("../pages/Home/Attendance")
const Users = () => import("../pages/Home/Users")
const allRoutes = [
    {
        path: "welcome",
        component: Welcome,
        name: "welcome",
        meta: {
            name: "管理首页"
        }
    },
    {
        path: "student",
        component: Student,
        name: "student_mg",
        meta: {
            name: "学员管理"
        },
        children: [
            {
                path: "product",
                component: Product,
                name: "student_product",
                meta: {
                    name: "学员项目管理"
                }
            },
            {
                path: "detail",
                component: Detail,
                name: "student_detail",
                meta: {
                    name: "学员资料"
                }
            },
            {
                path: "dormitory",
                component: Dormitory,
                name: "student_dormitory",
                meta: {
                    name: "学员宿舍"
                }
            }
        ]
    },
    {
        path: "attendance",
        component: Attendance,
        name: "attendance-manager",
        meta: {
            name: "考勤管理"
        }
    },
    {
        path: "users",
        component: Users,
        name: "users-manager",
        meta: {
            name: "用户管理"
        }
    },
    {
        path: "statistics",
        component: Statistics,
        name: "statistics",
        meta: {
            name: "数据统计"
        }
    },
    {
        path: "mine",
        component: Mine,
        name: "mine",
        meta: {
            name: "我的中心"
        }
    }
]

export default allRoutes
```

### 1.3 在router=>index.js中 定义需要被动态添加的路由

```
import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../pages/Home"
import Login from "../pages/Login"
import page404 from "../pages/page404.vue"
import AllRoutes from "./allRoutes"
Vue.use(VueRouter)

const routes = [
    {
        path: "/login",
        component: Login
    }
]

export const DynamicRoutes = [
    {
        path: "/",
        component: Home,
        redirect: "/welcome",
        children: []
    },
    {
        path: "*",
        component: page404
    }
]

export default new VueRouter({
    routes
})
```



## 2.设置递归函数

```

/**
 * 
 * @param {Array} AllRoutes 所有的路由
 * @param {Array} menuList 从后台获取下来的menulist
 */
const recursionRoute = (AllRoutes, menuList) => {
    const usersRoute = [];
    AllRoutes.forEach(item => {
        menuList.forEach(v => {
            if (item.meta.name === v.name) {
                if (v.children && v.children.length > 0) {
                    item.children = recursionRoute(item.children, v.children)
                }
                usersRoute.push(item)
            }
        })
    })
    return usersRoute;
}

console.log(recursionRoute(AllRoutes, userlist))
```

## 3.定义store 请求服务器获取菜单列表 并且递归后保存在vuex中在store中定义状态 sidMenu

```
import Vue from "vue"
import Vuex from "vuex"
import AllRoutes from "../router/allRoutes"
import { getMenuList } from "@/api"
import router, { DynamicRoutes } from "../router"
import recursionRoute from "../utils/recursion"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        nickname: localStorage.getItem("nickname") || "",
        sideMenu: []
    },
    actions: {},
    mutations: {
        SET_NICKNAME(state, payload) {
            state.nickname = payload
        },
        SET_MENU(state, payload) {
            state.sideMenu = payload
        },
        CLEAR_MENU(state) {
            state.sideMenu = []
        }
    },
    actions: {
        async FETCH_MENULIST({ commit }) {
            let res = await getMenuList()
            let menuList = res.data.menuList;
            //递归获取真实路由配置
            let userRoutes = recursionRoute(AllRoutes, menuList);

            //获取主体路由容器 因为所有的路由都是/的子路由
            console.log(DynamicRoutes)
            let mainContainer = DynamicRoutes.find(v => v.path === "/");
            mainContainer.children.push(...userRoutes)

            commit("SET_MENU", mainContainer.children)

            router.addRoutes(DynamicRoutes)

        }
    }
})
```

## 4.抽离subMenu

```
<template>
  <div>
    <div v-for="item in sideMenu"
         :key="item.name">
      <el-submenu v-if="item.children&&item.children.length>0"
                  :index="item.path">
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.name}}</span>
        </template>
        <el-menu-item-group>
          <nav-menu :sideMenu="item.children"></nav-menu>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else
                    @click="jumpRoute(item.name)"
                    :index="item.path">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{item.meta.name}}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: "nav-menu",
    props: {
      sideMenu: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      jumpRoute(name) {
        this.$router.push({ name })
      }
    }
  }
</script>
<style>
</style>
```

并且在全局样式中键入以下样式

```
body, ul, p, li, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
}

.el-menu--collapse .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}

.el-menu--collapse .el-menu-item .el-submenu__icon-arrow, .el-menu--collapse .el-submenu .el-submenu__title .el-submenu__icon-arrow {
    display: none;
}
.el-menu-item-group .el-menu-item{
   padding:0 0 0 30px;

}

.el-menu-item-group .el-menu-item-group__title{
    padding:0
}
```

## 5.退出登入逻辑处理

由于只有addRoues没有deleteRoutes,所以在退出登入时清空store中的sideMenu 并且要刷新页面

```
  methods: {
      quit() {
        //1.跳转到登入页面
        //2.清除token
        //3.清除store中的sideMenu
        //4.刷新页面
         localStorage.removeItem("qftoken")
        this.$router.push("/login")
        this.$store.commit("CLEAR_MENU")
        window.location.reload()
      }
```

## 6.beforeEach全局前置钩子处理

```
router.beforeEach(function (to, from, next) {
  //判断localstorage有没有token 如果有放行 
  //如果没有 判断用户是否访问的是login 如果是=>放行 如果不是=>强行跳转login
  let token = localStorage.getItem("qftoken") || ""
  if (token) {
    if (!store.state.sideMenu.length) { //如果state中的sideMenu长度为0 说明没有 需要重新获取
      //如果没有,那么开始获取
      store.dispatch("FETCH_MENULIST")
        .then(() => {
          console.log(to)
          next({ path: to.path })//这里要注意, next里面要传参数即要进入的页面的路由信息，因为next传参数后，当前要进入的路由会被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保addRoutes生效了。
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
```

## 7.处理面包屑

在vuex中定义mutation和state用于操作crubms

```
  	state: {
        crubms: []
    }
     mutations: {
        SET_CRUBMS(state, payload) {
            state.crubms = payload
        }
    },
```

在main.js中 使用后置钩子获取to.matched

```
router.afterEach((to, from, next) => {
    var routerList = to.matched
    store.commit('setCrumbList', routerList)
    store.commit('permission/SET_CURRENT_MENU', to.name)
})
```
从store中将crubms获取下来 循环创建面包屑
```
 <div class="bread">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name:item.name}"
                                v-for="item in crubms"
                                :key="item.path">
              {{item.meta.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
```



