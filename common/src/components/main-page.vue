<template>
  <div class="main-page">
    <div class="form-container" id="form">
      <div class="slogon">
        <img :src="imgSrc" alt="">
      </div>
      <form>
        <div class="tel-input">
          <input type="tel" v-model="userTel" placeholder="请输入手机号加入" :class="{valid: telValid}">
          <div class="flash" v-if="!userTel"></div>
        </div>
        <div class="button-container" @click="handleClickBtn">
          <!-- <img src="./img/button1-disabled.png" v-show="!telValid" alt="" class="submit-btn btn-disabled"> -->
          <img src="./img/button1-active.png" alt="" class="submit-btn btn-active">
        </div>
      </form>
      <div class="arrow" :class="{slideInDown: pageLoaded}">
        <img src="./img/arrow.svg" alt="">
      </div>
    </div>
    <div class="introduction">
      <img src="./img/introduction.png" alt="">
    </div>
    <div class="rules">
      <h3>活动须知：</h3>
      <ul v-if="activityData">
        <li v-for="(item, index) in activityData.notice" :key="index">{{item}}</li>
      </ul>
    </div>
    <div class="footer">
      <img src="./img/footer.jpg" alt="">
    </div>
    <a href="#" @click.prevent="handleBackToTop">
      <img class="to-top" src="./img/to-top.png" alt="">
    </a>
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui'
import config from '../config.js'
import { fetch, getURLParams } from '../utils/util'
console.log('====fetch====', fetch)
export default {
  name: 'main-page',

  props: [activityData, utmData],

  data() {
    return {
      pageLoaded: false,
      userTel: '',
      telValid: false,
      user: null,
      query: {},
      deadline: '2018年10月31日',
      imgSrc: ''
    }
  },

  methods: {
    checkTel() {
      let reg = /^((1[1-9][0-9])+\d{8})$/
      return reg.test(this.userTel)
    },
    sendData(data) {
      this.$sa.track('activityRegisteRequest', {

      })
      fetch(
        config.url,
        {
          phone: this.userTel,
          activity_code: config.activeCode,
          certkey: config.certkey,
          ...this.utmData
        },
        'post'
      ).then(res => {
        if (res.code == 0) {
          Toast({
            message: '领取成功',
            position: 'bottom'
          })
          this.user = {
            tel: this.userTel
          }
          this.$emit('nextPage', 'newUser')
          this.$emit('message', '注册')
        } else if (res.code == -1) {
          this.$emit('nextPage', 'oldDriver')
        } else {
          Toast(res.msg)
        }
      })
    },

    handleClickBtn() {
      if (this.checkTel()) {
        this.sendData()
      } else {
        Toast('请输入正确的手机号')
      }
    },
    handleBackToTop() {
      this.$el.querySelector('.slogon').scrollIntoView({
        behavior: 'smooth'
      })
    }
  },

  mounted() {
    this.query = getURLParams()
    if (this.query.id) {
      this.imgSrc = `./dist/${this.query.id}.png`
      // this.$sa.track('activityRegistePageOpen', {

      // })
    }
    setTimeout(() => {
      this.pageLoaded = true
    }, 3000)
  }
}
</script>
<style lang="scss">
@import '../assets/scss/global.scss';
@import './scss/animation.scss';
.main-page {
  position: relative;
  .form-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .slogon {
      flex: 1;
      display: flex;
      // background-image: url('./img/slogon.png');
      // background-size: contain;
      // background-repeat: no-repeat;
      // background-position: center;
    }
    form {
      width: 85%;
      margin: auto;
      .tel-input {
        position: relative;
        input {
          margin: 0;
          padding: 0 4vw;
          border: none;
          display: block;
          width: 100%;
          height: 12vw;
          vertical-align: middle;
          color: $color-dark;
          background-color: #fff;
          text-align: center;
          border-radius: 5.8666666vw;
          border: 2px solid $color-dark;
          text-align: center;
          font-size: 4.6vw;
          outline: none;
          &.valid {
            border: 2px solid $color-dark;
          }
          &::-webkit-input-placeholder {
            color: #c6c6c6;
          }
          &:focus {
            &::-webkit-input-placeholder {
              opacity: 0;
            }
            & + .flash {
              display: none;
            }
          }
        }
        .flash {
          width: 2px;
          position: absolute;
          width: 2px;
          height: 12vw;
          top: 0;
          left: 22vw;
          background-color: $color-yellow;
          padding: 2vw 0;
          background-clip: content-box;
          animation-name: flash;
          animation-duration: 1000ms;
          animation-delay: 0ms;
          animation-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1);
          animation-iteration-count: infinite;
        }
      }
      .button-container {
        margin-top: 2vw;
        .submit-btn {
          display: block;
          width: 100%;
        }
      }
    }
    .arrow {
      width: 5vw;
      margin: 3vw auto 1vw;
    }
  }
  .introduction {
    position: relative;
  }
  .to-top {
    position: absolute;
    bottom: 6vw;
    right: 6vw;
    width: 12vw;
    padding: 2vw;
  }
  .rules {
    width: 80%;
    margin: auto;
    color: #3d3d3d;
    h3 {
      font-size: 3.6vw;
      margin: 2vw 0 0;
    }
    ul {
      font-size: 3vw;
      padding: 0;
      margin: 1vw 0 3vw;
    }
  }
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.iphone {
  .main-page .form-container form .tel-input input::-webkit-input-placeholder {
    transform: translateY(-2px);
  }
}
</style>
