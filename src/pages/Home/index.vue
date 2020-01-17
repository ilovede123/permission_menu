<template>
  <div class="home">
    <el-container>
      <!-- 侧边导航菜单栏 -->
      <el-aside width="200">
        <h1>LOGO</h1>
        <el-menu default-active="1-4-1"
                 class="el-menu-vertical-demo"
                 :collapse="iscollapse">
          <subMenu :sideMenu="sideMenu"></subMenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部内容区域 -->
        <el-header>
          <el-row type="flex"
                  class="row-bg"
                  justify="space-between">
            <el-col :span="6">
              <div class="feiji">
                <i class="el-icon-s-promotion"
                   @click="iscollapse=!iscollapse"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <p>千锋教育</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="userInfo">
                <span class="wel">欢迎你</span>
                <span class="nickname">{{$store.state.nickname}}</span>
                <span class="quit"
                      @click="quit">退出</span>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <!-- 面包屑 -->
        <div class="bread">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name:item.name}"
                                v-for="item in crubms"
                                :key="item.path">
              {{item.meta.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  import subMenu from "../../components/subMenu"
  export default {
    methods: {
      quit() {
        //1.跳转到登入页面
        //2.清除token
        //3.清除store中的sideMenu
        //4.刷新页面
        window.location.reload()
        localStorage.removeItem("qftoken")
        this.$router.push("/login")
        this.$store.commit("CLEAR_MENU")

      },
    },
    components: {
      subMenu
    },
    data() {
      return {
        iscollapse: false
      }
    },
    computed: {
      ...mapState(["sideMenu", "crubms"])
    }
  }
</script>
<style lang="scss" scoped>
  //面包屑
  .bread {
    margin: 20px;
  }
  //导航菜单
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    padding: 0 20px 20px 20px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  /* 顶部样式 */
  .userInfo {
    text-align: right;
    span {
      margin: 0 5px;
    }
  }
  .nickname {
    cursor: pointer;
    color: red;
    text-decoration: underline;
  }
  .quit {
    cursor: pointer;
    color: deepskyblue;
  }
  .feiji {
    font-size: 40px;
    text-align: left;
  }
  .feiji i {
    cursor: pointer;
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  //logo
  .el-aside h1 {
    line-height: 60px;
  }
</style>