<template>
  <div id="app">
    <mainPage v-show="!nextPage" :activityData="activityData" :utmData="utmData" @nextPage="handleNextPage"></mainPage>
    <oldDriver v-show="nextPage && isOldDriver"></oldDriver>
    <successPage v-show="nextPage && isNewUser"></successPage>
  </div>
</template>
<script>
import mainPage from './components/main-page.vue'
import oldDriver from './components/old-driver.vue'
import successPage from './components/success-page.vue'
import config from './config.js'
import {fetch} from './utils/util'
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
      activityData: {},
      utmData: {}
    }
  },

  methods: {
    getData(){
      this.activityData = {
        "id": 1211,
        "activityRegisterId": 12,
        "activitySn": "20181234554321",
        "utmSource": null,
        "utmContent": null,
        "utmTerm": null,
        "activityUrl": null,
        "activityQrCodeUrl": null,
        "name": "线下车贴活动",
        "utmCampaign": "new_user",
        "utmMedium": "car_paster",
        "couponsFaceValue": 66,
        "userRoleId": 1,
        "userRoleName": "老师",
        "pictureBannerTopUrl": "http://xxx/activity/register/201812345/pictureBannerTopUrl.png",
        "pictureSuccessUrl": "http://xxx/activity/register/201812345/pictureSuccessUrl.png",
        "shareTitle": "邀请XXX",
        "shareContent": "XXXXXXXXXXXXXXX",
        "notices": [
            "第一条","第二条"
        ]
      }
      this.utmData = {
        utmCampaign: this.activityData.utmCampaign,
        utmMedium: this.activityData.utmMedium,
        utmSource: this.activityData.utmSource,
        utmContent: this.activityData.utmContent,
        utmTerm: this.activityData.utmTerm
      }
      this.$sa.track('activityRegistePageOpen', {
        ...this.utmData,
        activityRegisteName: this.activityData.name
      })
      if(window.wxShareData){
        window.wxShareData.title = this.activityData.shareTitle
        window.wxShareData.desc = this.activityData.shareContent
      }
    },
    handleNextPage(msg) {
      this.nextPage = true
      if (msg == 'newUser') {
        this.isNewUser = true
      } else {
        this.isOldDriver = true
      }
    }
  },

  mounted() {
    this.getData()
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
}
</style>
