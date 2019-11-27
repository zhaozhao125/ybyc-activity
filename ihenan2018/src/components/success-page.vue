<template>
  <div class="success-page">
    <div class="success-img">
      <img src="./img/bg-success.png" alt="">
    </div>
    <div class="button">
      <img @click.prevent="handleClickDownload" src="./img/button3.png" alt="">
    </div>
  </div>
</template>

<script>
export default {

  name: 'success-page',

  data () {
    return {

    }
  },

  methods: {
    handleClickDownload() {
      setTimeout(() => {
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche')
      }, 200)
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/global.scss';
.success-page{
  width: 100%;
  position: absolute;
  min-height: 100%;
  background-color: $color-yellow;
  top: 0;
  .success-img {
    width: 85%;
    margin: 8vw auto 4vw;
  }
  .button {
    width: 90%;
    margin: auto;
  }
}
</style>