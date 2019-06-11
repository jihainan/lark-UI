/**
 * websocket接口类
 * @author jihainan
 */
import store from '@/store'
class SocketApi {
  /**
   * 构造函数
   * @param {String} wsProtocol 接口协议
   * @param {String} ip ip地址
   * @param {Sting} port 接口号
   * @param {String} paramStr 加在url后面的请求参数，形如：?id=12
   * @param {String} param 作为tio.ws对象的参数，由业务自己使用，框架不使用
   * @param {Number} heartbeatTimeout 心跳时间 单位：毫秒
   * @param {Number} reconnInterval 重连间隔时间 单位：毫秒
   * @param {String} binaryType 返回websocket连接所传输二进制数据的类型
   */
  constructor ({ wsProtocol, ip = '127.0.0.1', port = '8181', paramStr, param, heartbeatTimeout = 50000, reconnInterval = 1000, binaryType = 'arraybuffer' } = {}) {
    this.wsProtocol = wsProtocol
    this.ip = ip
    this.port = port
    this.url = 'ws://127.0.0.1:8181'
    this.binaryType = binaryType

    if (paramStr) {
      this.url += '?' + paramStr
    }
    this.param = param
    this.heartbeatTimeout = heartbeatTimeout
    this.reconnInterval = reconnInterval
    this.heartbeatSendInterval = heartbeatTimeout / 2
  }

  /**
   * 最后一次通信时间
   */
  lastInteractionTime () {
    const len = arguments.length
    if (len === 1) {
      this.lastInteractionTimeValue = arguments[0]
    }
    return this.lastInteractionTimeValue
  }

  /**
   * 建立websocket连接
   */
  connect () {
    const ws = new WebSocket(this.url)
    // 设置在线状态为重连中
    store.commit('SET_ONLINE_STATE', ws.CONNECTING)
    this.ws = ws

    ws.binaryType = this.binaryType

    const self = this

    // websocket连接打开
    ws.onopen = openEvent => {
      self.lastInteractionTime(new Date().getTime())

      // 获取该用户所有的未读消息
      store.dispatch('GetTalkMap')

      // 设置在线状态为已连接
      store.commit('SET_ONLINE_STATE', ws.OPEN)

      // 定时发送心跳
      self.pingIntervalId = setInterval(() => {
        self.ping(self)
      }, self.heartbeatSendInterval)
    }

    // 收到websocket消息
    ws.onmessage = messageEvent => {
      const time = new Date()
      const received = JSON.parse(messageEvent.data)

      switch (received.code) {
        case 0:
        // 接收到私聊消息
        // eslint-disable-next-line no-fallthrough
        case 1:
          // 接收到群组消息
          // 更新最近联系人列表
          store.dispatch('UpdateRecentContacts', { ...received.data.contactInfo, reOrder: true, addUnread: true })
          // 更新消息缓存
          store.dispatch('UpdateTalkMap', received.data)
          break
        default:
          break
      }

      self.lastInteractionTime(time.getTime())
    }

    // websocket连接关闭
    ws.onclose = closeEvent => {
      clearInterval(self.pingIntervalId)

      // 设置在线状态为已断开
      store.commit('SET_ONLINE_STATE', ws.CLOSED)

      // 重连的处理逻辑
      self.reconn()
    }

    ws.onerror = errorEvent => {
      self.colse(4001, '连接出现错误')
      // 出错的处理逻辑
      // ···
    }

    return ws
  }

  /**
   * 重连websocket
   */
  reconn () {
    const self = this
    setTimeout(() => {
      self.ws = self.connect()
    }, self.reconnInterval)
  }

  /**
   * 心跳
   */
  ping () {
    const iv = new Date().getTime() - this.lastInteractionTime()

    if ((this.heartbeatSendInterval + iv) >= this.heartbeatTimeout) {
      this.ws.send('心跳内容')
    }
  }

  /**
   * 发送数据
   * @param {Object} data 发送的数据
   */
  send (data) {
    this.ws.send(data)
  }

  /**
   * 关闭websocket连接
   * @param {Number} code 关闭原因代码
   * @param {String} reason 关闭原因描述
   */
  colse (code, reason) {
    // 设置登陆状态为正在断开
    store.commit('SET_ONLINE_STATE', this.ws.CLOSING)

    this.ws.close(code, reason)
  }

  /**
   * 获取websocket连接状态
   */
  readyState () {
    return this.ws.readyState
  }
}

export default SocketApi
