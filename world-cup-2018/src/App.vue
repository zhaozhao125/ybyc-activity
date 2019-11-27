<template>
  <div id="app">
    <v-join v-show="step==1" @next="handleJoinNext"></v-join>
    <v-choose v-show="step==2" @next="handleChooseNext"></v-choose>
    <v-rank v-show="step==3" :rankData="rankData" @refresh="handleRefreshRank"></v-rank>
  </div>
</template>

<script>
import vJoin from './pages/join/join'
import vChoose from './pages/choose/choose'
import vRank from './pages/rank/rank'
export default {
  name: 'App',
  components: {
    vJoin,
    vChoose,
    vRank
  },

  data() {
    return {
      step: 1,
      rankData: null
    }
  },

  created() {
    let user = this.$getUser()
    if (user) {
      console.log('====old to 3====')
      if (user.team_id) {
        this.getRank()
      } else {
        this.step = 2
      }
    }
  },

  watch: {
    step() {
      window.scrollTo(0, 0)
    }
  },

  methods: {
    handleJoinNext(param) {
      console.log('====param====', param)
      localStorage && localStorage.setItem('fifa2018UserId', JSON.stringify(param.user))
      window.wxShareData.link += ('?invite=' + param.user.user_id)
      this.$setUser(param.user)
      if (param.user.team_id) {
        this.getRank()
      } else {
        this.step = 2
      }
    },
    getRank() {
      this.$fetch('/fifa/get-own-rank', {
        userid: this.$getUser().user_id
      }).then(res => {
        console.log('====getRank====', res)
        if (res.code == 0) {
          this.rankData = res.data
          this.step = 3
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleChooseNext(param) {
      let user = this.$getUser()
      user.team_id = param.teamname
      localStorage && localStorage.setItem('fifa2018UserId', JSON.stringify(user))
      this.getRank()
    },
    handleRefreshRank() {
      this.getRank()
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-image: url('~@/assets/img/bg.png');
  background-size: contain;
}
img {
  width: 100%;
  height: auto;
}
ul {
  list-style: none;
}
</style>
