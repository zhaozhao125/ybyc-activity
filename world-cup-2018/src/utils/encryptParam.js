import CryptoJS from 'crypto-js'

export function getRnd() {
  let str = CryptoJS.DES.encrypt(String(Math.floor(Date.now() / 1000)), CryptoJS.enc.Utf8.parse('y1o3n5g7'), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext.toString(CryptoJS.enc.Base64)

  return str
}

export function getSign(params) {
  let paramsStr = Object.keys(params).map(item => {
    return `${item}=${params[item]}`
  }).join('&') + '&' + '4drafaedaehb'
  return CryptoJS.MD5(paramsStr).toString() // .substr(8, 16)
}

export default function encryptParam(user, params) {
  let validation = {
    rnd: getRnd(),
    client: user.client || '',
    uid: user.uid || '',
    token: user.token || '',
    version: user.version || '300'
  }
  params = Object.assign(params || {}, validation)
  params.sign = getSign(params)
  return params
}
