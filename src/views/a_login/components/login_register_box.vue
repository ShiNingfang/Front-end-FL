<template>
  <div id="login-register-box">
    <LoginBox specific_type="password" @left_move_change="left_move" />
    <RegisterBox specific_type="password" @right_move_change="right_move" />
    <CoverBox :images_load="images_src" :animation="level_animation" :level_style="cover_style" />
  </div>
</template>

<script>
import LoginBox from './login_box'
import RegisterBox from './register_box'
import CoverBox from './cover_box'

export default {
  name: 'LoginRegisterBox',
  components: {
    LoginBox,
    RegisterBox,
    CoverBox
  },

  data() {
    return {
      images_src: require('@/assets/login_images/right.png'),
      level_animation: '',
      cover_style: 'cover-box-right'
    }
  },

  mounted() {

  },

  methods: {
    left_move: function(left_image, left_animation, left_style) {
      this.level_animation = left_animation
      this.images_src = left_image
      this.cover_style = left_style
    },

    right_move: function(right_image, right_animation, right_style) {
      this.level_animation = right_animation
      this.images_src = right_image
      this.cover_style = right_style
    }
  }
}
</script>

<style>
#login-register-box {
    display: flex;
    width: 70%;
    height: 80%;
    margin: auto;
    border-radius: 30px;
    box-shadow: 0px 0px 10px rgb(16, 17, 17);
    background-color: rgb(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
}

#login-box, #register-box {
    flex: 1;
    width: 100%;
    height: 100%;
}

.title-box {
    height: 20%;
    line-height: 100px;
}

.title-box h1 {
    font-size: 35px;
    color: rgb(21, 38, 48);
    text-align: center;
    letter-spacing: 5px;
}

.input-box {
    width: 100%;
    height: 40%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.input-box input {
    width: 50%;
    height: 25px;
    margin: 8px auto;
    border: none;
    border-radius: 8px;
    text-indent: 5px;
    box-shadow: 0px 0px 3px rgb(16, 17, 17);
    background-color: rgb(255, 255, 255);

}

.input-box input:focus::placeholder {
    width: 50%;
    height: 40px;
    margin: 10px auto;
    border: none;
    border-radius: 8px;
    text-indent: 5px;
    box-shadow: 0px 0px 3px rgb(16, 17, 17);
    background-color: rgb(255, 255, 255);
    opacity: 0;
}

.skip-text {
    display: block;
    width: 50%;
    height: 10%;
    margin: 5px auto;
    text-align: center;
    letter-spacing: 3px;
    font-size: 20px;
    font-weight: 1000;
    color: rgb(21, 38, 48);
}

.skip-text:hover {
    display: block;
    cursor:default;
    width: 50%;
    height: 10%;
    margin: 5px auto;
    text-align: center;
    letter-spacing: 3px;
    font-size: 20px;
    font-weight: 1000;
    color: rgb(255, 255, 255);
}

.input-button {
    display: flex;
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 30%;
}

.input-button input[type="submit"] {
    width: 50%;
    height: 15%;
    margin: auto;
    border: none;
    border-radius: 8px;
    box-shadow: 0px 0px 20px rgb(63, 61, 61);
    background-color: rgb(21, 38, 48);
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: 800;
}

.input-button input[type="submit"]:hover {
    width: 50%;
    height: 15%;
    margin: auto;
    border: none;
    border-radius: 8px;
    box-shadow: 0px 0px 20px rgb(63, 61, 61);
    background-color: rgb(255, 255, 255);
    color: rgb(21, 38, 48);
    font-size: 20px;
    font-weight: 800;
}

input {
    outline: none;
}

</style>
