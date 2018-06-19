<template>
  <div class="login-wrap">
    <transition name="fadeUp">
      <div class="login-body">
        <div class="login-logo"></div>
        <div class="login-form">
          <el-form inline :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"
                   @keyup.enter.native="submitForm('ruleForm')">
            <el-form-item prop="用户名" class="formItem firstItem">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名" width="250px">
                <template slot="prepend">用户名 |</template>
              </el-input>
            </el-form-item>

            <div> &nbsp;</div>
            <el-form-item prop="密码" class="formItem secondItem">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码">
                <template slot="prepend">密码 |</template>
              </el-input>
            </el-form-item>
          </el-form>

        </div>
        <div class="login-btn">
          <el-button :loading="btnLoding" @click="submitForm('ruleForm')">登 录</el-button>
          <div class="login-ewei">
            <div style="flex:1">
              <div class="no1">
                <img :src="img.android"/>
              </div>
            </div>
            <div style="flex:1">
              <div class="no2">
                <img :src="img.ios"/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>
    <div class="login-footer">
      Copyright　©　2017-2018 Znjtyd.com　All rights reserved　滇ICP备10000
    </div>
  </div>
</template>

<script>
  import {asyncRouter} from "@/assets/js/commonManage";

  export default {
    data() {
      return {
        img: {
          android: "",
          ios: ""
        },
        btnLoding: false,
        ruleForm: {
          username: "",
          password: ""
        },
        rules: {
          username: [
            {
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              message: "请输入密码",
              trigger: "blur"
            }
          ]
        },
        roleList: []
      };
    },
    created() {
      let path = "/static/upload/QRCode/";
      this.img.android =
        "http://" + this.$webconfig.serverIp + path + "android.png";
      this.img.ios = "http://" + this.$webconfig.serverIp + path + "ios.png";
    },
    methods: {
      submitForm(formName) {
        const VM = this;
        VM.btnLoding = true;
        VM.$refs[formName].validate(async valid => {
          if (valid) {
            const param = {
              username: VM.ruleForm.username,
              password: VM.ruleForm.password
            };
            try {
              const res = await VM.$http.post("/login", param);
              if (res.data && res.data.success) {
                const resData = res.data.result;
                document.cookie = "islogin=true";
                localStorage.setItem("username", resData.username);
                // VM.$setStore("TOKEN", res.data.attributes.token);
                VM.$setStore("userData", resData);
                if (resData.roleList.length > 0) {
                  VM.roleList = resData.roleList; //获取角色信息
                  VM.setmenu(resData.menuList); //缓存菜单信息
                  VM.getDictionaryList(); //页面初始化时加载字典数据
                  // console.log(VM.$router);
                  // console.log(asyncRouter);
                  // VM.$router.addRoutes(asyncRouter);
                  VM.$router.addRoutes(asyncRouter(resData.menuList));
                  VM.$store.dispatch("setVueLogin", true);
                  VM.$router.push("/Layout");
                  // VM.setRouter(() => {
                  //   console.log(3);

                  // });
                  // VM.$nextTick(function() {
                  //   VM.$router.push("/Layout");
                  // });
                  VM.$message({
                    type: "success",
                    duration: 1000,
                    message: "登录成功，欢迎回到数字城管！"
                  });
                } else {
                  VM.btnLoding = false;
                  VM.$message.warning(res.data.msg);
                }
              } else {
                VM.btnLoding = false;
                VM.$message.warning(res.data.msg);
              }
            } catch (err) {
              VM.btnLoding = false;
              VM.$message.error("登录失败");
            }
          } else {
            VM.btnLoding = false;
            VM.$message.warning("请输入用户名/密码");
            return false;
          }
        });
      },
      setRouter(callback) {
        this.$router.addRoutes(asyncRouter());

        this.$store.dispatch("setVueLogin", true);
        typeof callback === "function" && callback();
      },
      /**
       * 缓存字典信息
       */
      async getDictionaryList() {
        try {
          const res = await this.$http.get(
            "/sys/DictionaryController/initdictionary"
          );
          if (res.data && res.data.success) {
            this.$setStore("gDictionaryList", res.data.result);
          }
        } catch (err) {
          this.$message.error("字典信息获取失败");
        }
      },

      /**
       * 获取角色菜单
       */
      async getSysRoleMenu() {
        const VM = this;
        var params = {
          roleList: VM.roleList
        };
        try {
          const res = await VM.$http.post(
            "/sys/RoleController/getUserRoleMenu",
            params
          );
          if (res.data && res.data.result) {
            VM.setmenu(res.data.result);
            VM.getDictionaryList(); //页面初始化时加载字典数据

            // VM.$router.addRoutes(originPath.concat([{
            //       path: '*',
            //       redirect: '/404'
            //     }]));
            VM.$router.push("/Layout");
            // VM.$message({
            //   type:'success',
            //   duration:0,
            //   message:'登录成功，欢迎回到数字城管！'
            // })
          } else {
            VM.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error("角色菜单获取失败");
        }
      },
      /**
       * 组装菜单信息
       */
      setmenu(res) {
        this.$setStore("gMenuList", res);
      }
    },
    components: {}
  };
</script>

<!-- 添加 "scoped " css作用域只作用于本文件，不作用全局-->
<style>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/login.jpg");
    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .login-body {
    width: 800px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -400px;
    margin-top: -275px;
  }

  .login-body .login-logo {
    width: 530px;
    height: 124px;
    margin-left: 140px;
    background-image: url("../assets/images/logo2.png");
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    vertical-align: middle;
  }

  .login-body .login-form {
    text-align: center;
    margin-top: 70px;
    margin-bottom: 40px;
    margin-left: 25px;
  }

  .formItem {
    display: block;
    width: 350px;
    height: 50px;
    background: #1c1c1c;
    /* margin-right:50px!important; */
    box-shadow: -2px 0 0 #3b3b3b inset, 0 -2px 0 #3b3b3b inset, 0 2px 0 #000 inset,
    2px 0 0 #000 inset;
  }

  .firstItem {
    /* margin-right: 25px !important; */
  }

  .secondItem {
    /* margin-left: 25px !important; */
  }

  .formItem .el-input-group__prepend {
    background-color: transparent !important;
    color: #bbbbbb !important;
    border: none !important;
    border-radius: 0px !important;
    padding: 0 10px !important;
    line-height: 50px !important;
  }

  .formItem .el-input__inner {
    background-color: transparent !important;
    border-radius: 0px !important;
    border: none !important;
    color: #bbbbbb;
    height: 50px !important;
    width: 300px !important;
    padding: 0 5px !important;
  }

  .login-wrap .login-footer {
    bottom: 5%;
    height: 24px;
    line-height: 24px;
    width: 100%;
    color: #434343;
    text-align: center;
    position: absolute;
    font-size: 14px;
    margin-bottom: -12px;
  }

  .login-btn {
    width: 100%;
    height: 50px;
  }

  .login-btn .login-ewei {
    margin-left: 280px;
    width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    /* margin-left: 200px; */
    /* width: 350px; */
  }

  .login-btn .login-ewei .no1 {
    margin: 0 12px;
    height: 120px;
    width: 120px;

    /* background-image: url("../assets/images/android.png");
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    vertical-align: middle; */
  }

  .login-btn .login-ewei .no1 img {
    height: 120px;
    width: 120px;
  }

  .login-btn .login-ewei .no2 {
    margin: 0 12px;
    height: 120px;
    width: 120px;
    /* background-image: url("../assets/images/ios.png");
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    vertical-align: middle; */
  }

  .login-btn .login-ewei .no2 img {
    height: 120px;
    width: 120px;
  }

  .login-btn .el-button {
    font-size: 24px;
    font-weight: 600;
    padding: 0 50px !important;
    text-align: center !important;
    background: #ffc713 !important;
    color: black !important;
    height: 50px !important;
    line-height: 50px !important;
    width: 350px !important;
    margin-left: 235px;
    text-align: center !important;
    border: 1px solid #ffc713 !important;
    border-radius: 0px !important;
  }

  .login-form .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }

  .login-btn .el-button:hover,
  .login-btn .el-button:active,
  .login-btn .el-button:focus {
    color: rgb(31, 28, 28) !important;
    border-color: #f7ca44 !important;
    background-color: #f7ca44 !important;
  }

  .login-body {
    animation: vanishIn 0.7s ease 0s 1 backwards;
  }

  @keyframes vanishIn {
    0% {
      opacity: 0;
      transform-origin: 50% 50%;
      transform: scale(2, 2);
      filter: blur(90px);
    }

    100% {
      opacity: 1;
      transform-origin: 50% 50%;
      transform: scale(1, 1);
      filter: blur(0px);
    }
  }
</style>
