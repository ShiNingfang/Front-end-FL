<template>
  <!-- <img id="background-image" src="@/assets/login_images/background.jpg" alt="Background-image(f u! Evan You!)"> -->
  <img id="background-image" src="https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_1280.png" alt="Background-image(f u! Evan You!)">
</template>

<script>
export default {
  name: 'BackgroundImage',

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

  }
}
</script>

<style scoped>

img {
    position: fixed;
    object-fit: cover;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
}

</style>
