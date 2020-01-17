
/**
 * 
 * @param {Array} AllRoutes 所有的路由
 * @param {Array} menuList 从后台获取下来的menulist
 */
const recursionRoute = (AllRoutes=[], menuList=[]) => {
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

export default recursionRoute
