import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user: {
    //   name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
    //   userface: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userface
    // },
    routes: [],
    resUrlsByRoleIdList: [],
    isFullScreen: false,
    // 动态显示列
    selectColumn: [],
    cfg:{IS_CHECK_TICKET:"0"}
  },
  mutations: {
    initCachepage(state) {
      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage);
      }
    },
    initCfgGlobal(state,cfg){
      state.cfg = cfg;
    },
    initMenu(state, menus) {
      state.routes = menus;
    },
    getRoleIdByUrlsData(state, menus) {
      state.resUrlsByRoleIdList = menus;
    },
    login(state, user) {
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('ticket');
      state.routes = [];
    },
    roleInfo(state, role) {
      state.role = role;
    },
    handleFullScreen(state) {
      let main = document.getElementById('netPage');
      if (state.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
        
      }
    },
    changeFullScreenState(state) {
      state.isFullScreen = !state.isFullScreen;
    }
  },
  actions: {}
});