<template>
  <div id="login-box">
    <div class="title-box">
      <h1>LOGIN</h1>
    </div>
    <form @submit.prevent="handleLogin">
      <div class="input-box">
        <input v-model="loginForm.username" type="text" placeholder="输入用户名">
        <!-- 显示用户名错误 -->
        <div v-if="loginErrors.username">{{ loginErrors.username }}</div>

        <input v-model="loginForm.password" :type="specific_type" placeholder="输入密码">
        <!-- 显示密码错误 -->
        <div v-if="loginErrors.password">{{ loginErrors.password }}</div>
      </div>
      <span class="skip-text" @click="left_move">注册</span>
      <div class="input-button">
        <input type="submit" value="登录">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginBox',
  props: {
    specific_type: String
  },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginErrors: {
        username: null,
        password: null
      },
      left_image: require('@/assets/login_images/left.png'),
      left_animation: 'left_animation',
      left_style: 'cover-box-left'
    }
  },
  methods: {
    left_move() {
      this.$emit('left_move_change', this.left_image, this.left_animation, this.left_style)
    },
    handleLogin() {
      console.log('login')
      // 清除先前的错误信息
      this.loginErrors = { username: null, password: null }

      // 简单的前端验证逻辑
      let valid = true
      if (!this.loginForm.username) {
        this.loginErrors.username = '请输入用户名'
        valid = false
      } else if (this.loginForm.username.length < 3 || this.loginForm.username.length > 20) {
        this.loginErrors.username = '用户名长度在 3 到 20 个字符之间'
        valid = false
      }

      if (!this.loginForm.password) {
        this.loginErrors.password = '请输入密码'
        valid = false
      } else if (this.loginForm.password.length < 6) {
        this.loginErrors.password = '密码长度不能少于 6 位'
        valid = false
      }

      if (valid) {
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>

<style scoped>
</style>
