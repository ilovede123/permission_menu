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
        sideMenu: [],
        crubms: []
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
        },
        SET_CRUBMS(state, payload) {
            state.crubms = payload
        }
    },
    actions: {
        async FETCH_MENULIST({ commit }) {
            let res = await getMenuList()
            let menuList = res.data.menuList;
            console.log(menuList)
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