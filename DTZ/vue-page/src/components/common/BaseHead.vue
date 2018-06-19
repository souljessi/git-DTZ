<template>
  <div :style="headerStyle" class="base-header">

    <div class="header-logo">
      <img src="../../assets/images/logo.png">
    </div>
    <div @click="showMenu" class="header-menu-cll" title="折叠左侧菜单">
      <base-icon :class="['header-menu-default',isCollapse?'header-change':'']" icon="menu" />
    </div>
    <!-- 消息推送 -->
    <div class="header-notic" v-clickoutside="handleClose">
      <el-tooltip class="item" effect="dark" content="消息" placement="bottom">
        <div class="header-notic-main" @click="noticClick">
          <base-icon v-if="noticData.length==0" icon="tongzhi" :class="datanew?'music':''" />
          <el-badge v-else :value="noticData.length">
            <base-icon icon="tongzhi" :class="datanew?'music':''" />
          </el-badge>
        </div>
      </el-tooltip>

      <transition name="animationsacle">
        <div class="header-notic-content" v-show="noticShow">

          <div class="header-notic-content-title">
            最新消息
          </div>
          <div style="height: 200px; overflow: auto;">
            <div class="header-notic-content-content" v-show="noticData.length>0" @click="readNotic(item)" v-for="(item,index) in noticData" :key="index">
              <!-- <div class="header-notic-img">
                <img :src="item.pic_path">
              </div> -->
              <div class="header-notic-text">
                <div style="overflow:hidden">
                  <!-- <div style="float:left;color:#3a8ee6">
                    {{item.username}}
                  </div> -->
                  <div style="float:left">{{item.date}}</div>
                </div>
                <div style="margin-top:5px;width:180px;">
                  <base-text-overflow :text="item.title" />
                </div>
              </div>
            </div>
            <div class="header-notic-content-no" v-show="noticData.length==0">
              没有新消息
            </div>
          </div>
          <!-- <div class="header-notci-conetnt-footer">
            <base-icon icon='menu'/>
            <span>全部消息</span>
          </div> -->
        </div>
      </transition>

    </div>
    <!-- 皮肤选择 -->
    <div class="header-theme" v-clickoutside="handleNavClose">
      <el-tooltip class="item" effect="dark" content="皮肤选择" placement="bottom">
        <span @click='themeChange'>
          <base-icon icon='zhuti' />
        </span>
      </el-tooltip>

      <transition name="bling-in">
        <div v-show="themeShow" class="main">
          <!-- <div class="arrow-up">
          </div> -->
          <div class="contentTheme">
            <div class="themeTitle">
              <h3>
                <i class="el-icon-setting">皮肤选择</i>
              </h3>
            </div>
            <div style="font-size: 12px;padding: 10px"> 你可以从这里选择喜欢的皮肤</div>
            <!-- <div style="text-align: center;padding: 10px;background:rgba(190, 157, 151, 0.17)">皮肤选择</div> -->
            <div style="color: rgba(255, 255, 255, 0.85)">
              <span class="colorChoose theme-lis" v-for="(item,index) in themeList" :style="setThemeBg(item.value)" :title="item.label" :key="index" @click="themeHandleCommand(item.value)">{{item.label}}</span>
              <!-- <span class="colorChoose" style="display:block;background-color: #ff4949;text-align: center;padding: 10px;cursor: pointer" @click="themeHandleCommand('red')">红色</span> -->
              <!-- <span class="colorChoose" style="display:block;background-color: #408080;text-align: center;padding: 10px;cursor: pointer" @click="themeHandleCommand('purple')">墨绿</span> -->
            </div>
          </div>

        </div>
      </transition>
    </div>
    <div class="header-full">
      <div @click='toggleFullScreen'>
        <el-tooltip class="item" effect="dark" :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
          <base-icon :icon='isFullScreen?"exitfullscreen":"fullscreen"' />
        </el-tooltip>
      </div>
    </div>
    <!-- 用户头像 -->
    <div class="header-set">
      <!-- <base-icon @click.native="logout" class="header-set-lout" icon="zuxiao"/> -->
      <div>
        <el-dropdown @command="handleCommand" trigger='click'>
          <div class="header-user-img" :title="userImg.realname">
            <img :src="setImg(userImg.pic_path)" width="50" height="50">
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command='0' >
              {{userImg.realname}}
            </el-dropdown-item> -->
            <el-dropdown-item command='3' :disabled="isVideo">
              <span>
                <base-icon icon="grzl" />
              </span>
              <span style="margin-left:5px;">个人资料</span>
            </el-dropdown-item>
            <el-dropdown-item command='2' :disabled="isVideo">
              <span>
                <base-icon icon="xgmm" />
              </span>
              <span style="margin-left:5px;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item command='1'>
              <span>
                <base-icon icon="zuxiao" />
              </span>
              <span style="margin-left:5px;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 菜单渲染 -->
    <div class="header-menu">
      <el-menu :default-active="defaultIndex" @select="selectIndex" class="menu-demo" mode="horizontal" :backgroundColor="headBg" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item v-for="(item,index) in menuData" class="header-menu-item" :key="item.id" :index="setIndex(index)">
          <!-- <base-icon icon="map" /> -->
          {{item.menu_name}}
        </el-menu-item>
      </el-menu>

    </div>
    <base-user ref="baseUser"></base-user>

  </div>
