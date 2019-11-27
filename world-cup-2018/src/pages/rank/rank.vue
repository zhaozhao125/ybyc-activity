<template>
  <div class="rank" v-if="rankData">
    <div class="scoreboard" :class="{'fix-oppo': fixOppo}">
      <h1>组队助力世界杯瓜分百万红包</h1>
      <div class="team-rank">
        <div class="current-rank">
          <p>
            <strong>{{rankData.teamRank}}</strong>名</p>
          <p>当前排名</p>
        </div>
        <div class="country-info">
          <img :src="`static/flags/${rankData.team.team_en_name}.png`" alt="">
          <p>{{rankData.team.team_name}}</p>
        </div>
        <div class="current-money">
          <p>
            <strong>{{rankData.team.team_use_car_value}}</strong>元</p>
          <p>当前球队奖池</p>
        </div>
      </div>
      <div class="score-info">
        <div class="score-item">
          <p>
            <strong>{{rankData.team.team_user_nums}}</strong>人气</p>
          <img src="@/assets/img/icon-fans.png" alt="">
        </div>
        <div class="score-item">
          <p>
            <strong>{{rankData.team.team_use_car_value}}</strong>能量</p>
          <img src="@/assets/img/icon-car.png" alt="">
        </div>
        <div class="score-item">
          <p>
            <strong>{{rankData.team.team_support_value}}</strong>点赞</p>
          <img src="@/assets/img/icon-heart.png" alt="">
        </div>
      </div>
      <div class="cheer">
        <div class="car-cheer">
          <p>
            <strong>{{rankData.use_car_money}}</strong>
          </p>
          <p>累计用车</p>
          <div class="cheer-btn" @click="handleCheerCar">用车助威</div>
        </div>
        <div class="like-cheer">
          <p>
            <strong>{{rankData.support_value}}</strong>
          </p>
          <p>累计点赞</p>
          <div class="cheer-btn" @click="handleCheerLike">点赞助威</div>
        </div>
      </div>
      <div class="user-info">
        <img v-if="userImg" :src="userImg" alt="">
        <img v-else src="../../../static/logo.png" alt="">
        <p>我的贡献</p>
      </div>
    </div>
    <div class="invite-btn" @click.stop.prevent="handleInvite">
      <img src="@/assets/img/btn-invite.png" alt="">
    </div>
    <a href="#" class="show-rule" @click.prevent="ruleVisible=true">查看活动规则</a>
    <div class="rank-list">
      <div class="title">人气榜</div>
      <table :class="{'big-num': rankData.teams[0].team_rank > 99999}">
        <tr class="team-info" v-for="(item, index) in rankData.teams" :key="index">
          <td>
            <div class="country">
              <div class="coutry-rank-num">
                <img v-if="index==0" src="@/assets/img/gold-medal.png" alt="">
                <img v-else-if="index==1" src="@/assets/img/silver-medal.png" alt="">
                <span v-else>{{index+1}}</span>
              </div>
              <img class="flag-img" :src="`static/flags/${item.team_en_name}.png`" alt="">
              <span>{{item.team_name}}</span>
            </div>
          </td>
          <td>
            <div class="country-score">
              <div class="score-item">
                <p>{{item.team_support_value}}</p>
                <img src="@/assets/img/icon-heart.png" alt="">
              </div>
              <div class="score-item">
                <p>{{item.team_use_car_value}}</p>
                <img src="@/assets/img/icon-car.png" alt="">
              </div>
            </div>
          </td>
          <td>
            <div class="total-score">{{item.team_rank}}</div>
          </td>
        </tr>
      </table>
      <!-- <ul>
        <li v-for="(item, index) in rankData.teams" :key="index">
          <div class="team-info">
            <div class="country">
              <img :src="`static/flags/${item.team_en_name}.png`" alt="">
              <span>{{item.team_name}}</span>
            </div>
            <div class="country-score">
              <div class="score-item">
                <p>{{item.team_support_value}}</p>
                <img src="@/assets/img/icon-heart.png" alt="">
              </div>
              <div class="score-item">
                <p>{{item.team_use_car_value}}</p>
                <img src="@/assets/img/icon-car.png" alt="">
              </div>
            </div>
            <div class="total-score">{{item.team_rank}}</div>
          </div>
        </li>
      </ul> -->
    </div>
    <a class="latest-news" href="https://xw.qq.com/m/2018/ranking" target="_blank">查看最新赛况</a>
    <div class="share-cover" v-show="shareVisible" @click="shareVisible=false">
      <img src="@/assets/img/share-guide.png" alt="">
    </div>
    <div class="qrcode" v-show="qrVisible" @click="qrVisible=false">
      <img src="@/assets/img/qrcode.png" alt="">
    </div>
    <div class="rules" v-show="ruleVisible" @click="ruleVisible=false">
      <div class="close-rule">关闭</div>
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
    </div>
  </div>
</template>

