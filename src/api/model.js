import { axios } from '@/utils/request'

const api = {
  latest: '/model/latest'
}

export default api

export function getModels (parameter) {
  return axios({
    url: api.latest,
    method: 'get',
    params: parameter
  })
}
