<template>
  <div class="main-page"
       :class="{'mofei': isMofei}">
    <div class="form-container"
         id="form"
         :class="{'soccer-baby': isSoccerBaby}">
      <div class="slogon"></div>
      <div class="coupon">
        <img v-if="show66"
             src="./img/coupon.png"
             alt="">
        <!-- <img v-else src="./img/coupon.png" alt=""> -->
        <img v-else
             src="./img/coupon55.png"
             alt="">
      </div>
      <form>
        <div class="tel-input">
          <input type="tel"
                 v-model="userTel"
                 placeholder="请输入手机号加入"
                 :class="{valid: telValid}">
          <div class="flash"
               v-if="!userTel"></div>
        </div>
        <div class="button-container"
             @click="handleClickBtn">
          <!-- <img src="./img/button1-disabled.png" v-show="!telValid" alt="" class="submit-btn btn-disabled"> -->
          <img src="./img/button1-active.png"
               alt=""
               class="submit-btn btn-active">
        </div>
      </form>
      <div class="arrow"
           :class="{slideInDown: pageLoaded}">
        <img src="./img/arrow.svg"
             alt="">
      </div>
    </div>
    <div class="introduction">
      <img v-if="isMofei"
           src="./img/bg2-mofei.png"
           alt="">
      <img v-else
           src="./img/introduction.png"
           alt="">
    </div>
    <div class="rules">
      <h3>领取须知：</h3>
      <ul>
        <li>本礼包仅限新注册用户领取，输入手机号码后点击领取即可</li>
        <!-- <li>活动有效期截止于{{deadline}}</li> -->
        <!-- <li>优惠券有效期{{validDays}}天</li> -->
        <li>客服电话400-111-1818</li>
        <li>版权归河南一步用车科技有限公司所有</li>
      </ul>
    </div>
    <div class="footer">
      <img v-if="isMofei"
           src="./img/footer-mofei.png"
           alt="">
      <img v-else
           src="./img/footer.jpg"
           alt="">
    </div>
    <a href="#"
       @click.prevent="handleBackToTop">
      <img class="to-top"
           src="./img/to-top.png"
           alt="">
    </a>
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui'
import config from '../config.js'
let activity = process.env.ACTIVITY
export default {
  name: 'main-page',

  data() {
    return {
      pageLoaded: false,
      userTel: '',
      telValid: false,
      user: null,
      utmData: {},
      query: {},
      deadline: '2018年10月31日',
      validDays: 180,
      // 足球宝贝活动
      isSoccerBaby: false,
      // 魔飞公寓活动
      isMofei: false,
      activity: activity,
      show66: false
    }
  },

  methods: {
    checkTel() {
      let reg = /^((1[1-9][0-9])+\d{8})$/
      return reg.test(this.userTel)
    },
    sendData(data) {
      Indicator.open('请稍候...')
      return new Promise((resolve, reject) => {
        let xmlhttp
        if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest()
        } else {
          xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
            Indicator.close()
            if (xmlhttp.status == 200) {
              resolve(JSON.parse(xmlhttp.responseText))
            } else {
              reject(xmlhttp.status)
            }
          }
        }
        let params = ''
        if (data && typeof data == 'object') {
          let arr = []
          Object.keys(data).forEach(item => {
            arr.push(`${item}=${data[item]}`)
          })
          params = arr.join('&')
        }
        xmlhttp.open('POST', config.url, true)
        xmlhttp.setRequestHeader(
          'Content-type',
          'application/x-www-form-urlencoded'
        )
        xmlhttp.send(params)
      })
    },

    handleClickBtn() {
      if (this.telValid) {
        let activeCode = config.activeCode
        if (
          this.utmData.utm_campaign == 'new_user_online' &&
          this.utmData.utm_medium == 'cooperation'
        ) {
          activeCode = '2018_cooperation'
        }
        if (this.utmData.utm_source == '2018_youtoo365') {
          activeCode = '2018_cooperation_66'
        }
        this.sendData({
          phone: this.userTel,
          activity_code: activeCode,
          certkey: config.certkey,
          ...this.utmData
        })
          .then(res => {
            if (res.userInfo) {
              if (res.userInfo.newUser) {
                Toast({
                  message: '领取成功',
                  position: 'bottom'
                })
                this.user = {
                  tel: this.userTel
                }
                this.$emit('nextPage', 'newUser')
              } else {
                this.$emit('nextPage', 'oldDriver')
              }
              window.sa.login(res.userInfo.userId)
            } else {
              Toast({
                message: res.msg
              })
            }
            document.body.style.backgroundColor = ''
          })
          .catch(() => {
            Toast({
              message: '网络请求出错，请重试'
            })
          })
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

  watch: {
    userTel() {
      this.telValid = this.checkTel()
    }
  },

  mounted() {
    // 代码中配置的utm数据
    Object.keys(config.utmData).forEach(item => {
      if (config.utmData[item]) {
        this.utmData[item] = config.utmData[item]
      }
    })
    // URL中的utm数据
    location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        let queryItem = item.split('=')
        this.query[queryItem[0]] = queryItem[1]
        if (item.match('utm_')) {
          this.utmData[queryItem[0]] = queryItem[1]
        }
      })

    if (this.query.from && !this.utmData.term) {
      this.utmData.term = 'wx_' + this.query.from
    }

    if (this.utmData.utm_source == '2018_youtoo365') {
      this.show66 = true
    }

    if (this.utmData.utm_medium == '2018_worldcupbaby') {
      this.isSoccerBaby = true
      document.title = '看世界的球 开共享的车'
    }
    if (this.utmData.utm_medium == '2018_monph') {
      this.isMofei = true
      document.body.style.backgroundColor = '#fff'
    }

    if (
      this.utmData.utm_campaign == 'new_user_online' &&
      this.utmData.utm_medium == 'cooperation'
    ) {
      this.validDays = 30
      this.deadline = '2018年7月26日'
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
      background-image: url('./img/slogon.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .coupon {
      width: 58%;
      margin: auto;
      margin-top: -4vw;
      margin-bottom: 0.5vw;
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
    &.soccer-baby {
      // background-image: url('./img/soccer-baby.png');
      // background-size: contain;
      // background-position: center top;
      // background-repeat: no-repeat;
      .slogon {
        // background-image: none;
        background-image: url('./img/soccer-baby.png');
      }
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

  &.mofei {
    background-color: #fff;
    .form-container {
      background-image: url('./img/bg-mofei.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top center;
      .slogon {
        visibility: hidden;
      }
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

@media screen and (min-width: 650px) {
  #app {
    max-width: 500px;
    margin: auto;
  }
  .main-page .form-container {
    height: 760px;
  }
  .main-page .form-container form .tel-input input {
    padding: 0 20px;
    height: 62px;
    font-size: 23px;
  }
  .main-page .form-container form .tel-input .flash {
    height: 62px;
    left: 113px;
    padding: 10px 0;
  }
  .main-page .form-container .coupon {
    margin-top: -20.6px;
    margin-bottom: 2.6px;
  }
  .main-page .form-container form .button-container {
    margin-top: 10.3px;
  }
  .main-page .form-container .arrow {
    width: 25px;
    margin: 15.5px auto 5px;
  }
  .main-page .to-top {
    bottom: 31px;
    right: 31px;
    width: 62px;
    padding: 10px;
  }
  .main-page .rules h3 {
    font-size: 18px;
  }
  .main-page .rules ul {
    font-size: 15px;
    margin: 5px 0 15px;
  }
}
</style>
