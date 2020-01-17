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