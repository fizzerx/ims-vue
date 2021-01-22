<template>
  <div class="navMenu">

    <template v-for="navMenu in navMenus">
        <!-- 最后一级菜单 -->
      <el-menu-item v-if="!navMenu.childs&&navMenu.entity"
                    :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name" 
                   >
        <i :class="navMenu.entity.icon"></i>
        <span slot="title">{{navMenu.entity.alias}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="navMenu.childs&&navMenu.entity"
                  :key="navMenu.entity.id" :data="navMenu" :index="navMenu.entity.name">
        <template slot="title">
          <i :class="navMenu.entity.icon"></i>
          <span> {{navMenu.entity.alias}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </template>
    <div class="loginOut">
      <i class="icon iconfont icon-reny mright5"></i>
      <a href="javascript:void(0);">{{ username }}</a>
      <a href="javascript:void(0);" @click.stop="checkAdmin" :class="isShow == true ? 'shangsanjiao' : 'xiasanjiao'"></a>
      <ul class="user-nav" v-if="isShow">
          <li><a href="javascript:void(0);" @click="outLogin">退出登录</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    data() {
      return {
        username: '',
        isShow: false,
      }
    },
    mounted: function () {
      this.username = JSON.parse(window.localStorage.getItem("username") || '[]');
      // 如果登录名为空，返回到登录页面
      
      var _this = this
      document.addEventListener('click', function () {
        _this.isShow = false
      }, false)
    },
    methods: {
      outLogin () {
        var _this = this;
        // this.api.doUserLogout(params).then(function () {
          // _this.$store.commit('logout')
          // localStorage.setItem("username", JSON.stringify(''));
          // location.href = location.origin;
        // })
        window.opener=null
        window.open('','_self')
        window.close()
      },
      checkAdmin () {
        this.isShow = !this.isShow
      }
    }
  }
</script>

<style scoped>
*{
  outline:none;
}
</style>