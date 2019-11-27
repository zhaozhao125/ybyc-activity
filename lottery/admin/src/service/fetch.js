import axios from 'axios'
import qs from 'qs' //序列化表单数据
import { Message } from 'element-ui'
import baseURL from '@/config/base-url.js'

const Axios = axios.create({
  baseURL: baseURL || '/',
  timeout: 20000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'put' ||
      config.method === 'post' ||
      config.method === 'patch' ||
      config.method === 'delete'
    ) {
      // 序列化
      config.data = qs.stringify(config.data)
    }

    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  error => {
    Message({
      showClose: true,
      message: error,
      type: 'error.data.error.message'
    })
    return Promise.reject(error.data.error.message)
  }
)

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    if (res.data && !res.data.success) {
      Message({
        showClose: true,
        message: res.data.msg
          ? res.data.msg
          : '请求失败',
        type: 'error'
      })
      return Promise.reject(res)
    }
    return res
  },
  error => {
    Message({
      showClose: true,
      message: error.response.statusText || '请求出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}

export function fetch(url, data, method='post'){
  let options = {
    method: method,
    url: url
  }
  if(method.toLowerCase() == 'get'){
    options.params = data
  }else{
    options.data = data
  }
  return Axios(options)
}