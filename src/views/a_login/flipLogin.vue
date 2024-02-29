<template>
  <div class="shell">
    <div class="top">
      <span class="off">SIGN IN</span>
      <div class="button" @click="toggle">
        <div class="ball" :style="{ left: ballLeft }" />
      </div>
      <span class="on" :style="{ opacity: labelOpacity }">SIGN UP</span>
    </div>

    <div class="bottom" :style="{ transform: cardTransform }">
      <div class="signIn">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" type="text" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="密码" type="password" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form>
      </div>
      <div class="signUp">
        <h2>Sign up</h2>
        <input type="text" placeholder="Username">
        <input type="password" placeholder="Password">
        <input type="password" placeholder="Confirm password">
        <button>GO</button>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      index: 0,
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    ballLeft() {
      return this.index === 0 ? '0' : '61%'
    },
    labelOpacity() {
      return this.index === 0 ? 0.5 : 1
    },
    cardTransform() {
      return `rotateY(${this.index * 180}deg)`
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    toggle() {
      this.index = this.index === 0 ? 1 : 0
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
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
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style scoped>
    * {
        padding: 0;
        margin: 0;
        outline: none;
        border: none;
    }

    body {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(31, 32, 41);
    }

    .shell {
        width: 300px;
        height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        perspective: 1000px;
        /* 给最外层加上一个透视，否则接下去的翻转会没有3d的效果 */
    }

    .top {
        width: 300px;
        display: flex;
        cursor: pointer;
        justify-content: space-evenly;
    }

    .off,
    .on {
        color: #fff;
        transition: .5s;
        font: 300 20px '';
    }
    .on{
        opacity: .5;
    }
    .button {
        width: 60px;
        height: 25px;
        background-color: rgb(255, 235, 167);
        border-radius: 20px;
        position: relative;
    }

    .ball {
        position: absolute;
        width: 25px;
        height: 25px;
        background-color: rgb(46, 45, 56);
        border-radius: 50%;
        transition: .5s;
        box-shadow: 0 0 10px #000;
        left: 0;
        transform: translate(-1px);
    }

    .bottom {
        width: 300px;
        height: 250px;
        background-image: url(./background.png);
        transform-style: preserve-3d;
        /* 使元素呈现出3D效果 */
        position: relative;
        transition: .7s;
        border-radius: 5px;
    }

    .bottom>div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }

    .bottom>div h2 {
        color: white;
    }
    .bottom>div input{
        width: 200px;
        height: 25px;
        padding:0 10px;
        background-color: rgb(31, 32, 41);
        color: #fff;
    }

    .bottom>div button{
        width: 80px;
        height: 30px;
        color: #333;
        font-size: 15px;
        background-color: rgb(255, 235, 167);
        border-radius: 4px;
        transition: .3s;
        margin-bottom: 10px;
        cursor: pointer;box-shadow:0 0 10px rgb(255, 235, 167);
    }
    .bottom>div button:hover{

    }
    .signIn {
        transform: translateZ(70px);
        /* 在这里我们将卡片里面内容和卡片有一个距离，这样子会更有立体感 */
    }

    .signUp {
        position: absolute;
        top: 0;
        transform: translateZ(-70px) rotateY(180deg);
        /* 我们给反面加上距离的时候，前往不要忘记给反面的内容也翻转一下，否则就会出现这种卡片转过来了，里面的内容也反了 */
    }
</style>
