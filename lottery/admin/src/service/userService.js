import { fetch } from './fetch.js'
import api from './api.js'

const findUser = function(page = 0, lotteryCode='', pageSize = 20) {
  return fetch(api.USER, {
    page,
    lotteryCode,
    pageSize
  }, 'get')
}

const findAllUser = function(lotteryCode){
  return fetch(api.USER + '/all', {
    lotteryCode
  }, 'get')
}

const deleteUser = function(id) {
  return fetch(api.USER + '/' + id, null, 'delete')
}

const deleteUserOfLottery = (lotteryCode) => {
  return fetch(api.USER, {
    lotteryCode
  }, 'delete')
}

export default {
  findUser,
  deleteUser,
  findAllUser,
  deleteUserOfLottery
}
