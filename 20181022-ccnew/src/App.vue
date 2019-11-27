<template>
  <div id="app">
    <mainPage v-show="!nextPage" @nextPage="handleNextPage"></mainPage>
    <oldDriver v-show="nextPage && isOldDriver" :couponSuccess="couponSuccess"></oldDriver>
    <successPage v-show="nextPage && isNewUser"></successPage>
  </div>
</template>
<script>
import mainPage from './components/main-page.vue'
import oldDriver from './components/old-driver.vue'
import successPage from './components/success-page.vue'
import config from './config.js'
export default {
  name: 'app',

  components: {
    mainPage,
    oldDriver,
    successPage
  },

  data() {
    return {
      nextPage: false,
      isOldDriver: false,
      isNewUser: false,
      utmData: {},
      couponSuccess: false
    }
  },

  methods: {
    handleNextPage(msg) {
      this.nextPage = true
      if (msg == 'newUser') {
        this.isNewUser = true
      } else {
        if(msg == 'oldDriver'){
          this.couponSuccess = true
        }
        this.isOldDriver = true
      }
    }
  },

  mounted() {
    location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        if (item.match('utm_')) {
          let utmItem = item.split('=')
          this.utmData[utmItem[0]] = utmItem[1]
        }
      })
  }
}
</script>
<style lang="scss">
@import './assets/scss/global.scss';
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background-color: $color-yellow;
}

body > a {
  display: none;
}

img {
  display: block;
  width: 100%;
  height: auto;
  margin: auto;
}

#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
