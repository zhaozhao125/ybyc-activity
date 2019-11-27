<template>
  <div class="main-page">
    <div class="form-container" id="form">
      <div class="slogon"></div>
      <div class="coupon">
        <img src="./img/coupon.png" alt="">
      </div>
      <form>
        <div class="tel-input">
          <input type="tel" v-model="userTel" placeholder="请输入手机号码" :class="{valid: telValid}">
          <div class="flash" v-if="!userTel"></div>
        </div>
        <div class="button-container">
          <!-- <img src="./img/button1-disabled.png" v-show="!telValid" alt="" class="submit-btn btn-disabled"> -->
          <img @click.prevent="handleClickBtn" src="./img/button1-active.png" alt="" class="submit-btn btn-active">
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
      <h3>领取须知：</h3>
      <ul>
        <li>本礼包新老用户皆可领取，输入手机号码后点击领取即可</li>
        <li>新用户领取的同时，注册成为一步用车用户</li>
        <li>客服电话400-111-1818</li>
        <li>版权归河南一步用车科技有限公司所有</li>
      </ul>
    </div>
    <div class="footer">
      <img src="./img/footer.png" alt="">
    </div>
    <img class="to-top" @click.prevent="handleBackToTop" src="./img/to-top.png" alt="">
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui'
import config from '../config.js'
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
      deadline: '2018年10月31日'
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
        // xmlhttp.open("POST", "http://101.132.26.45:8085/invite/regist-coupons.html", true)
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
        this.sendData({
          phone: this.userTel,
          activity_code: config.activeCode,
          certkey: config.certkey,
          ...this.utmData
        })
          .then(res => {
            if (res.code == 0) {
              let message = '领取成功'
              if(res.msg == '用户已达到最大领取次数'){
                message = '已领取过，不能重复领取'
              }else if(res.msg != '领取成功'){
                message = res.msg
                Toast({
                  message: message,
                  duration: 4000
                })
                return
              }
              Toast({
                message: message,
                position: 'bottom',
                duration: 4000
              })
              this.user = {
                tel: this.userTel
              }
              this.$emit('nextPage', 'newUser')
            } else if (res.code == -1) {
              this.$emit('nextPage', 'oldDriver')
            }
          })
          .catch(e => {
            Toast({
              message: '网络请求出错，请重试'
            })
          })
      } else {
        Toast('请输入正确的手机号')
      }
    },
    handleBackToTop() {
      this.$el.querySelector('.form-container').scrollIntoView({
        behavior: 'smooth'
      })
    }
  },

  watch: {
    userTel(newVal) {
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
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    background-image: url('./img/bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center top;
    .slogon {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      // background-image: url('./img/slogon.png');
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
