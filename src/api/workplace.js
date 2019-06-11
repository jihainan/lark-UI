import { axios } from '@/utils/request'

const api = {
  workplace: '/workplace/myself'
}

export default api

export function getWorkplace (parameter) {
  return axios({
    url: api.workplace,
    method: 'get',
    params: parameter
  })
}
