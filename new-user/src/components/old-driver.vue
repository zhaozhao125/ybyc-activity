<template>
  <div class="old-driver">
    <div class="qr-code">
      <img src="./img/bg-qrcode.png" alt="">
      <div class="qr-overlay"></div>
    </div>
    <div class="button" @click="handleClickDownload">
      <img src="./img/button2.png" alt="">
    </div>
    <div class="qrcode" v-if="isWeixin">
      <img src="./img/qrcode.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  name: 'old-driver',

  data() {
    return {
      isWeixin: false
    }
  },

  mounted() {
    if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
      this.isWeixin = true
    }
    // 修复安卓长按小程序码会识别公众号二维码的问题
    // 由于安卓识别二维码是给屏幕截图，所以如果屏幕上有两个码的时候，会识别出错
    this.$nextTick(() => {
      if (
        this.isWeixin &&
        window.navigator.userAgent.toLowerCase().match(/android/i)
      ) {
        let $appCode = document.querySelector('.old-driver .qrcode img')
        let $qrOverlay = document.querySelector('.old-driver .qr-overlay')
        $appCode.addEventListener(
          'touchstart',
          function(e) {
            $qrOverlay.style.display = 'block'
          },
          false
        )
        $appCode.addEventListener(
          'touchend',
          function() {
            $qrOverlay.style.display = 'none'
          },
          false
        )
        $appCode.addEventListener(
          'touchcancel',
          function() {
            $qrOverlay.style.display = 'none'
          },
          false
        )
      }
    })
  },

  methods: {
    handleClickDownload() {
      setTimeout(() => {
        window.open(
          'https://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche'
        )
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
    width: 75%;
    margin: 5vw auto 2vw;
    position: relative;
  }
  .button {
    width: 85%;
    margin: auto;
  }
  .qrcode {
    text-align: center;
    margin-top: 3vw;
    img {
      width: 85vw;
    }
  }
}
.iphone .qr-overlay {
  display: none;
}
.android .qr-overlay {
  display: none;
  position: absolute;
  width: 50%;
  height: 8vw;
  background-color: #fff;
  top: 33%;
  left: 0;
  right: 0;
  margin: auto;
}

@media screen and (min-width: 650px){
  .old-driver .qr-code{
    
  }
}
</style>
