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
        redirect: "welcome",
        meta: {
            name: "主页"
        },
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