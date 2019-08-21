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
  userSecretLevel: state => parseInt(state.user.info.secretLevel),

  addRouters: state => state.permission.addRouters,

  /** websocket连接状态 */
  onlineState: state => state.talk.onlineState,
  currentTalk: state => state.talk.currentTalk,
  recentContacts: state => state.talk.recentContacts,
  groupList: state => state.talk.groupList,
  contactsTree: state => state.talk.contactsTree,
  /** 消息状态判断 100-成功 101-失败 102-发送中 */
  getMessageStatus: (state) => (messageId) => {
    if (state.talk.sendingMap.has(messageId)) {
      return 102
    } else if (state.talk.failSet.has(messageId)) {
      return 101
    } else {
      return 100
    }
  },
  /** 获取消息历史记录 */
  getTalkHistory: (state) => (contactId) => {
    console.log('===============================')
    console.log(state.talk.talkMap.get(contactId))
    console.log('===============================')
    return state.talk.talkMap.get(contactId) || []
  }
}

export default getters
