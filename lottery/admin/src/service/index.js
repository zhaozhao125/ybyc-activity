import fileService from './fileService.js'
import loginService from './loginService.js'
import lotteryService from './lotteryService.js'
import userService from './userService.js'
export default {
  ...fileService,
  ...loginService,
  ...lotteryService,
  ...userService,
}
