<template>
  <div class="join">

    <div class="top-copy">
      <img src="@/assets/img/scene1-copy.png" alt="">
    </div>

    <div class="form">
      <div class="copy-container">
        <p>你能获得</p>
        <p>
          <strong>&nbsp;???</strong>元</p>
        <p>
          <small>决赛结束后揭晓</small>
        </p>
      </div>
      <div class="input-container">
        <input v-model="tel" type="tel" placeholder="输入手机号，应援心爱球队">
        <div class="submit-btn" @click.stop.prevent="handleSubmit">
          <img src="@/assets/img/btn-join.png" alt="">
        </div>
        <p>新用户参与活动立领55元优惠券</p>
      </div>
    </div>

    <div class="rules">
      <div class="rule">
        <h5>活动规则：</h5>
        <ul>
          <li>所有用户均有权利参与一步世界杯活动，为自己喜爱的球队助威呐喊。</li>
          <li>可以通过开车、点赞、邀请好友等方式为喜爱的球队增加“人气值”。</li>
          <li>获得人气值最高的球队，将瓜分该球队下所有用车实付金额（不含优惠券）。</li>
          <li>支持喜爱的球队如果获得冠军，支持该队每人获得100元冠军优惠券包。</li>
        </ul>
      </div>
      <div class="rule">
        <h5>注意：</h5>
        <ul>
          <li>用户一旦选择支持的球队后，中途不允许修改，最后选择时间为7月4日。</li>
          <li>自6月14日起，所有开车产生费用等额将计入能量值，为支持球队增加能量值。</li>
          <li>在活动页面助威可增加助威值，每人每天可为支持球队助威1次，获得5个助威值。</li>
          <li>在活动页面为自己喜爱的球队助威，选择该支球队，即为该球队贡献10个助威值。</li>
          <li>人气值（能量值 + 助威值 ）最高的球队瓜分能量值，将以红包的方式返回。</li>
          <li>点赞助威次数低于7次不参与瓜分红包。</li>
        </ul>
      </div>
    </div>`
  </div>
</template>

<script>
export default {
  data() {
    return {
      tel: '',
      query: {}
    }
  },

  created() {
    location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        let queryItem = item.split('=')
        this.query[queryItem[0]] = queryItem[1]
      })
  },

  methods: {
    handleSubmit() {
      console.log('====tel====', this.tel)
      let param = {
        newphone: this.tel,
        utm_campaign: 'new_user_online',
        utm_medium: '2018_worldcup',
        certkey: '0p/9olsdfa3#da'
      }
      if (this.query.invite) {
        param.uid = this.query.invite
      }
      this.$fetch('/user/fifa-invite-new-user', param).then(res => {
        console.log('====res====', res)
        if (res.errCode == 0) {
          this.$emit('next', {
            type: 'new-user',
            user: res.data
          })
        } else {
          if (res.errMsg == '用户已经注册') {
            this.$emit('next', {
              type: 'old-user',
              user: res.data
            })
          } else {
            this.$toast(res.errMsg)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.join {
  .top-copy {
    width: 90%;
    margin: 3vw auto 0;
  }
  .form {
    width: 100%;
    height: 107vw;
    background-image: url('~@/assets/img/scene1-formbg.png');
    background-size: cover;
    position: relative;
    overflow: hidden;
    .copy-container {
      text-align: center;
      margin-top: 9vw;
      color: #510207;
      font-size: 5.33333vw;
      strong {
        font-size: 12.8vw;
        line-height: 12vw;
      }
      small {
        font-size: 3.2vw;
      }
      p:last-of-type {
        margin-top: -1vw;
      }
    }
    .input-container {
      position: absolute;
      width: 80%;
      bottom: 16vw;
      left: 0;
      right: 0;
      margin: auto;
      input {
        margin: 0;
        padding: 0 4vw;
        border: none;
        display: block;
        width: 100%;
        height: 12vw;
        color: #fff;
        background-color: transparent;
        border-radius: 5.8666666vw;
        border: 1px solid #fff;
        text-align: center;
        font-size: 4.6vw;
        outline: none;
        &::-webkit-input-placeholder {
          color: #fff;
        }
        &:focus::-webkit-input-placeholder {
          opacity: 0;
        }
      }
      .submit-btn {
        width: 100%;
        margin-top: 4vw;
      }
      p {
        color: #fff;
        opacity: 0.6;
        text-align: center;
        font-size: 3.2vw;
      }
    }
  }
  .rules {
    font-size: 3.2vw;
    color: #d6c190;
    line-height: 5.333vw;
    width: 86%;
    margin: 3vw auto;
    .rule {
      margin-bottom: 5vw;
      &:first-of-type {
        ul {
          list-style: decimal;
        }
      }
      &:last-of-type {
        ul {
          list-style: lower-latin;
        }
      }
    }
    h5 {
      font-size: 3.2vw;
      margin-bottom: 1vw;
    }
    ul {
      padding-left: 4vw;
    }
    li {
      margin-bottom: 1vw;
      font-size: 3.2vw;
    }
  }
}
</style>
