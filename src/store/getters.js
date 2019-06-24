const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  /** 用户id(非身份证号) */
  userId: state => state.user.info.id,
  /** 用户身份证号 */
  userPId: state => state.user.info.pid,
  /** 用户头像 */
  avatar: state => state.user.avatar,
  /** 用户名 */
  nickname: state => state.user.name,
  /** 用户密级 */
  userSecretLevel: state => state.user.info.secretLevel,

  addRouters: state => state.permission.addRouters,

  /** websocket连接状态 */
  onlineState: state => state.talk.onlineState,
  showSearchContent: state => state.talk.showSearchContent,
  searchResultList: state => state.talk.searchResultList,
  searchGroupResultList: state => state.talk.searchGroupResultList,
  searchContactsResultList: state => state.talk.searchContactsResultList
}

export default getters
