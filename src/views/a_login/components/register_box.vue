<template>
  <div id="register-box">
    <div class="title-box">
      <h1>REGISTER</h1>
    </div>
    <form method="post">
      <div class="input-box">
        <input type="email" placeholder="输入邮箱">
        <input type="text" placeholder="输入用户名">
        <input :type="specific_type" placeholder="输入密码">
        <input :type="specific_type" placeholder="确定密码">
        <input type="text" placeholder="验证码">
      </div>
      <span class="skip-text" @click="right_move">登录</span>
      <div class="input-button">
        <input type="submit" value="注册">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterBox',
  props: {
    specific_type: String
  },
  data() {
    return {
      right_image: require('@/assets/login_images/right.png'),
      right_animation: 'right_animation',
      right_style: 'cover-box-right'
    }
  },

  mounted() {

  },

  methods: {
    right_move: function() {
      this.$emit('right_move_change', this.right_image, this.right_animation, this.right_style)
    }
  }
}
</script>

<style scoped>

</style>
