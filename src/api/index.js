import axios from "axios"
import router from "../router"
axios.defaults.withCredentials = true;//默认开启携带认证给后端
//拦截响应
axios.interceptors.response.use(function (config) {
    // console.log("1", config)
    //如果不是登入请求 拦截响应
    // debugger
    console.log(config, "=====")
    if (config.config.url !== "/api/users/login") {
        //清空localstorage里面的qftoken
        if (config.data.code === "10022"||config.data.msg==="校验失败") {
            // console.log("2", config)
            // console.log(router)
            console.log('2222222222')
            localStorage.removeItem('qftoken')
            let url = router.mode === "hash" ? "#/login" : "/login"    
            location.href = url
        }
    }
    return config
})
//使用拦截器 拦截请求
axios.interceptors.request.use(function (config) {
    // console.log(config);
    //登入请求不需要拦截
    if (config.url == "/api/users/login") {
        return config //放行
    } else {
        let token = localStorage.getItem("qftoken")
        config.headers['authorization'] = token
        return config
    }
})



//登入
export const login = (username, password) => {
    return axios({
        url: "/api/users/login",
        method: 'post',
        timeout: 10000,
        data: {
            username,
            password
        }
    })
}

//获取登入日志

export const getLoginLog = () => axios({
    url: "/api/getloginlog",
    timeout: 10000
})

//获取学员列表
export const getStulist = (param = {}) => {
    return axios({
        url: "/api/students/getstulist",
        param,
    })
}

//获取用户菜单

export const getMenuList = () => axios({
    url: "/api/permission/getMenuList"
})