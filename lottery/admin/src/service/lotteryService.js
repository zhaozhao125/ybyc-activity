import {fetch} from './fetch.js'
import api from './api.js'
import {COUPON_URL} from '@/config/base-url'
import axios from 'axios'
import qs from 'qs'

const addLottery = function(data){
  return fetch(api.LOTTERY, {
    data
  })
}

const findAllLottery = function(params){
  return fetch(api.LOTTERY, params, 'get')
}

const deleteLottery = function(id){
  return fetch(api.LOTTERY + '/' + id, null, 'delete')
}

const startLottery = function(id){
  return fetch(api.LOTTERY + '/' + id, {
    state: 1
  }, 'put')
}

const stopLottery = function(id){
  return fetch(api.LOTTERY + '/' + id, {
    state: 2
  }, 'put')
}

const findActiveLottery = function(lotteryCode){
  return fetch(api.LOTTERY, {
    state: 1,
    code: lotteryCode
  }, 'get')
}

const setLotteryWinner = function(lotteryId, prizeId, winner){
  return fetch(api.LOTTERY + '/' + lotteryId, {
    prizeId,
    winner
  }, 'put')
}

const clearLotteryWinner = function(id){
  return fetch(api.LOTTERY + '/' + id + '?param=clearWinner', null, 'put')
}

const sendCouponBatch = (phones) => {
  console.log('====phones====', phones)
  // todo 测试手机
  // phones = '13676957416,13522381001,18860387916'
  let params = qs.stringify({
    activity_code: '2018_ihenan_screen_accessit',
    phones: phones,
    certkey: '0p/9olsdfa3#da'
  })
  return axios({
    url: COUPON_URL,
    method: 'post',
    data: params,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export default {
  addLottery,
  findAllLottery,
  deleteLottery,
  startLottery,
  stopLottery,
  findActiveLottery,
  setLotteryWinner,
  clearLotteryWinner,
  sendCouponBatch
}