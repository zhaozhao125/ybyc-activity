import Vue from 'vue'
import App from './App'

import {
  Toast,
  Indicator
} from 'mint-ui'
import {getSign} from '@/utils/encryptParam.js'
import sa from 'sa-sdk-javascript'

window.env = 'production' // dev

window.sa = sa
let saConfig = {
  // sensorsdata.min.js 文件的地址，请从 GitHub 获取并且放在你们自己网站目录下。
  sdk_url: 'https://static.sensorsdata.cn/sdk/1.9.13/sensorsdata.min.js',
  // SDK 使用的一个默认的全局变量，如定义成 sa 的话，后面接可以使用 sa.track() 用来跟踪信息。为了防止变量名重复，你可以修改成其他名称比如 sensorsdata 等 。
  name: 'sa',
  // 数据接收地址。
  server_url: 'http://analysis.1byongche.com:8106/sa?project=production_user',
  // （1.9以上版本新加） heatmap.min.js 文件的地址，在热力分析渲染页面时会用到，采集数据时候不会加载。
  heatmap_url: 'http://static.sensorsdata.cn/sdk/1.9.13/heatmap.min.js',
  // 设置成 true 后，表示在根域下设置 cookie 。也就是如果你有 zhidao.baidu.com 和 tieba.baidu.com 两个域，且有一个用户在同一个浏览器都登录过这两个域的话，我们会认为这个用户是一个用户。如果设置成 false 的话，会认为是两个用户。默认 true。
  corss_subdomain: false
}
if (window.env == 'dev') {
  saConfig.server_url = 'http://analysis.1byongche.com:8106/sa'
}
sa.init(saConfig)
sa.quick('autoTrack', {
  platForm: 'h5'
})

Vue.config.productionTip = false

Vue.prototype.$toast = Toast

let baseURL = 'https://api.1byongche.com:7101/v26'
if (window.env == 'dev') {
  baseURL = 'https://pre.1byongche.cn:7101/v26'
}

let user
try {
  if (localStorage) {
    user = JSON.parse(localStorage.getItem('fifa2018UserId'))
  }
} catch (err) {
  console.log('====err====', err)
}

Vue.prototype.$setUser = (param) => {
  user = param
}
Vue.prototype.$getUser = (param) => {
  return user
}

Vue.prototype.$fetch = (url, data = {}) => {
  Indicator.open('请稍候...')
  return new Promise((resolve, reject) => {
    let xmlhttp
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    } else {
      xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        Indicator.close()
        if (xmlhttp.status === 200) {
          resolve(JSON.parse(xmlhttp.responseText))
        } else {
          reject(xmlhttp.status)
        }
      }
    }
    data.sign = getSign(data)
    let params = ''
    if (data && typeof data === 'object') {
      let arr = []
      Object.keys(data).forEach(item => {
        arr.push(`${item}=${data[item]}`)
      })
      params = arr.join('&')
    }
    if (!url.match('http')) {
      url = baseURL + url
    }
    xmlhttp.open('POST', url, true)
    xmlhttp.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    )
    xmlhttp.send(params)
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
