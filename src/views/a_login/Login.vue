<template>
  <div id="root-element">
    <BackgroundImage />
    <LoginRegisterBox />
  </div>

</template>

<script>

import BackgroundImage from './components/background_image.vue'
import LoginRegisterBox from './components/login_register_box.vue'

export default {

  name: 'Login',
  components: {
    BackgroundImage,
    LoginRegisterBox
  }
}
</script>

<style>
html, body, #root-element {
  width: 100%;
  height: 100%;
  display: flex;
}

</style>
