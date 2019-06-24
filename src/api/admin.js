/**
 * fanjiao add
 * 主要用于组织管理模块、用户管理模块相关接口请求
 *
 */
import { axios } from '@/utils/request'

const api = {
  orgTree: '/admin/org/tree',
  getuserpage: '/admin/user/page',
  getuser: '/admin/org/user',
  getuserrole: '/admin/role/userRole',
  user: '/admin/user',
  adduser: '/admin/user/addUser',
  org: '/admin/org',
  getrole: '/admin/role/page',
  role: '/admin/role',
  rolepermission: '/admin/role/permission',
  userrole: '/admin/user/roles',
  getnoticepage: '/admin/notice/page',
  notice: 'admin/notice',
  noticesend: 'admin/notice/send',
  // upload: '/fdfs/file/thumbImage',
  upload: '/fdfs/file/upload',
  getmenu: '/admin/menu/page',
  getmenuall: '/admin/menu/all',
  menu: '/admin/menu',
  menuelement: '/admin/menu/element',
  roleuser: '/admin/role/user',
  // 个人卡片设置
  card: '/portal/userCard/cards',
  usercard: '/portal/userCard/myself',
  gatelog: '/admin/gateLog/page',
  // 临时增加，方便测试
  getUserBySecret: 'admin/user/list'
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
 * 根据用户id获取用户信息
 */
export function getuser (parameter) {
  return axios({
    url: api.user + '/' + parameter,
    method: 'get'
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
 * 新增角色
 */
export function addRole (parameter) {
  return axios({
    url: api.role,
    method: 'post',
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
/**
 * 获取消息列表（分页）
 */
export function getNoticePage (parameter) {
  return axios({
    url: api.getnoticepage,
    method: 'get',
    params: parameter
    // data: parameter
  })
}
/**
 * 消息保存
 */
export function addNotice (parameter) {
  return axios({
    url: api.notice,
    method: 'post',
    data: parameter
  })
}
/**
 * 消息修改
 */
export function updateNotice (parameter) {
  return axios({
    url: api.notice,
    method: 'put',
    data: parameter
  })
}
/**
 * 消息发布
 */
export function sendNotice (parameter) {
  return axios({
    url: api.noticesend,
    method: 'post',
    data: parameter
  })
}
/**
 * 消息删除
 */
export function delNotice (parameter) {
  return axios({
    url: api.notice + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 文件上传
 */
export function uploadFile (parameter) {
  return axios({
    url: api.upload,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
/**
 * 菜单查询（分页）
 */
export function getMenuList (parameter) {
  return axios({
    url: api.getmenu,
    method: 'get',
    params: parameter
  })
}
/**
 * 菜单查询（不分页）
 */
export function getMenuListAll (parameter) {
  return axios({
    url: api.getmenuall,
    method: 'get',
    params: parameter
  })
}
/**
 * 新增菜单
 */
export function addMenu (parameter) {
  return axios({
    url: api.menu,
    method: 'post',
    data: parameter
  })
}
/**
 * 修改菜单
 */
export function updateMenu (parameter) {
  return axios({
    url: api.menu,
    method: 'put',
    data: parameter
  })
}
/**
 * 删除菜单
 */
export function delMenu (parameter) {
  return axios({
    url: api.menu + '/' + parameter,
    method: 'delete'
  })
}
/**
 * 根据菜单id获取按钮信息
 */
export function getMenuElement (parameter) {
  return axios({
    url: api.menuelement,
    method: 'get',
    params: parameter
  })
}
/**
 * 根据菜单id获取按钮信息
 */
export function saveMenuElement (parameter) {
  return axios({
    url: api.menuelement,
    method: 'post',
    data: parameter
  })
}
/**
 * 根据角色id获取用户
 */
export function getRoleUser (parameter) {
  return axios({
    url: api.roleuser,
    method: 'get',
    params: parameter
  })
}
/**
 * 保存角色对应用户
 */
export function saveRoleUser (parameter) {
  return axios({
    url: api.roleuser,
    method: 'put',
    data: parameter
  })
}
/**
 * 新增卡片
 */
export function addCard (parameter) {
  return axios({
    url: api.usercard,
    method: 'post',
    data: parameter
  })
}
/**
 * 删除卡片
 */
export function delCard (parameter) {
  return axios({
    url: api.usercard,
    method: 'delete',
    params: parameter
  })
}
/**
 * 获取卡片
 */
export function getCard () {
  return axios({
    url: api.card,
    method: 'get'
  })
}
/**
 * 获取网关日志
 */
export function getGateLog (parameter) {
  return axios({
    url: api.gatelog,
    method: 'get',
    params: parameter
  })
}
/**
 * 临时增加，通过密级获取用户列表
 * @param {Object} parameter {secretLevel: 60}
 */
export function getUserBySecret (parameter) {
  return axios({
    url: api.getUserBySecret,
    method: 'GET',
    params: parameter
  })
}
