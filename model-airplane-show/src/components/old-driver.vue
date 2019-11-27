<template>
  <div class="old-driver">
    <div class="qr-code">
      <img src="./img/bg-qrcode.png" alt="">
    </div>
    <div class="button" @click="handleClickDownload">
      <img src="./img/button2.png" alt="">
    </div>
  </div>
</template>
<script>
export default {

  name: 'old-driver',

  data() {
    return {

    }
  },

  methods: {
    handleClickDownload() {
      this.$emit('message', '下载')
      setTimeout(() => {
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche')
      }, 200)
    }
  }
}

</script>
<style lang="scss">
@import '../assets/scss/global.scss';
.old-driver {
  width: 100%;
  position: absolute;
  top: 0;
  .qr-code {
    width: 85%;
    margin: 6vw auto 4vw;
  }
  .button {
    width: 90%;
    margin: auto;
  }
}

</style>
