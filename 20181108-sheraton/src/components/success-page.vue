<template>
  <div class="success-page">
    <div class="success-img">
      <img v-if="couponSuccess" src="./img/bg-success2.png" alt="">
      <img v-else src="./img/bg-success.png" alt="">
    </div>
    <div class="button" @click="handleClickDownload">
      <img src="./img/button3.png" alt="">
    </div>
    <div class="qrcode" v-if="isWeixin">
      <img src="./img/qrcode.png" alt="">
      <!-- <p>一步用车小程序</p>
      <p>长按识别
        <strong>立即用车</strong>
      </p> -->
    </div>
  </div>
</template>

<script>
let activity = process.env.ACTIVITY
console.log('====process.env====', process.env)
export default {
  name: 'success-page',

  props: {
    couponSuccess: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isWeixin: false,
      activity: activity
    }
  },

  mounted() {
    if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
      this.isWeixin = true
    }
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
.success-page {
  width: 100%;
  position: absolute;
  top: 0;
  .success-img {
    width: 75%;
    margin: 5vw auto 2vw;
  }
  .button {
    width: 86%;
    margin: auto;
  }
  .qrcode {
    text-align: center;
    margin-top: 3vw;
    img {
      width: 85vw;
    }
    p {
      margin: 1vw 0;
    }
  }
}
</style>