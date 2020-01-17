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
            icon: "el-icon-house",
            name: "管理首页"
        }
    },
    {
        path: "student",
        component: Student,
        name: "student_mg",
        meta: {
            icon: "el-icon-menu",
            name: "学员管理"
        },
        children: [
            {
                path: "product",
                component: Product,
                name: "student_product",
                meta: {
                    icon: "el-icon-s-platform",
                    name: "学员项目管理"
                }
            },
            {
                path: "detail",
                component: Detail,
                name: "student_detail",
                meta: {
                    icon: "el-icon-notebook-2",
                    name: "学员资料"
                }
            },
            {
                path: "dormitory",
                component: Dormitory,
                name: "student_dormitory",
                meta: {
                    icon: "el-icon-office-building",
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
            icon: "el-icon-tickets",
            name: "考勤管理"
        }
    },
    {
        path: "users",
        component: Users,
        name: "users-manager",
        meta: {
            icon: "el-icon-user",
            name: "用户管理"
        }
    },
    {
        path: "statistics",
        component: Statistics,
        name: "statistics",
        meta: {
            icon: "el-icon-s-data",
            name: "数据统计"
        }
    },
    {
        path: "mine",
        component: Mine,
        name: "mine",
        meta: {
            icon: "el-icon-place",
            name: "我的中心"
        }
    }
]

export default allRoutes