<template>
  <div class="main">
    <!-- <a-form
      id="formLogin"
      name="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入用户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item style="margin-top:32px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          name="submit"
          id="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >进入</a-button>
      </a-form-item>
    </a-form> -->

    <!-- 上面是原来的用户名密码登陆的代码 -->

    <a-button
      block
      size="large"
      type="primary"
      @click="handleLogin"
      class="no-login-button"
      :loading="state.loginBtn"
      :disabled="state.loginBtn"
    >进入</a-button>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  data () {
    return {
      loginBtn: false,
      loginType: 0,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      validateFields({ force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          state.loginBtn = false
        }
      })
    },
    loginSuccess (res) {
      this.$router.push({ path: '/dashboard/workplace' })
      this.$nextTick(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
    },
    requestFailed (err) {
      console.log('TCL: requestFailed -> err', ((err.response || {}).data || {}).message)
      this.$notification['error']({
        message: '错误',
        description: '登陆出现错误，请稍后再试',
        duration: 4
      })
    },
    // 免用户名密码登陆的方法
    handleLogin () {
      const { Login, state } = this
      state.loginBtn = true
      Login({
        username: 'username',
        password: 'password'
      })
        .then(res => this.loginSuccess(res))
        .catch(err => this.requestFailed(err))
        .finally(() => {
          state.loginBtn = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 免密登陆的登陆按钮
.no-login-button {
  margin-top: 32px;
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