</template>

<script>
import { transData, delAllCookie, toggleClass } from 'assets/js/commonManage';
import BaseTextOverflow from 'common/BaseTextOverflow';
import BaseUser from './BaseUser.vue';
import { mapState, mapMutations } from 'vuex';
import screenfull from 'screenfull';
export default {
  components: {
    BaseTextOverflow,
    BaseUser
  },
  data() {
    return {
      isVideo: false,
      isFullScreen: false,
      datanew: false,
      noticShow: false,
      defaultIndex: '',
      // headBg: "#0e0e10",
      userSrc: require('assets/images/default.jpg'),
      menuMap: [],
      menuData: [],
      transData: [],
      noticData: [], //消息推送
      testmenu: 123,
      themeShow: false,
      themeList: [
        { label: '默认', value: '' },
        { label: '肤色1', value: '5cbcc7' },
        { label: '肤色2', value: '53ce94' },
        { label: '肤色3', value: '332f48' },
        { label: '肤色4', value: 'ce3e41' }
      ]
    };
  },
  mounted() {
    console.log(this.$route);
    this.menuMap = JSON.parse(this.$getStore('gMenuList')).filter(item => {
      return item.is_show === 1;
    });
    let list = this.menuMap.filter(item => {
      return item.menu_level === 0;
    });
    this.setSort(list);
    this.menuData = list;
    this.transData = transData(this.menuMap, 'id', 'parent_id', 'children');
    this.setMenu();
    let notic = JSON.parse(this.$getStore('notifyData'));
    if (notic != null) {
      this.noticData = notic; //获取缓存中的消息推送
    }
    const vm = this;
    //处理全屏状态下ESC按钮操作
    window.onresize = function() {
      if (!vm.checkFull()) {
        vm.$log('ESC.....');
        vm.isFullScreen = false;
      }
    };

    screenfull.on('change', this.fullscreenchange);
  },
  methods: {
    fullscreenchange() {
      this.$log('全屏：', screenfull.isFullscreen);
      this.isFullScreen = screenfull.isFullscreen;
    },
    //处理全屏状态下ESC按钮操作
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;

      //to fix : false || undefined == undefined
      if (isFull === undefined) isFull = false;
      return isFull;
    },
    toggleFullScreen() {
      if (!screenfull.enabled) {
        this.$message({
          message: '您的浏览器无法工作！',
          type: 'warning'
        });
        return false;
      } else {
      }
      screenfull.toggle();

      // if(this.isFullScreen) this.$router.go(0)
    },
    setMenu(index = JSON.parse(this.$getStore('horIndex'))) {
      // console.log(this.transData);
      let defalutIndex = index;
      if (defalutIndex != null) {
        this.defaultIndex = defalutIndex.toString();
        let verlist = this.transData.filter(item => {
          return item.id === this.menuData[defalutIndex].id;
        });
        let newData = [];
        if (verlist[0].children != undefined) {
          let ver1 = verlist[0].children.filter(item => {
            return item.is_button == 0;
          });
          if (ver1.length > 0) {
            newData = ver1;
          }
        }
        this.$setStore('horIndex', index); // 保存横向导航选择菜单项

        this.$store.dispatch('setVerMenuMap', newData);
        // console.log(this.transData);
        //  this.$setStore("verMap", verlist); //保存选中横向菜单后子菜单信息
      }
    },
    setThemeBg(value) {
      let str = JSON.parse(JSON.stringify(value));
      if (str == '') str = '0e0e10';
      return {
        backgroundColor: `#${str}`
      };
    },
    navChange() {},
    themeHandleCommand(value) {
      // console.log(value);
      if (value == '') {
        document.body.className = '';
      } else {
        toggleClass(document.body, `custom-${value}`);
      }
      this.setHeaderBg(value);
    },
    setHeaderBg(value) {
      let va = JSON.parse(JSON.stringify(value));
      let str = '#0e0e10';
      if (value !== '') str = `#${va}`;
      // this.headBg = str;
      this.$store.dispatch('changeTheme', str);
    },
    themeChange() {
      this.themeShow = this.themeShow ? false : true;
    },
    handleClose() {
      // console.log(22222);
      this.noticShow = false;
    },
    handleNavClose() {
      this.themeShow = false;
    },

    /**
     * 设置推送消息以阅读
     */
    async readNotic(data) {
      // console.log(data);
      this.noticData = this.noticData.filter(item => {
        return item.id != data.id;
      });
      let parentIds = [];
      let val = 0;
      this.menuMap.forEach(item => {
        if (item.menu_url == data.menuUrl) {
          parentIds = item.parent_ids.split(',');
        }
        // return item.menu_url=== data.menuUrl
      });

      // console.log(111, parentIds);
      this.$log(111, parentIds);
      this.menuData.forEach((item, index) => {
        if (item.menu_url == data.menuUrl) {
          val = index;
        }
        for (let item2 of parentIds) {
          this.$log(333, item.id, item2);

          // console.log(item.id, item2);
          if (item.id == item2) {
            this.$log('index', index);
            val = index;
          }
        }
      });
      this.$log('val', val);
      this.setMenu(val);
      this.handleClose();
      this.$router.push({
        path: data.menuUrl,
        query: {
          id: data.id
        }
      });

      this.$setStore('verIndex', data.menuUrl); //保存横向导航选择菜单项
      this.$store.dispatch('setVerDefaultIndex', data.menuUrl);
      // const Res = await this.$http.post(
      //   "/oa/OaNotifyController/updateNotifyRecord",
      //   { id: data.id }
      // );
      // console.log(Res);
      // if (Res.data.success) {
      //   this.noticData = this.noticData.filter(item => {
      //     return item.id != data.id;
      //   });

      //   let menuId = this.menuMap.map(item => {
      //     if (item.menu_url == data.menuUrl) {
      //       return item.parent_id;
      //     }
      //   });

      //   console.log(this.noticData);
      // }
    },
    /**
     * 显示消息推送列表
     */
    noticClick() {
      this.noticShow = this.noticShow ? false : true;
    },
    setImg(img) {
      let newImg = this.userSrc;
      if (img) {
        newImg =
          'http://' + this.$webconfig.serverIp + '/' + img + '.100x100.png';
      }
      return newImg;
    },
    handleCommand(command) {
      let type = parseInt(command);
      switch (type) {
        case 1: //退出登录
          this.logout();
          break;
        case 2: //修改密码
          this.$refs.baseUser.checkPassWord();
          break;
        case 3: //个人资料
          this.$refs.baseUser.handleInfo();
          break;

        default:
          break;
      }
    },
    /**
     * 注销登录
     */
    async logout() {
      window.localStorage.clear();
      delAllCookie();
      await this.$http.post('/sys/LoginController/logout');
      // this.$router.push("/Login");
      location.reload(); // 为了重新实例化vue-router对象 避免bug

      // this.$store.dispatch("restVuexStore");
    },
    /**
     * 设置菜单折叠状态
     */
    showMenu() {
      this.$store.dispatch('setIsCollapse');
    },
    /**
     * 排序
     */
    setSort(list) {
      list.sort(function(a, b) {
        return a.menu_order - b.menu_order;
      });
    },
    selectIndex(index, indexPath) {
      // console.log(index, indexPath);
      let verlist = this.transData.filter(item => {
        return item.id === this.menuData[index].id;
      });
      // console.log("object", verlist);
      let newData = [];
      if (verlist[0].children != undefined) {
        let ver1 = verlist[0].children.filter(item => {
          return item.is_button == 0;
        });
        if (ver1.length > 0) {
          newData = ver1;
          console.log('--------------');
          console.log(newData);
          console.log('--------------');

          console.log(111, newData[0].children);
          let onChildren = newData.filter(item => {
            return item.is_show == 1 && item.is_button == 0;
          });
          if (onChildren.length > 0 && onChildren[0].children) {
            console.log(333);
            let newChildren = onChildren[0].children.filter(item => {
              return item.is_show == 1 && item.is_button == 0;
            });
            console.log(newChildren);
            if (newChildren.length > 0) {
              console.log(newChildren);
              this.$setStore('verIndex', newChildren[0].menu_url); // 保存横向导航选择菜单项
              this.$router.push(newChildren[0].menu_url);
            } else {
              this.$setStore('verIndex', onChildren[0].menu_url); // 保存横向导航选择菜单项
              this.$router.push(onChildren[0].menu_url);
            }
          } else {
            console.log(222);
            this.$setStore('verIndex', onChildren[0].menu_url); // 保存横向导航选择菜单项

            this.$router.push(onChildren[0].menu_url);
          }
        } else {
          this.$setStore('verIndex', verlist[0].menu_url); // 保存横向导航选择菜单项

          this.$router.push(verlist[0].menu_url);
        }
      } else {
        this.$setStore('verIndex', verlist[0].menu_url); // 保存横向导航选择菜单项

        this.$router.push(verlist[0].menu_url);
      }

      this.$store.dispatch('setVerMenuMap', newData);
      this.$setStore('horIndex', index); // 保存横向导航选择菜单项      // // this.$setStore("verMap", list); //保存选中横向菜单后子菜单信息
      // if (verlist[0].children === undefined) {
      //   this.$router.push(verlist[0].menu_url);
      // }
      // this.$store.dispatch("setVerMenuMap", list);
    },
    /**
     * 设置激活状态
     */
    setIndex(index) {
      return index.toString();
    },
    async getNoticUserInfo(data) {
      const Res = await this.$http.get('/sys/UserController/getUserInfoById', {
        params: {
          id: data.create_by
        }
      });
      // console.log(Res);
      if (Res.data.success) {
        let newData = Res.data.result;
        data.username = newData.realname;
        let img = this.userSrc;
        // console.log("newda", newData);
        if (newData.pic_path != null && newData.pic_path != '') {
          data.pic_path = `http://${this.$webconfig.serverIp}/${
            newData.pic_path
          }.100x100.png`;
        } else {
          data.pic_path = img;
        }
        // console.log(data);
        this.noticData.push(data);

        this.setNotcinShow();
      }
    },
    setNotcinShow() {
      let audio = new Audio('../../../static/msg/msg.mp3');
      audio.play();
      this.datanew = true;
      setTimeout(() => {
        this.datanew = false;
      }, 1000);
    }
  },
  computed: {
    headBg() {
      return this.$store.getters.getTheme;
    },

    isCollapse() {
      return this.$store.getters.getisCollapse;
    },
    userImg() {
      const userData = JSON.parse(this.$getStore('userData'));
      return userData;
    },
    notic() {
      return this.$store.getters.getSocketMsgBox;
    },
    headerStyle() {
      return {
        backgroundColor: this.headBg
      };
    }
  },
  watch: {
    notic(valData) {
      console.log('消息推送：', valData);
      let val = valData;
      if (Array.isArray(valData)) {
        val = valData[0];
      }
      let data = Object.assign({}, val);
      data.create_by = data.sendUser;
      data.menuUrl = data.menuUrl;
      data.title = data.title;
      data.id = data.result.id;
      data.date = data.sendDate;
      console.log(data);

      const str = `/${data.menuUrl}`;
      if (str != this.$route.path) this.getNoticUserInfo(data);

      // }
      // }
    },
    noticData(val) {
      this.$setStore('notifyData', val);
    },
    $route() {
      if (this.$route.path === '/video') {
        this.isVideo = true;
      } else {
        this.isVideo = false;
      }
    }
  }
};
</script>