<script>
import getBridge from '@/utils/bridge.js'
export default {
  props: ['rankData'],

  data() {
    return {
      bridge: null,
      shareVisible: false,
      qrVisible: false,
      ruleVisible: false,
      query: {},
      userImg: ''
    }
  },

  created() {
    getBridge().then(res => {
      this.bridge = res
    }).catch(err => {
      console.log('====err====', err)
    })
    location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        let queryItem = item.split('=')
        this.query[queryItem[0]] = queryItem[1]
      })
    if (this.query.code) {
      this.$fetch('https://h5.1byongche.com/api/weixin/userinfo/', {
        code: this.query.code
      }).then(res => {
        if (res.code == 0) {
          let result = res.data
          if (typeof result === 'string') {
            result = JSON.parse(result)
          }
          this.userImg = result.headimgurl
        }
      }).catch(err => {
        console.log('====err====', err)
      })
    }
    if (navigator.userAgent.match(/OPPO R9sk/i)) {
      this.fixOppo = true
    }
  },

  methods: {
    handleInvite() {
      if (this.bridge || window.WebViewJavascriptBridge) {
        console.log('====go bridge====')
        let url = 'https://h5.1byongche.com/activity/worldcup2018/redirect/'
        if (window.env == 'dev') {
          url = 'http://test.1byongche.cn/h5/activity/worldcup-2018/'
        }
        url = url + '?invite=' + this.$getUser().user_id
        this.bridge.callHandler('callShare', {
          url: url,
          shareTitle: '组队助力世界杯，瓜分百万红包',
          shareContent: '你负责世界杯的荣耀，我负责为荣耀发红包',
          shareImg: 'https://h5.1byongche.com/static/img/logo.png'
        })
      } else {
        console.log('====go wx share====')
        this.shareVisible = true
      }
    },
    handleCheerCar() {
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') != -1
      if (this.bridge) {
        this.$toast('用车就能为支持球队助力，快去用车吧')
      } else if (isWeixin) {
        this.qrVisible = true
      } else {
        window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche')
      }
    },
    handleCheerLike() {
      this.$fetch('/fifa/add-favor', {
        userid: this.$getUser().user_id
      }).then(res => {
        if (res.code == 0) {
          this.$toast(res.msg)
          if (!res.msg.match('今天已经助威过了')) {
            this.$emit('refresh')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.rank {
  .scoreboard {
    color: #0d3e79;
    text-align: center;
    position: relative;
    background-image: url('~@/assets/img/scene3-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    width: 96%;
    padding: 0 1vw;
    margin: auto;
    overflow: hidden;
    padding-bottom: 2vw;
    h1 {
      font-size: 5.3333vw;
      justify-content: space-around;
      width: 85%;
      margin: 6vw auto 0;
    }
    .team-rank {
      margin-top: 4vw;
      display: flex;
      justify-content: space-around;
      > div {
        flex: 1;
      }
      p {
        font-size: 3.2vw;
      }
      strong {
        font-size: 9.6vw;
      }
      .country-info {
        img {
          width: 19vw;
        }
        p {
          font-size: 4.2667vw;
        }
      }
    }
    .score-info {
      display: flex;
      justify-content: space-around;
      margin-top: 6vw;
      .score-item {
        flex: 1;
        margin-right: 1vw;
        p {
          font-size: 2.667vw;
        }
        strong {
          font-size: 5.8vw;
          margin-right: 0.5vw;
        }
        img {
          width: 4.3vw;
        }
      }
    }
    .cheer {
      display: flex;
      justify-content: space-between;
      width: 85%;
      margin: 13.3vw auto 0;
      color: #fff;
      p {
        font-size: 3.2vw;
      }
      strong {
        font-size: 7.4667vw;
      }
      .cheer-btn {
        background-image: linear-gradient(-180deg, #f9f3d3 0%, #dbc799 100%);
        box-shadow: 0 2px 4px 0 rgba(11, 5, 5, 0.5);
        border-radius: 91.95px;
        padding: 0 4.2vw;
        font-size: 3.2vw;
        color: #97161a;
        line-height: 6.933vw;
        margin-top: 2vw;
      }
    }
    .user-info {
      position: absolute;
      left: 0;
      right: 0;
      top: 72%;
      margin: auto;
      text-align: center;
      width: 17vw;
      img {
        width: 13.33vw;
        border-radius: 50%;
      }
      p {
        border: 1px solid #ffffff;
        line-height: 5.6vw;
        font-size: 3.2vw;
        color: #fff;
      }
    }
    &.fix-oppo {
      .team-rank {
        margin-top: 8vw;
      }
    }
  }
  .invite-btn {
    width: 90%;
    margin: 2vw auto 0;
  }
  .rank-list {
    color: #ffffff;
    width: 93%;
    margin: 3vw auto;
    font-size: 3.7333vw;
    .title {
      font-size: 3.7333vw;
    }
    // ul {
    //   margin-top: 3.5vw;
    // }
    // li:last-of-type .team-info {
    //   border: 0;
    // }
    table {
      width: 100%;
      &.big-num {
        .team-info .total-score {
          font-size: 4vw;
        }
      }
    }
    .team-info {
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      height: 20vw;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      .country {
        display: flex;
        align-items: center;
        flex: 2;
        .coutry-rank-num {
          width: 5vw;
          margin-right: 2vw;
          text-align: center;
        }
        .flag-img {
          width: 10vw;
          margin-right: 1vw;
        }
      }
      .country-score {
        display: flex;
        flex: 2;
        margin-left: 2vw;
        margin-right: 2vw;
        .score-item {
          flex: 1;
          margin-right: 1vw;
          text-align: center;
          img {
            width: 4vw;
          }
        }
      }
      .total-score {
        text-align: right;
        flex: 1;
        font-size: 6vw;
      }
    }
  }
  .latest-news {
    font-size: 14px;
    color: #c8c8c8;
    text-align: center;
    padding: 4vw;
    display: block;
    text-decoration: none;
  }
  .share-cover {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    img {
      width: 200px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .qrcode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
    }
  }
  .show-rule {
    display: block;
    text-align: center;
    color: #fff;
    opacity: 0.5;
    font-size: 3.8vw;
  }
  .rules {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    font-size: 3.2vw;
    color: #d6c190;
    line-height: 5.333vw;
    padding: 5vw;
    .close-rule {
      text-align: right;
      font-size: 4.5vw;
      margin-bottom: 2vw;
    }
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
