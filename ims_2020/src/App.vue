<template>
  <div id="app">
    <!-- v-if="isTrueLogin" -->
    <div v-if="!(urlPath ==='/') && !(urlPath ==='/login')" style="position:fixed;width:100%;top:0;z-index: 9999;">
      <el-menu
        mode="horizontal"
        background-color="#000"
        text-color="#fff"
        active-text-color="#00b3ff"
        :default-active="activeIndex"
        router
        @select="handleSelect"
      >
        <img
          class="logoImg"
          src="./assets/images/logo_winglong.png"
        />
        <NavMenu :navMenus="menuData" :user-name="username"></NavMenu>
      </el-menu>
    </div>

    <user-login
      @successLogin="successLogin"
      v-else
    ></user-login>
    <router-view v-if="!(urlPath ==='/') && !(urlPath ==='/login')" />
  </div>
</template>

<script>
import NavMenu from "./components/common/NavMenu.vue";
import userLogin from "./pages/login/Login.vue";
export default {
  created() {
    this.activeIndex = this.$router.currentRoute.name;
    var username = JSON.parse(window.localStorage.getItem("username") || '[]');
  },
  name: 'App',
  components: {
    NavMenu: NavMenu,
    userLogin,
  },
  data() {
    return {
      username: '',
      isTrueLogin: false,
      urlPath: '/',
      activeIndex: 'CustomerSelection',
      menuData: [
        {
          //一级
          entity: {
            id: 0,
            name: "CustomerSelection",
            // icon: "el-icon-message",
            alias: "客群筛选"
          }
        },
        {
          entity: {
            id: 1,
            name: "CustomerManage",
            // icon: "el-icon-message",
            alias: "客群管理"
          }
        },
        {
          entity: {
            id: 2,
            name: "CustomerAnalysis",
            // icon: "el-icon-message",
            alias: "客群分析"
          }
        },
        {
          entity: {
            id: 3,
            name: "testtest",
            // icon: "el-icon-message",
            alias: "测试"
          }
        },
        // {
        //   //一级
        //   entity: {
        //     id: 1,
        //     name: "systemManage",
        //     icon: "el-icon-message",
        //     alias: "两级菜单"
        //   },
        //   //二级
        //   childs: [
        //     {
        //       entity: {
        //         id: 3,
        //         name: "authManage",
        //         icon: "el-icon-loading",
        //         alias: "权限管理",
        //         value: { path: "/hello" }
        //       }
        //     },
        //     {
        //       entity: {
        //         id: 4,
        //         name: "roleManage",
        //         icon: "el-icon-bell",
        //         alias: "角色管理",
        //         value: "/system/role"
        //       }
        //     },
        //     {
        //       entity: {
        //         id: 2,
        //         name: "menuManage",
        //         icon: "el-icon-edit",
        //         alias: "菜单管理",
        //         value: "/system/menu"
        //       }
        //     },
        //     {
        //       entity: {
        //         id: 5,
        //         name: "groupManage",
        //         icon: "el-icon-mobile-phone\r\n",
        //         alias: "分组管理",
        //         value: "/system/group"
        //       }
        //     }
        //   ]
        // },
        // {
        //   //一级
        //   entity: {
        //     id: 6,
        //     name: "userManage",
        //     icon: "el-icon-news",
        //     alias: "三级菜单"
        //   },
        //   //二级
        //   childs: [
        //     {
        //       entity: {
        //         id: 7,
        //         name: "accountManage",
        //         icon: "el-icon-phone-outline\r\n",
        //         alias: "帐号管理",
        //         value: ""
        //       },
        //       //三级
        //       childs: [
        //         {
        //           entity: {
        //             id: 14,
        //             name: "emailManage",
        //             icon: "el-icon-sold-out\r\n",
        //             alias: "邮箱管理",
        //             value: "/content/email"
        //           }
        //         },
        //         {
        //           entity: {
        //             id: 13,
        //             name: "passManage",
        //             icon: "el-icon-service\r\n",
        //             alias: "密码管理",
        //             value: "/content/pass"
        //           }
        //         }
        //       ]
        //     },
        //     {
        //       entity: {
        //         id: 8,
        //         name: "integralManage",
        //         icon: "el-icon-picture",
        //         alias: "积分管理",

        //         value: "/user/integral"
        //       }
        //     }
        //   ]
        // },
        // {
        //   //一级
        //   entity: {
        //     id: 40,

        //     name: "contentManage",
        //     icon: "el-icon-rank",
        //     alias: "四级菜单"
        //   },
        //   //er级
        //   childs: [
        //     {
        //       entity: {
        //         id: 41,
        //         name: "classifyManage2",
        //         icon: "el-icon-printer",
        //         alias: "分类管理"
        //       },
        //       //三级
        //       childs: [
        //         {
        //           entity: {
        //             id: 42,
        //             name: "classifyManage3",
        //             icon: "el-icon-printer",
        //             alias: "分类管理"
        //           },
        //           //四级
        //           childs: [
        //             {
        //               entity: {
        //                 id: 43,
        //                 name: "classifyManage4",
        //                 icon: "el-icon-printer",
        //                 alias: "分类管理",
        //                 value: "/content/classify"
        //               }
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // }
      ]
    };
  },
  watch: {
    $route(to, from) {
      this.activeIndex = this.$router.currentRoute.name;
      this.urlPath = to.path;
    }
  },
  computed: {
    navtoggleName () {
      console.log(this.$store.state)
      return this.$store.state.navtoggleName
    },
  },
  mounted() {
    this.activeIndex = this.$router.currentRoute.name;
    this.urlPath = this.$route.path;
    this.username = JSON.parse(window.localStorage.getItem("username"));
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
    },
    successLogin(user) {
      console.log("CCCC"+window.localStorage.getItem("username"))
      this.username = JSON.parse(window.localStorage.getItem("username"));
    }
  },
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  /* overflow: hidden; */
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.el-menu.el-menu--horizontal {
  width: 100%;
}
/* 水平样式 */
.el-menu--horizontal > div > .el-submenu {
  float: left;
}
/* 一级菜单的样式 */
.el-menu--horizontal > div > .el-menu-item {
  float: left;
  height: 60px;
  line-height: 60px;
  margin: 0;
  border-bottom: 2px solid transparent;
  color: #909399;
  font-size: 16px;
}
/* 解决下图1 下拉三角图标 */
.el-menu--horizontal > div > .el-submenu .el-submenu__icon-arrow {
  position: static;
  vertical-align: middle;
  margin-left: 8px;
  margin-top: -3px;
}
/* 解决下图2 无下拉菜单时 不对齐问题 */
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid transparent;
  color: #909399;
}
.logoImg {
  float: left;
  margin-right: 100px;
  height: 60px;
}
.loginTit {
  display: inline-block;
  float: right;
  padding-right: 60px;
  line-height: 60px;
}
.loginTit span {
  font-size: 16px;
  color: #fff;
}
</style>
