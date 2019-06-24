import { axios } from '@/utils/request'

const api = {
  workplace: '/portal/workplace/myself',
  card: '/portal/workplace/move',
  // notice: '/workplace/notice'
  // update by fanjiao 接口联调
  notice: '/portal/notice/orgNotice',
  userCard: '/portal/userCard/myself',
  userTools: '/portal/userCommonTools/myself'
}

export default api

export function moveCard (parameter) {
  return axios({
    url: api.card,
    method: 'post',
    params: parameter
  })
}
/**
 * 工作舱-公告、首页右上角消息弹窗
 * created by fanjiao
 */
export function getNotice (parameter) {
  return axios({
    url: api.notice,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取卡片
 * created by fanjiao
 */
export function getUserCard (parameter) {
  return axios({
    url: api.userCard,
    method: 'get',
    params: parameter
  })
}
/**
 * 查询个人工具
 * created by fanjiao
 */
export function getCommonTools (parameter) {
  return axios({
    url: api.userTools,
    method: 'get',
    data: parameter
  })
}
