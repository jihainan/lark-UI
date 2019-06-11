/**
 * fanjiao add
 * 主要用于组织管理模块、用户管理模块相关接口请求
 *
 */
import { axios } from '@/utils/request'

const api = {
  orgTree: '/admin/org/tree',
  user: '/admin/user',
  adduser: '/admin/user/addUser',
  getuserpage: '/admin/user/page',
  getuser: '/admin/org/user',
  getuserrole: '/admin/role/userRole',
  org: '/admin/org',
  getrole: '/admin/role/page',
  role: '/admin/role',
  rolepermission: '/admin/role/permission',
  userrole: '/admin/user/roles'
}

export default api
/**
 * 获取用户列表（分页）
 */
export function getUserPage (parameter) {
  return axios({
    url: api.getuserpage,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取用户列表
 */
export function getUserList (parameter) {
  return axios({
    url: api.getuser,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取用户角色
 */
export function getUserRole (parameter) {
  return axios({
    url: api.getuserrole,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取树结构组织信息
 */
export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}
/**
 * 新增用户信息
 */
export function adduser (parameter) {
  return axios({
    url: api.adduser,
    method: 'post',
    data: parameter
  })
}
/**
 * 修改用户信息
 */
export function updateuser (parameter) {
  return axios({
    url: api.user,
    method: 'put',
    data: parameter
  })
}
/**
 * 修改用户角色信息
 */
export function saveuserRole (parameter) {
  return axios({
    url: api.userrole,
    method: 'get',
    params: parameter
  })
}
/**
 * 删除用户信息
 */
export function deluser (parameter) {
  return axios({
    url: api.user + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 新增组织信息
 */
export function addorg (parameter) {
  return axios({
    url: api.org,
    method: 'post',
    data: parameter
  })
}
/**
 * 修改组织信息
 */
export function updateorg (parameter) {
  return axios({
    url: api.org,
    method: 'put',
    data: parameter
  })
}
/**
 * 删除组织信息
 */
export function delorg (parameter) {
  return axios({
    url: api.org + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 获取角色列表
 */
export function getRoleList (parameter) {
  return axios({
    url: api.getrole,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取角色权限
 */
export function getRolePermission (parameter) {
  return axios({
    url: api.rolepermission,
    method: 'get',
    params: parameter
  })
}
/**
 * 修改角色权限
 */
export function updateRolePermission (parameter) {
  return axios({
    url: api.rolepermission,
    method: 'put',
    data: parameter
  })
}
/**
 * 修改角色
 */
export function updateRole (parameter) {
  return axios({
    url: api.role,
    method: 'put',
    data: parameter
  })
}
/**
 * 删除角色
 */
export function delRole (parameter) {
  return axios({
    url: api.role + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 禁用角色
 */
export function disabledRole (parameter) {
  return axios({
    url: api.role,
    method: 'put',
    params: parameter
  })
}
