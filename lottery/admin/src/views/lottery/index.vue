<template>
  <div class="lottery-page" v-loading="loading" element-loading-text="正在读取数据，请稍后...">
    <div class="bg-wrapper"></div>
    <div class="lottery-wrapper">
      <div class="top-title"></div>
      <div class="content" v-show="!showResult && !ended">
        <div class="user-list">
          <h3>当前参与人数</h3>
          <h4>
            <span>{{getJoinCount()}}</span>人
          </h4>
          <div class="user-pool-container" v-show="!running || (running && randomIndexList)">
            <div class="user-pool">
              <ul v-if="users">
                <li v-for="(user, index) in users" :key="index" v-if="user" v-html="hideTel(user)">
                  <!-- {{user.phone | telFilter}} -->
                </li>
              </ul>
            </div>
          </div>
          <!-- <div class="lottery-box" v-if="running && randomIndexList">
            <ul>
              <li v-for="(item, index) in randomIndexList" :key="index">
                <span v-if="users[item]">
                  {{users[item].phone | telFilter}}
                </span>
              </li>
            </ul>
          </div> -->
        </div>
        <div class="prize-container" v-if="lottery && currentPrize">
          <div class="prize">
            <div class="prize-info">
              <img :src="baseURL + currentPrize.imgurl[0]" alt="">
              <p>{{currentPrize.prizeContent}}</p>
            </div>
            <div class="prize-content" v-if="currentPrize">
              <h3>
                <span v-if="currentPrize.level != 9">{{chineseNumber[currentPrize.level]}}等奖</span>
                <span v-else>暖场奖</span>
                奖品：
              </h3>
              <p>{{currentPrize.prizeTitle}} x {{currentPrize.number}}名</p>
            </div>
          </div>
          <a href="#" class="start-btn primary-btn" @click.prevent.stop="handleClickBtn">
            <span v-if="running">停，就是你们了！</span>
            <span v-else>翻滚吧，票箱！</span>
          </a>
        </div>
      </div>
      <div class="result-container" v-if="showResult || ended">
        <div class="current-winner" v-if="showResult && currentPrize">
          <div class="winner-list" :class="{'too-much': currentWinner.length > 10, 'not-too-much': (currentWinner.length <= 10 && currentWinner.length > 5), 'little': currentWinner.length <= 5}">
            <div v-for=" (winner, index) in currentWinner" :key="index" v-html="hideTel(winner)"></div>
            <div v-if="currentWinner.length > 5 && currentWinner.length%3"></div>
            <div v-if="currentWinner.length > 5 && currentWinner.length%3==1"></div>
          </div>
          <p v-if="currentWinner.length>1">恭喜以上用户获得</p>
          <p v-if="currentWinner.length==1">恭喜该用户获得</p>
          <h3>{{currentPrize.prizeTitle}}</h3>
          <a href="#" class="primary-btn next-btn" @click.prevent.stop="nextLottery">确认过眼神，你就是对的人</a>
          <div class="single-btns">
            <a href="#" class="primary-btn reset-btn" @click.prevent.stop="showResetLottery">重抽此项</a>
          </div>
        </div>
        <div class="final-result" v-if="ended">
          <h3>所有奖项已抽取完毕</h3>
          <h4>请获得一等奖的中奖人员，前往外场对应展区兑奖</h4>
          <h5>一等奖（{{lottery.prizes[0].prizeTitle}}）</h5>
          <!-- <pre>{{lottery}}</pre> -->
          <div class="big-winners">
            <p v-for="(item, index) in lottery.prizes[0].winners" :key="index" v-html="hideTel(item)"></p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="重新抽取" :visible.sync="dialogVisible" width="760px">
      <div class="reset-lottery" style="font-family: monospace">
        <el-checkbox-group v-model="checkedWinners">
          <el-checkbox v-for="(item, index) in currentWinner" :label="item._id" :key="index" v-if="item">{{item.phone | telFilter}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetLottery">重抽</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import baseURL from '@/config/base-url.js';
window.requestAnimationFrame = (function(){
  return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function randomSort(a, b) { return Math.random() > 0.5 ? -1 : 1; }
let lotteryStarted = false // 抽奖开始（第一次开始抽的时候为true）
export default {

  name: 'startLottery',

  data() {
    return {
      lotteryCode: '', // 抽奖活动编号
      users: [], // 当前奖池用户
      randomIndexList: [], // 随机数组
      lotteryTimer: null, // 开始抽奖时定时随机计时器
      userTimer: null, // 轮询获取用户计时器
      lottery: {}, // 当前抽奖活动
      running: false, // 开始抽奖
      joinCount: 0, // 当前参与人数
      prizeList: null, // 未抽的奖品列表
      currentPrize: null, // 当前奖项
      chineseNumber: [
        '特',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ],
      showResult: false, // 查看当前抽奖结果
      ended: false, // 抽奖完成
      currentWinner: [], // 当前奖项获奖者
      loadStep: 0, // 数据加载完成度
      loading: true,
      allWinners: [], // 所有获奖者的数据
      baseURL: baseURL,
      tmpWinner: [],
      singleLotteryMode: false, // 是否单次抽奖人数过多，进入单次多抽模式
      maxRandom: 60, // 单次抽奖最多人数
      currentPrizeTmpWinners: [], // 单项奖超过单次最多抽奖人数时，临时存放中奖用户
      checkedWinners: [], // 重抽选择的用户
      dialogVisible: false,
      resetCount: 0, // 重抽数量
      ybUsers: [],
      sjUsers: [],
      xhUsers: [],
      shUsers: []
    }
  },

  created() {
    this.lotteryCode = this.$route.query.lotteryCode
    // 获取奖池用户
    this.$service.findAllUser(this.lotteryCode).then(res => {
      let result = res.data
      if (result.success) {
        this.users = result.data
        this.joinCount = result.data.length
        this.loadStep++
      }
      setTimeout(() => {
        this.autoScrollPool()
      }, 500)
      setTimeout(() => {
        this.getLastetUsers()
      }, 10000)
    })
    // 获取抽奖活动详情
    this.$service.findActiveLottery(this.lotteryCode).then(res => {
      let result = res.data
      if (result.success) {
        if (!result.data.length) {
          this.ended = true
        }
        this.lottery = result.data[0]
        this.loadStep++
      }
      setTimeout(() => {
        this.freshPrize()
        if (!this.currentPrize) {
          this.ended = true
        }
      }, 10)
    })
  },

  watch: {
    loadStep(step) {
      if (step === 2) {
        if(!this.ended){
          this.checkOldWinner()
        }
        this.loading = false
      }
    }
  },

  mounted() {
    window.addEventListener('keyup', this.handleKeyUp, false)
    setTimeout(() => {
      if (window.innerWidth / window.innerHeight > 1.69) {
        this.$el.classList.add('narrow')
      }
      if (window.innerWidth / window.innerHeight > 2.9) {
        this.$el.classList.add('super-narrow')
      }
    }, 500)

  },

  filters: {
    telFilter(phone){
      return phone.substr(0, 3) + '海马EV' + phone.substr(-4, 4)
    }
  },

  methods: {
    getJoinCount(){
      return Math.max(this.joinCount, 601)
    },
    handleKeyUp(e){
      if (e.keyCode === 32) {
        if (this.showResult) {
          this.nextLottery()
        } else {
          this.handleClickBtn()
        }
      }
    },
    freshPrize(){
      this.prizeList = this.lottery.prizes.filter(item => {
        return item.prizeState === 0
      })
      this.currentPrize = (this.prizeList && this.prizeList.length) ? this.prizeList[this.prizeList.length - 1] : null
    },
    // 轮询获取进入奖池的用户
    getLastetUsers(){
      if(this.ended || lotteryStarted){
        return
      }
      console.log('====go1====')
      this.$service.findAllUser(this.lotteryCode).then(res => {
        if(this.ended || lotteryStarted){
          return
        }
        console.log('====go2====', this.ended, lotteryStarted)
        let result = res.data
        if (result.success) {
          this.users = result.data
          this.joinCount = result.data.length
        }
        this.userTimer = setTimeout(() => {
          if(!lotteryStarted){
            console.log('====go3====', lotteryStarted)
            this.getLastetUsers()
          }
        }, 10000)
      })
    },
    // 刷新页面后过滤掉已经抽过奖的用户
    checkOldWinner() {
      if (!this.lottery) {
        return
      }
      if (this.lottery.prizes.some(item => item.winners.length > 0)) {
        let oldWinners = []
        this.lottery.prizes.forEach(item => {
          if (item.winners.length > 0) {
            oldWinners = oldWinners.concat(item.winners)
          }
        })
        this.users = this.users.filter(item => {
          return !oldWinners.some(winner => {
            return winner._id === item._id
          })
        })
      }
    },
    hideTel(winner) {
      let phone = winner.phone
      let reset = ''
      if (winner.isReset) {
        reset = '<small>·补抽</small>'
      }
      return phone.substr(0, 3) + '<span class="hide-phone">海马EV</span>' + phone.substr(-4, 4) + reset
    },
    getImgUrl(img) {
      return this.$service.fileService.getImgUrl(img)
    },
    // 自动滚动奖池手机号
    autoScrollPool() {
      let $pool = this.$el.querySelector('.user-pool')
      let scrollStep = 1
      let timer = setInterval(() => {
        window.requestAnimationFrame(()=>{
          if (!$pool) {
            return
          }
          if ($pool.clientHeight + $pool.scrollTop === $pool.scrollHeight) {
            scrollStep = 0
            $pool.scrollTop = 0
          }
          scrollStep = scrollStep + (this.running?30:1)
          $pool.scrollTop = scrollStep
        })
      }, 30)
    },
    /**
     * 获取随机数据
     * length: 总长度
     * count:  生成随机数组的长度
     */
    getRandomIndex(length, count) {
      let n = count
      let ret = {}
      let repeat = 0
      while (n) {
        let random = Math.floor(Math.random() * length)
        if (!ret[random]) {
          ret[random] = true
          n--
        } else {
          repeat++
        }
        if (repeat > 100) {
          console.log('random index too much~!!!')
          let arr = []
          for (let index = 0; index < count; index++) {
            arr.push(index)
          }
          return arr
          n = 0
        }
      }
      return Object.keys(ret)
    },
    // 开始抽奖
    startLottery() {
      console.log('====start====')
      if (!this.currentPrize) {
        return
      }
      let userLength = this.users.length
      if (!userLength || userLength < 1) {
        this.$message({
          message: '参与人数过少',
          type: 'error'
        })
        return
      }
      if (userLength < this.currentPrize.number - this.allWinners.length) {
        this.$message({
          message: '参与人数小于中奖人数',
          type: 'error'
        })
        return
      }
      if(this.userTimer){
        clearTimeout(this.userTimer)
        this.userTimer = null
      }
      lotteryStarted = true
      let lotteryNumber // 当前抽取的数量
      // 如果当前奖项数量大于设置的最大数量，则该奖项分多次抽取
      if (this.currentPrize.number > this.maxRandom) {
        this.singleLotteryMode = true
        let diff = this.currentPrize.number - this.currentPrizeTmpWinners.length
        if (diff > this.maxRandom) {
          lotteryNumber = this.maxRandom
        } else {
          lotteryNumber = diff
        }
      } else {
        lotteryNumber = this.currentPrize.number
      }
      this.running = true
      this.randomIndexList = this.getRandomIndex(userLength, lotteryNumber)
      this.lotteryTimer = setInterval(() => {
        this.randomIndexList = this.getRandomIndex(userLength, lotteryNumber)
      }, 300)
    },
    stopLottery() {
      this.running = false
      clearInterval(this.lotteryTimer)
      let winnerList = this.randomIndexList.map(item => {
        if (this.resetCount) {
          this.users[item].isReset = true
        }
        return this.users[item]
      })

      if (this.resetCount) {
        if (this.singleLotteryMode) {
          this.currentPrizeTmpWinners = this.currentPrizeTmpWinners.concat(winnerList)
        }
        this.currentWinner = this.currentWinner.concat(winnerList)
        this.resetCount = 0
      } else {
        this.currentWinner = winnerList
        if (this.singleLotteryMode) {
          this.currentPrizeTmpWinners = this.currentPrizeTmpWinners.concat(this.currentWinner)
        }
      }
      this.allWinners = this.allWinners.concat(winnerList)
      setTimeout(() => {
        this.users = this.users.filter(item => {
          return !winnerList.some(winner => {
            return winner._id === item._id
          })
        })
      }, 10)

      this.showResult = true
    },
    nextLottery() {
      let prizeId = this.currentPrize._id
      if (this.singleLotteryMode && this.currentPrizeTmpWinners.length == this.currentPrize.number) {
        this.singleLotteryMode = false
        let winners = JSON.stringify(this.currentPrizeTmpWinners)
        this.currentPrize.winners = this.currentPrizeTmpWinners.concat([])
        this.currentPrizeTmpWinners = []
        this.$service.setLotteryWinner(this.lottery._id, prizeId, winners).then(res => {})
        localStorage.setItem('lottery', JSON.stringify(this.lottery))
      } else if (!this.singleLotteryMode) {
        let winners = JSON.stringify(this.currentWinner)
        this.currentPrize.winners = this.currentWinner.concat([])
        this.$service.setLotteryWinner(this.lottery._id, prizeId, winners).then(res => {})
        localStorage.setItem('lottery', JSON.stringify(this.lottery))
      }

      this.showResult = false
      if (this.singleLotteryMode) {
        return
      }
      this.currentPrize.prizeState = 1
      this.freshPrize()
      if (!this.currentPrize) {
        this.ended = true
      }
      // 若当前为一等奖，则批量发放二等奖优惠券
      setTimeout(() => {
        if(this.currentPrize && this.currentPrize.level == 1){
          let phones = this.lottery.prizes[1].winners.map(item => item.phone).join(',')
          this.$service.sendCouponBatch(phones).then(res => {
          })
        }
      }, 50)
    },
    // 重新抽此项，只用于单个模式
    showResetLottery() {
      this.$confirm('确定重新抽此项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = true
      }).catch(() => {

      })
    },
    handleResetLottery() {
      if (!this.checkedWinners.length) {
        this.$message({
          message: '没有选择',
          type: 'warning'
        })
        return
      }
      this.resetCount = this.checkedWinners.length
      if (this.singleLotteryMode) {
        this.currentWinner = this.currentWinner.filter(item => !this.checkedWinners.some(id => id == item._id))
        this.currentPrizeTmpWinners = this.currentPrizeTmpWinners.filter(item => {
          return !this.checkedWinners.some(id => id == item._id)
        })
      } else {
        this.currentWinner = this.currentWinner.filter(item => !this.checkedWinners.some(id => id == item._id))
      }
      this.dialogVisible = false
      this.checkedWinners = []
      this.showResult = false
      this.running = true
      this.randomIndexList = this.getRandomIndex(this.users.length, this.resetCount)
      this.lotteryTimer = setInterval(() => {
        this.randomIndexList = this.getRandomIndex(this.users.length, this.resetCount)
      }, 300)
    },
    handleClickBtn() {
      if (!this.running) {
        this.startLottery()
      } else {
        this.stopLottery()
      }
    }
  },

  beforeDestroy(){
    window.removeEventListener('keyup', this.handleKeyUp, false)
    if(this.lotteryTimer){
      clearInterval(this.lotteryTimer)
      this.lotteryTimer = null
    }
    if(this.userTimer){
      clearTimeout(this.userTimer)
      this.userTimer = null
    }
  }
};

</script>
<style lang="scss">
html {
  font-size: 16px;
}

.lottery-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  background: linear-gradient(to bottom, #0c5394 0%, #00386a 100%);
  ul {
    list-style-type: none;
  }
  .bg-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    // background-image: url('~@/assets/img/lottery-bg.png');
    background-image: url('~@/assets/img/bg-wide.png');
    background-size: cover;
    background-position: center;
  }
  .logo {
    img {
      position: absolute;
      width: 13rem;
      display: block;
      left: 4%;
      top: 3%;
      z-index: 9;
    }
  }
  .primary-btn {
    display: block;
    width: 100%;
    height: 6rem;
    border-radius: 5rem;
    overflow: hidden;
    background: #fdd000; // box-shadow: 0 0 1rem rgba(0, 0, 0, .3);
    text-decoration: none;
    line-height: 6rem;
    text-align: center;
    color: #3d3d3d;
    font-size: 2.5rem;
  }
  .hide-phone {
    font-size: 0.8em;
    vertical-align: baseline;
    color: #b8d6f1;
    margin: 0 0.5rem;
    position: relative;
    bottom: 0.1em;
  }
  .lottery-wrapper {
    position: absolute; // max-width: 1280px;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    color: #fff;
    padding: 3% 5% 2%;
    display: flex;
    flex-direction: column;
    .top-title {
      height: 22%;
    }
    .title {
      text-align: center;
      h1 {
        font-weight: normal;
        font-size: 4rem;
        margin-top: 1rem;
        margin-bottom: 0;
      }
      h2 {
        font-weight: normal;
        font-size: 2.5rem;
        margin-bottom: 4rem;
      }
    }
    .content {
      flex: 1;
      display: flex;
      overflow: hidden;
      max-width: 95rem;
      margin: 0 auto;
      width: 100%;
      .user-list {
        flex: 1;
        max-width: 41rem;
        margin-left: 5%;
        margin-right: 4%;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 0.5rem;
        overflow: hidden;
        text-align: center;
        display: flex;
        flex-direction: column;
        h3 {
          font-weight: normal;
          margin-bottom: 0;
          font-size: 2rem;
        }
        h4 {
          margin-top: 1rem;
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: normal;
          span {
            font-size: 5rem;
            font-weight: bold;
            color: #fff;
          }
        }
        .user-pool-container {
          flex: 1;
          font-size: 2.5rem;
          margin-top: 1rem;
          margin-bottom: 2.5rem;
          overflow: hidden;
          position: relative;
          line-height: 1.5;
          font-family: monospace;
          .user-pool {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        }
        .lottery-box {
          flex: 1;
          font-size: 2.5rem;
          overflow: hidden;
          display: flex;
          // padding-bottom: 15%;
          ul {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            margin-top: 0;
          }
          li {
            letter-spacing: 0.3rem;
            margin-bottom: 0.8rem;
          }
        }
      }
      .prize-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .prize {
          display: flex;
          .prize-info {
            text-align: center;
            img {
              width: 12rem;
            }
            p {
              font-size: 2rem;
              margin: 1rem 0;
              max-width: 30rem;
            }
          }
          .prize-content {
            flex: 1;
            margin-left: 7%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            h3 {
              font-size: 3rem;
              font-weight: normal;
              margin-bottom: 1rem;
              margin-top: 0rem;
            }
            p {
              font-size: 2.2rem;
            }
          }
        }
        .start-btn {
          max-width: 35rem;
          margin: 2rem auto;
        }
      }
    }
    .result-container {
      // background: #125696;
      // box-shadow: 0 0 3rem rgba(0, 0, 0, .4);
      border-radius: 0.5rem;
      overflow: hidden;
      text-align: center;
      flex: 1;
      padding-top: 2rem;
      padding-bottom: 1rem;
      display: flex;
      .current-winner {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        .winner-list {
          font-size: 3rem;
          flex: 1;
          align-items: center;
          justify-content: center;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          overflow: auto;
          font-family: monospace;
          &.not-too-much {
            flex-direction: column;
          }
          &.too-much {
            font-size: 2.5rem;
            > div {
              width: 25%;
            }
          }
          &.little {
            flex-direction: column;
            font-size: 4rem;
          }
          > div {
            margin-bottom: 1rem;
          }
          small {
            font-size: 0.6em;
            vertical-align: middle;
          }
        }
        p {
          font-size: 2rem;
          margin: 1rem 0 0;
        }
        h3 {
          font-size: 3rem;
          margin: 0.5rem 0 1rem;
          font-weight: normal;
        }
        .next-btn {
          max-width: 30rem;
          margin: 0 auto;
          font-size: 2rem;
          height: 4rem;
          line-height: 4rem;
          border-radius: 0.3rem;
        }
        .single-btns {
          position: absolute;
          right: 0.3125rem;
          bottom: 0;
          .finish-btn {
            width: 8rem;
            margin: 0 auto 1rem;
            font-size: 1rem;
            height: 2em;
            line-height: 2em;
            border-radius: 0.3rem;
          }
          .reset-btn {
            width: 8rem;
            margin: 0 auto 1rem;
            font-size: 1rem;
            height: 2em;
            line-height: 2em;
            border-radius: 0.3rem;
          }
        }
      }
      .final-result {
        width: 100%;
        display: flex;
        flex-direction: column;
        h3 {
          font-size: 3rem;
          margin-bottom: 0;
        }
        h4 {
          font-size: 2.2rem;
          margin: 1.5rem 0 0.5rem;
        }
        h5 {
          font-size: 2em;
          margin-bottom: 0.2em;
        }
        .big-winners {
          font-size: 1.8em;
        }
        .final-winners {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          .winner-col {
            flex: 1;
            ul {
              list-style: none;
            }
            .winner-container {
              h4 {
                margin: 3rem 0 1.5rem;
              }
              li {
                font-size: 2.8rem;
                margin-bottom: 1.5rem;
              }
            }
          }
        }
      }
      .special-prize {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-bottom: 5rem;
        h3 {
          font-size: 5rem;
          margin: 2rem 0;
        }
        p {
          font-size: 2.5rem;
          margin: 0.5rem 0;
          span {
            font-size: 5rem;
            font-weight: bold;
            vertical-align: middle;
            color: #fdd000;
          }
        }
        .download-app {
          font-size: 2rem;
          margin-top: 2rem;
        }
      }
    }
  }
}

.reset-lottery {
  .el-checkbox {
    margin-left: 1.875rem;
  }
}

@media screen and (max-height: 500px) {
  html {
    font-size: 6px;
  }
  .lottery-page .lottery-wrapper {
    padding: 3% 5% 1%;
  }
  .lottery-page .primary-btn {
    height: 4rem;
    line-height: 4rem;
  }
  .lottery-page .lottery-wrapper .content .prize-container .start-btn {
    margin: 0.5rem auto 3rem;
  }
  .lottery-page .lottery-wrapper .content {
    max-width: 60rem;
  }
  .lottery-page ul {
    padding: 0;
  }
  .lottery-page .lottery-wrapper .content .user-list h4 {
    margin-top: 0rem;
    margin-bottom: 0rem;
  }
  .lottery-page .lottery-wrapper .content .user-list .user-pool-container {
    margin-bottom: 0.5rem;
  }
  .lottery-page
    .lottery-wrapper
    .content
    .prize-container
    .prize
    .prize-info
    img {
    width: 6rem;
  }
  .lottery-page .lottery-wrapper .result-container {
    width: 60rem;
    margin: auto;
    padding-top: 1rem;
    padding-bottom: 0rem;
  }
  .lottery-page .lottery-wrapper .result-container .current-winner h3 {
    margin: 0 0 0.5rem;
  }
  .lottery-page .lottery-wrapper .result-container .current-winner .next-btn {
    max-width: 16rem;
    height: 3rem;
    line-height: 3rem;
  }
}
</style>
