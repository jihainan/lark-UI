<template>
  <a-layout v-if="Object.keys(chatInfo).length" class="conv-box">

    <!-- 聊天设置选项的抽屉组件 -->
    <!-- <talk-history :activeOption="activeOption" @closeDrawer="triggerDrawer"></talk-history>
    <group-notice :activeOption="activeOption" @closeDrawer="triggerDrawer"></group-notice>
    <talk-setting :activeOption="activeOption" @closeDrawer="triggerDrawer"></talk-setting>
    <talk-file :activeOption="activeOption" @closeDrawer="triggerDrawer"></talk-file>
    <mark-message :activeOption="activeOption" @closeDrawer="triggerDrawer"></mark-message> -->

    <a-layout-header class="conv-box-header">
      <a-row type="flex" justify="space-between">
        <a-col :span="14" class="conv-title">
          <!-- 需要对名字的字数做限制 -->
          <span>{{ chatInfo.name }}</span>
          <!-- 若为群组时显示成员数量 -->
          <span v-show="chatInfo.isGroup">( {{ chatInfo.memberNum }} )</span>
          <!-- 显示密级 -->
          <span :class="'s-' + chatInfo.secretLevel">【{{ chatInfo.secretLevel | fileSecret }}】</span>
        </a-col>

        <a-col :span="10" class="conv-option">
          <div v-if="!isPopup" style="float: right">
            <!-- 需要判断是否为群聊，操作选项不同 -->
            <a-tooltip
              v-for="(item, index) in optionFilter(chatInfo.isGroup)"
              :key="index"
              placement="bottom"
              :overlayStyle="{fontSize: '12px'}"
            >
              <template slot="title">
                <span>{{ item.message }}</span>
              </template>
              <a-icon @click="triggerDrawer(item.name)" style="marginLeft: 20px" :type="item.type" />
            </a-tooltip>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout-content class="conv-box-message">

      <div class="talk-main-box">
        <div v-if="messageList.length" class="talk-main">
          <div v-for="(item, index) in messageList" :key="index" class="talk-item">
            <message-piece :messageInfo="item" @imgLoaded="scrollToBottom" />
          </div>
        </div>

        <div v-else class="talk-main">
          <p class="empty-tip">暂时没有消息</p>
        </div>
      </div>

    </a-layout-content>

    <a-layout-footer class="conv-box-editor">

      <div class="editor-option">
        <!-- 文字编辑选项 -->
        <div>
          <a-tooltip placement="top" :overlayStyle="{fontSize: '12px'}">
            <template slot="title">
              <span>表情</span>
            </template>

            <a-popover placement="topLeft" v-model="emojisVisible" trigger="click" overlayClassName="emojis-picker">
              <template slot="content">
                <VEmojiPicker :pack="emojisNative" labelSearch @select="onSelectEmoji" style="color: black;" />
              </template>
              <a-icon style="marginRight: 20px" type="smile" />
            </a-popover>

          </a-tooltip>
        </div>

        <div>
          <!-- 上传文件 -->
          <a-upload
            name="file"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            class="upload-list-inline"
            :showUploadList="false"
            :headers="headers"
            @change="handleUpload"
            :openFileDialogOnClick="!Object.keys(fileUpload).length">

            <a-tooltip
              placement="top"
              :title="Object.keys(fileUpload).length ? '有未发送文件' : '选择文件'"
              :overlayStyle="{fontSize: '12px'}">
              <a-icon :style="{fontSize: '20px', color: Object.keys(fileUpload).length ? '#00000033' : ''}" type="folder" />
            </a-tooltip>

          </a-upload>
        </div>
      </div>

      <div class="editor-area">
        <div class="draft-input">
          <!-- 输入框 -->
          <textarea
            v-show="!Object.keys(fileUpload).length"
            v-focus
            size="large"
            class="textarea-input"
            v-model="messageContent"
            @keydown.enter.stop.prevent.exact
            @keyup.enter.stop.prevent.exact="sendMessage(sendSecretLevel)"
            @keyup.alt.enter.exact="messageContent += '\n'"
            @keyup.ctrl.enter.exact="messageContent += '\n'"
          />
          <!-- 文件上传进度 -->
          <div v-show="Object.keys(fileUpload).length" class="upload-display">
            <a-card class="file-card" :bodyStyle="{lineHeight: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}">
              <a-icon type="paper-clip" style="fontSize: 20px; marginRight: 10px;" />
              <a-tooltip :title="fileUpload.name">
                <span>{{ fileUpload.name }}</span>
              </a-tooltip>
              <a-progress :percent="fileUpload.percent" :status="uplaodStatus[fileUpload.status]" size="small" style="display: block;"/>
              <a-tooltip placement="top" title="删除">
                <a-icon type="close" @click="removeFile" style="position: absolute; top: 5px; right: 5px; font-size: 11px; cursor: pointer;" />
              </a-tooltip>
            </a-card>
          </div>

          <!-- 发送键 -->
          <div class="send-toolbar">
            <div style="marginLeft: auto">
              <!-- 提示信息 -->
              <a-tooltip placement="left" title="发送前请正确选择消息密级">
                <a-icon type="question-circle" style="margin-right: 6px; cursor: pointer;"/>
              </a-tooltip>
              <!-- 发送键 -->
              <a-dropdown-button @click="sendMessage(sendSecretLevel)" type="primary" :disabled="sendDisabled">
                发送<span :class="'s-' + sendSecretLevel">【{{ sendSecretLevel | fileSecret }}】</span>
                <a-menu v-if="sendMenuList.length" slot="overlay">
                  <template v-for="item in sendMenuList">
                    <a-menu-item :key="item" @click="handleSendSecretLevel">
                      发送<span :class="'s-' + item">【{{ item | fileSecret }}】</span>
                    </a-menu-item>
                  </template>
                </a-menu>
              </a-dropdown-button>
            </div>
          </div>

        </div>
      </div>
    </a-layout-footer>

  </a-layout>

  <a-layout v-else style="height: 100%; textAlign: center;">
    <div class="unselected-tip">
      <a-icon type="message" style="fontSize: 140px; color: #d7d9db" />
      <p>未选择聊天</p>
    </div>
  </a-layout>
