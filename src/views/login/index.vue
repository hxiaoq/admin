<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-card-body">
        <div class="logo">
          <div class="top">
            <img src="@/assets/login/sign-image-02.png" alt="" />
          </div>
          <div class="bottom">
            <span class="title">重型柴油车</span>
            <div class="sub-title">
              <span class="spilt-line">一</span>
              远程监测系统
              <span class="spilt-line">一</span>
            </div>
          </div>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              @blur="loadPassWord()"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <el-row style="margin-bottom: 15px">
            <el-col :span="16">
              <el-form-item prop="validate">
                <span class="svg-container">
                  <svg-icon icon-class="yzm" />
                </span>
                <el-input
                  ref="validate"
                  v-model="loginForm.validate"
                  placeholder="请输入验证码"
                  name="validate"
                  type="text"
                  tabindex="3"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="valid-img">
                <div class="valid-code" @click="refreshCode">
                  <span
                    v-for="(item, index) in codeList"
                    :key="index"
                    :style="getStyle(item)"
                  >
                    {{ item.code }}
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="remember-pwd">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin: 20px 0 10px 0"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateValidate = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('验证码不能为空'))
      } else if (value.trim().toLocaleLowerCase() !== this.currentValidate.toLocaleLowerCase()) {
        callback(new Error('请输入正确的验证码'))
        this.refreshCode()
      } else {
        callback()
      }
    }
    return {
      codeList: [],
      currentValidate: '',
      checked: true,
      loginForm: {
        username: '',
        password: '',
        validate: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        validate: [{ required: true, trigger: 'blur', validator: validateValidate }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.createdCode()
  },
  methods: {
    loadPassWord() {
      Cookies.get(this.loginForm.username) && (this.loginForm.password = Cookies.get(this.loginForm.username))
    },
    refreshCode() {
      this.createdCode()
    },
    createdCode() {
      const len = 4
      const codeList = []
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
      const charsLen = chars.length
      // 生成
      for (let i = 0; i < len; i++) {
        const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
        codeList.push({
          code: chars.charAt(Math.floor(Math.random() * charsLen)),
          color: `rgb(${rgb})`,
          fontSize: `${10 + (+[Math.floor(Math.random() * 10)] + 8)}px`,
          padding: `${[Math.floor(Math.random() * 6)]}px`,
          transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
        })
      }
      // 指向
      this.codeList = codeList
      // 将当前数据派发出去
      this.currentValidate = codeList.map(item => item.code).join('')
      console.log(codeList.map(item => item.code).join(''))
    },
    getStyle(data) {
      return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            // 记住密码
            if (this.checked) {
              Cookies.set(this.loginForm.username, this.loginForm.password, { expires: 7 })
            } else if (!this.checked) {
              Cookies.remove(this.loginForm.username)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$inputBg: #fff;
$light_gray: #333333;
$cursor: #333333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    background: none !important;
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 80%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $inputBg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #dddddd;
    background: rgba(0, 0, 0, 0);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #333333;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: #d2e8f6 url('~@/assets/login/sign_bg.png') center fixed no-repeat;
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .el-card {
    border: 1px solid #6d99f2;
    .el-card__body {
      padding: 0 !important;
      height: 100%;
    }
  }

  .login-card {
    width: 600px;
    height: 360px;
    max-width: 100%;
    background: url('~@/assets/login/sign-image.png') center fixed no-repeat;
    background-size: cover;
    .login-card-body {
      overflow: hidden;
      height: 100%;
      .logo {
        width: 240px;
        height: 100%;
        float: left;
        .top {
          height: 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 80px;
          }
        }
        .bottom {
          height: 60%;
          text-align: center;
          color: #fff;
          .title {
            font-size: 35px;
            font-weight: 700;
          }
          .sub-title {
            margin-top: 12px;
            font-size: 18px;
            font-weight: 500;
            .spilt-line {
              margin-left: 2px;
              margin-right: 2px;
            }
          }
        }
      }
      .login-form {
        float: right;
        width: calc(100% - 240px);
        padding: 30px 30px;
        margin: 0;
        overflow: hidden;
        background: #fff;
        .el-row .el-form-item {
          margin-bottom: 10px;
        }
        .valid-img {
          height: 50px;
          display: flex;
          align-items: center;
          margin-left: 10px;
          .valid-code {
            border: 1px solid #eee;
            border-radius: 3px;
            width: 100%;
            height: 50px;
            background: url('~@/assets/login/image_1.png') no-repeat;
            background-size: 100% 100%;
            text-align: center;
            line-height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            span {
              display: inline-block;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
          }
        }
        .send-yzm {
          position: absolute;
          right: 10px;
          top: 7px;
          font-size: 13px;
          color: #409eff;
          cursor: pointer;
        }
      }
    }
  }

  .svg-container {
    padding: 3px 5px 3px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
