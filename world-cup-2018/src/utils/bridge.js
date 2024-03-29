// 获取与原生通信的bridge
const setupWebViewJavascriptBridge = function (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(window.WebViewJavascriptBridge)
    }, false)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

const getBridge = function () {
  return new Promise((resolve, reject) => {
    let conected = false
    setupWebViewJavascriptBridge((bridge) => {
      conected = true
      console.log('====123123====')
      if (!bridge) {
        return reject(new Error('无法获取bridge'))
      }
      resolve(bridge)
    })
    setTimeout(() => {
      if (!conected) {
        reject(new Error('没有bridge'))
      }
    }, 2000)
  })
}

export default getBridge