</template>

<script>
import { MessagePiece, TalkHistory, GroupNotice, TalkSetting, MarkMessage, TalkFile } from '@/components/Talk'
import { LandingStatus } from '@/utils/constants'
import { SocketMessage, Tweet } from '@/utils/talk'
import { format, extensionStr } from '@/utils/util'
import { getTalkHistory } from '@/api/talk'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import { mapGetters } from 'vuex'
// 生成随机uuid
import uuidv4 from 'uuid/v4'

export default {
  name: 'ConvBox',
  components: {
    MessagePiece,
    VEmojiPicker,
    TalkHistory,
    GroupNotice,
    TalkSetting,
    MarkMessage,
    TalkFile
  },
  props: {
    /** 聊天对话框的基本信息 */
    chatInfo: {
      type: Object,
      default: () => ({}),
      required: true
    },
    /** 是否为弹框式的聊天窗口 */
    isPopup: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      // 被激活的抽屉
      activeOption: '',
      // 所有被at用的id
      atId: [],
      // 消息类型
      messageType: 1,
      // 输入框内容
      messageContent: '',
      // 发送消息的密级，默认为非密
      sendSecretLevel: 60,
      // 发送键的可选密级选项
      sendMenuList: [],
      // 控制表情选择框不自动关闭
      emojisVisible: false,
      // 文件上传时的请求头部
      headers: { authorization: 'authorization-text', 'Access-Control-Allow-Origin': '*' },
      // 上传的文件
      fileUpload: {},
      // 文件上传状态对应表
      uplaodStatus: {
        'uploading': 'active',
        'done': 'success',
        'error': 'exception'
      },

      imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
      fileFormat: ['doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'pdf', 'gif', 'exe', 'msi', 'swf', 'sql', 'apk', 'psd']
    }
  },
  computed: {
    ...mapGetters(['onlineState', 'userInfo']),
    messageList: {
      get: function () {
        return this.$store.state.talk.curMessageList
      },
      set: function (messageList) {
        this.$store.commit('SET_CUR_MESSAGE_LIST', messageList)
      }
    },
    emojisNative () {
      return packData
    },
    // 发送按钮的可用状态
    sendDisabled () {
      if (this.onlineState === LandingStatus.ONLINE) {
        return this.fileUpload.status && this.fileUpload.status !== 'done'
      } else return true
    }
  },
  watch: {
    'chatInfo.id': {
      handler: function (newId, oldId) {
        // 设置当前联系人
        this.$store.commit('SET_CURRENT_TALK', this.chatInfo)
        // TODO: 更新最近联系人列表的唯独消息数
        // ···
        this.getCacheMessage()
        this.scrollToBottom()
        this.handleSendSecretLevel()

        // 设置输入框信息
        this.$store.dispatch('UpdateDraftMap', [oldId + 'file', this.fileUpload])
          .then(() => {
            this.fileUpload = this.$store.state.talk.draftMap.get(newId + 'file') || {}
          })
          .then(() => {
            this.$store.dispatch('UpdateDraftMap', [oldId, this.messageContent])
              .then(() => {
                this.messageContent = this.$store.state.talk.draftMap.get(newId) || ''
              })
          })
      },
      immediate: true
    },
    messageList: function (newValue) {
      // 消息列表发生变化，更新缓存
      this.$store.state.talk.talkMap.set(this.chatInfo.id, newValue)
      // 滚动到最下方
      this.scrollToBottom()
    }
  },
  mounted () {
    // 页面创建时，消息滚动到最近一条
    this.scrollToBottom()

    // 每次滚动到最底部
    this.$nextTick(() => {
    })
  },
  methods: {
    /**
     * 文件上传状态变化时触发
     * @param {Object} info {file, fileList}
     */
    handleUpload ({ file }) {
      this.fileUpload = file
      if (file.status === 'done') {
        this.$message.success(`${file.name} 上传成功`)
      } else if (file.status === 'error') {
        this.$message.error(`${file.name} 上传失败.`)
        this.fileUpload = {}
      }
    },
    /**
     * 清除上传的文件
     */
    removeFile () {
      this.fileUpload = {}
      // TODO: 向后台发送请求
      // ···
    },
    /**
     * 添加表情
     */
    onSelectEmoji (dataEmoji) {
      this.messageContent += dataEmoji.emoji
    },
    /**
     * 聊天消息滚到到最新一条
     * 1. 发送消息 2. 页面创建 3.页面更新
     * @param {Number} height 滚动的高度
     */
    scrollToBottom (height) {
      this.$nextTick(() => {
        const msgContr = this.$el.querySelector('.talk-main-box')
        if (msgContr) {
          msgContr.scrollTop = height
            ? (msgContr.scrollTop + Number.parseInt(height))
            : msgContr.scrollHeight
        }
      })
    },
    /**
     * 通过isGroup属性过滤聊天选项
     * @author jihainan
     */
    optionFilter (isGroup) {
      // 聊天操作选项
      const optionList = [
        { group: true, name: 'groupNotice', message: '群公告', type: 'notification' },
        { group: true, name: 'markMessage', message: '标记信息', type: 'tags' },
        { group: false, name: 'talkHistory', message: '聊天内容', type: 'file-text' },
        { group: false, name: 'talkFile', message: '文件', type: 'folder-open' },
        { group: false, name: 'moreInfo', message: '更多', type: 'ellipsis' }]
      return isGroup ? optionList : optionList.filter(item => !item.group)
    },
    /**
     * 根据drawerName打开对应的抽屉
     * @author jihainan
     */
    triggerDrawer (drawerName) {
      this.activeOption = drawerName
    },
    /**
     * 设置发送消息的密级
     */
    handleSendSecretLevel (item) {
      item = item ? item.key : 60
      // 当前用户可发送的全部密级
      const allSendMenu = [60, 70, 80].filter(item => item <= this.userInfo.secretLevel)
      // 当前研讨的密级
      const talkSecretLevel = this.chatInfo.secretLevel
      // 设置发送按钮的密级
      this.sendSecretLevel = item
      this.sendMenuList = allSendMenu.filter(function (menu) {
        return menu !== item && menu <= talkSecretLevel
      })
    },
    /**
     * 获取缓存消息
     */
    getCacheMessage () {
      const cacheMessage = this.$store.state.talk.talkMap.get(this.chatInfo.id)
      if (cacheMessage) {
        // 在缓存中取到历史研讨记录
        this.messageList = cacheMessage
      } else {
        // 未在缓存中取到记录，向服务端请求数据
        getTalkHistory().then(res => {
          if (res.status === 200) this.messageList = res.result.data
        })
      }
    },
    /**
     * 发送消息
     * @author jihainan
     */
    sendMessage (secretLevel) {
      const tweet = new Tweet()
      const content = this.messageContent
      const { status, name, response } = { ...this.fileUpload }

      if (status && status === 'done') {
        // 组建图片或文件类消息
        this.generateFileMsg(tweet, response.url, name, extensionStr(name))
      } else if (content.replace(/\n/g, '').trim() === '') {
        this.$message.warning('消息内容不能为空')
      } else if (this.messageContent.length > 2000) {
        this.$message.warning('消息内容不能超过2000个字符,以文件发送')
      } else {
        // 组建文本类结构体
        this.generateTextMsg(tweet, content)
      }
      // 判断组建消息成功，继续添加新的属性
      if (tweet.type) {
        tweet.id = uuidv4()
        tweet.username = this.userInfo.name
        tweet.avatar = this.userInfo.avatar
        tweet.fromId = this.userInfo.id
        tweet.toId = this.chatInfo.id
        tweet.atId = []
        tweet.secretLevel = secretLevel
        tweet.time = new Date()
        tweet.isGroup = this.chatInfo.isGroup

        // 将消息加入当前消息列表(栈操作)
        this.messageList.push(tweet)

        // 更新当前联系人信息
        if (tweet.type === 1) {
          this.chatInfo.lastMessage = content
          this.messageContent = ''
        } else if (tweet.type === 2) {
          this.chatInfo.lastMessage = '[图片]:' + tweet.content.title
        } else if (tweet.type === 3) {
          this.chatInfo.lastMessage = '[文件]:' + tweet.content.title
        }

        this.chatInfo.time = format(tweet.time, 'hh:mm')

        // 添加发件人信息,发送websocket消息
        tweet.contactInfo = this.chatInfo
        const baseMessage = new SocketMessage({ code: this.chatInfo.isGroup ? 1 : 0, data: tweet })
        this.SocketGlobal.send(baseMessage.toString())

        // 更新最近联系人列表
        this.$store.dispatch('UpdateRecentContacts', { ...this.chatInfo, reOrder: true, addUnread: false })
        // 发完消息滚动到最下方
        this.scrollToBottom()
        this.fileUpload = {}
      }
    },
    /** 生成文字消息 */
    generateTextMsg (tweet, content) {
      tweet.type = 1
      tweet.content = content
    },
    /** 生成图片和文件类消息 */
    generateFileMsg (tweet, src, title, extension) {
      const index = this.imgFormat.indexOf(extension)
      tweet.type = index < 0 ? 3 : 2
      tweet.content = {
        title: title,
        src: src,
        extension: extension
      }
    }
  },
  directives: {
    // 使元素获得焦点
    'focus': (el) => {
      el.focus()
    }
  }
}
</script>
<style lang="less" scoped>

  .unselected-tip {
    padding-top: 20%;
    color: #a5a7a9;
    font-size: 16px;
  }
  // 让表情看着更清楚
  #EmojiPicker {
    color: black;
  }

  // 修改上传文件列表的样式
  // TODO: 修改文件上传的样式
  .upload-list-inline {
  }

  // 消息密级样式
  .s-60, .s-undefined {
    font-size: 14px;
    color: #b2b2b2;
  }
  .s-70 {
    font-size: 14px;
    color: orange;
  }
  .s-80 {
    font-size: 14px;
    color: tomato;
  }

  .conv-box {
    height: 100%;

    // 头部区域
    &-header {
      position: relative;
      top: 0;
      height: 55px;
      width: 100%;

      line-height: 55px;
      padding: 0 20px;
      background-color: #f2f3f5;
      border-bottom: 1px solid #dcdee0;

      .conv-title {
        color: black;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        :nth-child(2) {
          letter-spacing: -2px;
        }
      }

      .conv-option {
        font-size: 18px;

        .anticon:hover {
          color: #1890ff;
        }
      }
    }
    // 消息展示区域
    &-message {
      display: flex;
      position: relative;
      overflow: hidden;
      flex-grow: 1;

      .talk-main-box {
        position: relative;
        flex-grow: 1;
        overflow: hidden;
        &:hover {
          overflow: overlay;
        }

        .talk-main{
          position: absolute;
          box-sizing: border-box;
          min-height: 100%;
          min-width: 360px;
          width: 100%;
          padding: 4px 16px 16px;
          background: rgba(255, 255, 255, 0);
          overflow: hidden;
          .talk-item{
            display: flex;
            flex-direction: row-reverse;
          }

          .empty-tip {
            text-align: center;
            margin-top: 130px;
            color: #ccc;
            font-size: 13px;
          }
        }
      }
    }
    // 文字编辑区域
    &-editor {
      flex-shrink: 0;
      background-color: #fff;
      display: flex;
      padding: 0;
      border-top: 1px solid #dcdee0;
      flex-direction: column;
      // 编辑器选项
      .editor-option {
        display: flex;
        height: 40px;
        line-height: 32px;
        padding: 4px 20px;
        font-size: 20px;
      }
      // 文字编辑区域
      .editor-area {
        padding: 0 20px 5px;
        display: flex;
        flex-direction: column;

        .draft-input{
          flex: 1 0 auto;
          width: 100%;
          display: flex;
          height: 140px;
          flex-direction: column;
          cursor: text;
          // 输入框
          .textarea-input{
            height: 100px;
            width: 100%;
            line-height: 20px;
            color: black;
            resize: none;
            outline: none;
            border: none;
          }
          // 文件上传展示
          .upload-display {
            height: 100%;
            width: 100%;
            max-height: 100px;
            .file-card {
              width: 300px;
              height: 80px;
            }
          }
          // 发送键
          .send-toolbar{
            margin: 4px 0;
            display: flex;
            align-items: flex-end;
        }
      }
    }
    }
  }

</style>
