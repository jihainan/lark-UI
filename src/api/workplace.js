import { axios } from '@/utils/request'

const api = {
  workplace: '/portal/workplace/myself',
  card: '/portal/workplace/move',
  // notice: '/workplace/notice'
  // update by fanjiao 接口联调
  notice: '/portal/notice/orgNotice',
  userCard: '/portal/userCard/myself',
  userTools: '/portal/userCommonTools/myself',
  // 意见反馈
  feedback: '/portal/feedback',
  feedback_page: '/portal/feedback/page',
  comment: '/portal/comment',
  commentlist: '/portal/comment/feedBackComments'
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
 * 移动卡片
 * created by fanjiao
 */
export function moveUserCard (parameter) {
  return axios({
    url: api.userCard + '?data=' + parameter,
    method: 'put'
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
/**
 * 问题反馈添加
 * created by fanjiao
 */
export function addFeedback (parameter) {
  return axios({
    url: api.feedback,
    method: 'post',
    data: parameter
  })
}
/**
 * 问题反馈删除
 * created by fanjiao
 */
export function delFeedback (parameter) {
  return axios({
    url: api.feedback + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 问题反馈修改
 * created by fanjiao
 */
export function updateFeedback (parameter) {
  return axios({
    url: api.feedback,
    method: 'put',
    data: parameter
  })
}
/**
 * 问题反馈分页
 * created by fanjiao
 */
export function getFeedback (parameter) {
  return axios({
    url: api.feedback_page,
    method: 'get',
    params: parameter
  })
}
/**
 * 评论查看
 * created by fanjiao
 */
export function getComment (parameter) {
  return axios({
    url: api.commentlist,
    method: 'get',
    params: parameter
  })
}
/**
 * 评论添加
 * created by fanjiao
 */
export function addComment (parameter) {
  return axios({
    url: api.comment,
    method: 'post',
    data: parameter
  })
}
/**
 * 评论删除
 * created by fanjiao
 */
export function delComment (parameter) {
  return axios({
    url: api.comment + '/' + parameter,
    method: 'delete'
  })
}
