<template>
  <div :id="animation" :class="level_style">
    <img :src="images_load">
    <h1>Welcome</h1>
  </div>
</template>

<script>
export default {
  name: 'CoverBox',
  props: {
    images_load: {
      type: String,
      required: true
    },
    animation: String,
    level_style: String
  },

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
.cover-box-right {
    display: flex;
    width: 50%;
    height: 100%;
    z-index: 1;
    position: absolute;
    left: 50%;
}

.cover-box-left {
    display: flex;
    width: 50%;
    height: 100%;
    z-index: 1;
    position: absolute;
    left: 0%;
}

img {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 30px;
}

h1 {
    width: 100%;
    height: 30%;
    z-index: 4;
    margin: auto;
    text-align: center;
    line-height: 100%;
    font-size: 50px;
    font-weight: 800;
    color: black;
    letter-spacing: 5px;
}

@keyframes left_move {
    0% {
        transform: translateX(50%);
    }
    100% {
        transform: translateX(-0%);
    }
}

#left_animation {
    animation: left_move 0.6s;
}

@keyframes right_move {
    0% {
        transform: translateX(-50%);
    }
    100% {
        transform: translateX(0%);
    }
}

#right_animation {
    animation: right_move 0.6s;
}

</style>
