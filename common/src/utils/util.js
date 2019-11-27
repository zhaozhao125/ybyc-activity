import {
  Toast,
  Indicator
} from 'mint-ui'

export function fetch(url, data, method = 'post') {
  Indicator.open('请稍候...')
  return new Promise((resolve, reject) => {
    let xmlhttp
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    } else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        Indicator.close()
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText))
        } else {
          Toast({
            message: '网络请求出错，请重试'
          })
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
    xmlhttp.open(method, url, true)
    xmlhttp.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    )
    xmlhttp.send(params)
  })

}

export function getURLParams() {
  var urlParams = {};
  window.location.search.replace('?', '').split('&').forEach(function (item) {
    var param = item.split('=');
    if (param.length > 1) {
      urlParams[param[0]] = param[1];
    }
  });
  return urlParams;
}
