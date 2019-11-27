import BASE_URL from '@/config/base-url.js'

function getNumberWithSpecifiedLength(length) {
  let ret = ''
  for (let index = 0; index < length; index++) {
    ret += Math.floor(Math.random()*10)
  }
  return ret
}

function sendData(lotteryCode, callback) {
  fetch(BASE_URL + '/lottery/user', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'asd',
      phone: '1' + getNumberWithSpecifiedLength(10),
      lotteryCode: lotteryCode
    }) 
  }).then(res => {
    return res.json()
  }).then(res => {
    //console.log(res)
    callback()
  })
}

function sendFakeUser(count, lotteryCode, callback) {
  let n = 1
  for (let i = 0; i < count; i++) {
    sendData(lotteryCode, ()=>{
      n++
      if(n == count){
        callback()
      }
    })
  }
}

export default sendFakeUser