<style lang="scss">
.base-header {
  // overflow: hidden;
  height: 50px;
  position: relative;
  transition: all 0.3s;
  .header-menu {
    height: 50px; // width: 1200px;
    font-size: 30px;
    color: #ccc;
    padding: 0 10px;
    line-height: 50px;
    overflow: hidden;
    // overflow-x: scroll;
    // overflow-y: hidden;
    &:hover {
      cursor: pointer;
      color: #fff;
    }

    .is-active {
      background: rgba(44, 44, 46, 0.31) !important;
    }
  }
  .header-logo {
    float: left;
    width: 250px;
    height: 50px;
    // background-color: #0e0e10;
    img {
      width: 240px;
      height: 43px;
      margin-top: 3px;
    }
  }
  .header-menu-cll {
    height: 50px;
    float: left;
    line-height: 50px;
    padding: 0 10px;
    color: #ccc;
    font-size: 30px;
    &:hover {
      cursor: pointer;
      color: #fff;
    }
    .header-menu-default {
      margin-left: 5px;
      transition: all 0.3s;
    }
    .header-change {
      transform: rotate(-90deg);
    }
  }
  .header-theme {
    color: #fff;
    position: absolute;
    top: 0px;
    z-index: 2000;
    right: 93px;
    // height: 50px;
    // line-height: 50px;
    padding: 12px 5px 0 5px;
    font-size: 20px;
    &:hover {
      cursor: pointer;
      color: #409eff;
      // background-color: #2c2c2e !important;
    }

    .main {
      font-size: 14px;
      line-height: normal;
      color: #000000;
      position: absolute;
      right: -64px;
      top: 55px;
      width: 230px;
      z-index: 100;

      .arrow-up {
        position: relative;
        width: 0;
        height: 0;
        margin-left: 105px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        z-index: 105;
      }

      .contentTheme {
        position: relative;
        background: #fff;
        -moz-box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
        -webkit-box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
        box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
        z-index: 100;

        &:after {
          content: ' ';
          height: 0;
          width: 0;
          left: 60%;
          top: -20px;
          position: absolute;
          border: solid transparent;
          border-width: 10px;
          border-bottom-color: #fff;
        }

        // &:before {
        //   border-width: 12px;
        //   border-left-color: #000;
        //   top: 18px;
        // }
      }

      .themeTitle {
        border-bottom: 1px solid #e7eaec;
        color: #676a6c;
        padding: 10px;
      }
      .colorChoose {
        transition: all 0.3s;
        &:hover {
          /*background-color: #5F9EDF !important;*/
          -webkit-transform: scale(1.05);
          -ms-transform: scale(1.05);
          transform: scale(1.05);
          zoom: 1.05;
        }
      }
      .theme-lis {
        display: block;
        // background-color: rgb(50, 65, 87);
        text-align: center;
        padding: 10px;
        cursor: pointer;
      }
    }
  }

  .header-full {
    color: #fff;
    position: absolute;
    top: 0px;
    z-index: 2000;
    right: 128px;
    // height: 50px;
    // line-height: 50px;
    padding: 12px 5px 0 5px;
    font-size: 20px;
    &:hover {
      cursor: pointer;
      color: #409eff;
      // background-color: #2c2c2e !important;
    }
  }
  .bling-in-enter-active {
    animation: boingInUp 0.7s 0s 1 both;
  }

  .bling-in-leave-active {
    animation: spaceOutDown 1s 0s 1 both;
  }
  @keyframes boingInUp {
    0% {
      opacity: 0;
      transform-origin: 50% 0%;
      transform: perspective(800px) rotateX(-90deg);
    }

    50% {
      opacity: 1;
      transform-origin: 50% 0%;
      transform: perspective(800px) rotateX(22deg);
    }

    100% {
      opacity: 1;
      transform-origin: 50% 0%;
      transform: perspective(800px) rotateX(0deg);
    }
  }
  @keyframes spaceOutDown {
    0% {
      opacity: 1;
      transform-origin: 50% 100%;
      transform: scale(1) translate(0%, 0%);
    }

    100% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0.2) translate(0%, 200%);
    }
  }
  .header-menu {
    // float: left;
    position: absolute;
    top: 0px;
    left: 305px; // width: calc(100vw - 321px);
    height: 50px; // width: 1200px;
    .menu-demo {
      .el-menu-item {
        height: 50px !important;
        line-height: 50px !important;
        &:hover {
          // background-color: red !important;
        }
      }
      .el-menu-item.is-active {
        // border-bottom: 4px solid #409eff;
      }
    }
  }

  .header-set {
    // background-color: #0e0e10;
    height: 50px;
    /* height: 50px;
      line-height: 50px; */
    // width: 100px;
    font-size: 40px;
    position: absolute;
    top: 0px;
    right: 10px;
    z-index: 10;
    overflow: hidden;
    .header-user-img {
      // width: 50px;
      // height: 50px;
      // background-color: red;
      // border-radius: 50%;
      // position: relative;
      img {
        // position: absolute;
        // top: -40px;
        margin-top: 5px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .header-set-lout {
      float: right;
      height: 50px;
      line-height: 50px;
      font-size: 35px;
      margin-right: 10px;
      color: #ccc;
      &:hover {
        cursor: pointer;
        color: #f56c6c;
      }
    }
  }
  .header-notic {
    color: #fff;
    position: absolute;
    top: 0px;
    z-index: 2000;
    right: 58px;
    padding: 0 5px;
    font-size: 24px;
    &:hover {
      cursor: pointer;
      // background-color: #2c2c2e !important;
      &:hover {
        cursor: pointer;
        color: #409eff;
        // background-color: #2c2c2e !important;
      }
    }
    .header-notic-main {
      position: relative; // height: 50px;
      margin-top: 9px; // line-height: 50px;
      .el-badge__content {
        border: 0px !important;
        padding: 0 4px !important;
      }
      .is-fixed {
        top: 10px;
        right: 12px;
      }
    }
    .header-notic-content {
      font-size: 14px;
      position: absolute;
      top: 55px;
      right: 0px;
      color: #444;
      background-color: #fff;
      z-index: 99999;
      width: 250px;
      -moz-box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
      -webkit-box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
      box-shadow: -1px 1px 20px rgba(31, 45, 61, 0.65);
      transition: all 0.4s;
      // border: 1px solid rgba(130, 128, 128, 0.2);
      &:after {
        content: ' ';
        height: 0;
        width: 0;
        left: 88%;
        top: -20px;
        position: absolute;
        border: solid transparent;
        border-width: 10px;
        border-bottom-color: #fff;
      }
      .header-notic-content-title {
        padding: 5px 15px;
        font-size: 14px;
        border-bottom: 1px solid rgba(130, 128, 128, 0.2);
      }

      .header-notic-content-content {
        padding: 5px 10px;
        display: flex;
        .header-notic-img {
          flex: 0.2;
          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
          }
        }
        .header-notic-text {
          width: 180px;
          padding-left: 15px;
          font-size: 12px;
          flex: 1;
        }
        &:hover {
          background-color: rgba(204, 204, 204, 0.35);
        }
      }
      .header-notic-content-no {
        text-align: center;
        padding-top: 90px;
        color: #a0a0a0;
      }
      .header-notci-conetnt-footer {
        border-top: 1px solid rgba(130, 128, 128, 0.2);
        padding: 5px 15px;
        color: #ccc;
        &:hover {
          color: #409eff;
        }
      }
    }
    .animationsacle-enter-active {
      // transform-origin: 100% 0;
      animation: boingInUp 0.7s 0s 1 both;
      // animation: noticScaleIn 0.3s 0s 1 both;
    }
    .animationsacle-leave-active {
      // transform-origin: 100% 0;
      animation: spaceOutDown 1s 0s 1 both;

      // animation: noticScaleOut 0.3s 0s 1 both;
    }
    .music {
      animation: headShake 1s 0s 1 both;
    }
    @keyframes headShake {
      0% {
        transform: translateX(0);
      }

      6.5% {
        transform: translateX(-6px) rotateY(-9deg);
      }

      18.5% {
        transform: translateX(5px) rotateY(7deg);
      }

      31.5% {
        transform: translateX(-3px) rotateY(-5deg);
      }

      43.5% {
        transform: translateX(2px) rotateY(3deg);
      }

      50% {
        transform: translateX(0);
      }
    }
    @keyframes noticScaleIn {
      0% {
        opacity: 0;
        -webkit-transform: scale(0.2);
        transform: scale(0.2);
      }
      100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
      }
    }
    @keyframes noticScaleOut {
      from {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
      }
      to {
        opacity: 0;
        -webkit-transform: scale(0);
        transform: scale(0);
      }
    }
  }
}
</style>
