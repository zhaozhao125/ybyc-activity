let config = {
  url: 'https://h5.1byongche.com/php/invite/regist-coupons.html',
  // url: 'http://47.100.76.78:8085/invite/regist-coupons.html',
  activeCode: 14,
  activeName: '新用户H5',
  certkey: '0p/9olsdfa3#da',
  utmData: {
    utm_source: null, // 来源
    utm_medium: null, // 来源分类
    utm_compaign: null, // 活动代码（唯一）
    utm_content: null, // 内容
    utm_term: null // 关键字
  }
}
if(process.env.API == 'test'){
  config.url = 'http://47.100.76.78:8085/invite/regist-coupons.html'
}
console.log('====config====', config, process.env)
export default config