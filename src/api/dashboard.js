import { axios } from '@/utils/request'

const api = {
  meeting: '/index/meeting'
}
export default api
export function getMeetings (parameter) {
  return axios({
    url: api.meeting,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
// export function saveService (parameter) {
//   return axios({
//     url: api.service,
//     method: parameter.id === 0 ? 'post' : 'put',
//     data: parameter
//   })
// }
