import moment from 'moment'
moment.locale('zh-cn')
export default {
  formatDate: (date) => {
    return moment(date).format('LLL')
  }
}