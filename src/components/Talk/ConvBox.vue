<template>
  <a-layout v-if="Object.keys(chatInfo).length" class="conv-box">
    <!-- 聊天设置选项的抽屉组件 -->
    <talk-history
      :contactId="chatInfo.id"
      :hisGrop="JSON.stringify(chatInfo.isGroup)"
      :activeOption="activeOption"
      @closeDrawer="triggerDrawer"
    />
    <group-notice :activeOption="activeOption" @closeDrawer="triggerDrawer" />
    <talk-setting :groupId="chatInfo.id" :activeOption="activeOption" @closeDrawer="triggerDrawer" />
    <talk-file :activeOption="activeOption" :groupId="chatInfo.id" @closeDrawer="triggerDrawer" />
    <user-file :contactId="chatInfo.id" :activeOption="activeOption" @closeDrawer="triggerDrawer" />
    <mark-message :groupId="chatInfo.id" :activeOption="activeOption" @closeDrawer="triggerDrawer" />
    <more-info :contactId="chatInfo.id" :activeOption="activeOption" @closeDrawer="triggerDrawer" />
    <a-layout-header class="conv-box-header">
      <div class="conv-title">
        <!-- 需要对名字的字数做限制 -->
        <span>{{ chatInfo.name }}</span>
        <!-- 若为群组时显示成员数量 -->
        <span v-show="chatInfo.isGroup">( {{ chatInfo.memberNum }} )</span>
        <!-- 显示密级 -->
        <span :class="'s-' + chatInfo.secretLevel">【{{ chatInfo.secretLevel | fileSecret }}】</span>
      </div>
      <div class="conv-option">
        <div v-if="!isPopup">
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
      </div>
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

            <a-popover
              placement="topLeft"
              v-model="faceVisible"
              trigger="click"
              overlayClassName="emojis-picker"
            >
              <template slot="content">
                <face @insertFace="insertFace" />
              </template>
              <a-icon style="marginRight: 20px" type="smile" />
              <!-- @click="getfocus(); insertHtmlAtCaret();" -->
            </a-popover>
          </a-tooltip>
        </div>

        <div>
          <!-- 上传文件 -->
          <a-upload
            name="file"
            :action="fileUploadUrl"
            listType="picture"
            class="upload-list-inline"
            :showUploadList="false"
            :headers="headers"
            @change="handleUpload"
            :beforeUpload="beforeUpload"
            :openFileDialogOnClick="!Object.keys(fileUpload).length"
          >
            <!-- :customRequest="customRequest" -->
            <a-tooltip
              placement="top"
              :title="Object.keys(fileUpload).length ? '有未发送文件' : '选择文件'"
              :overlayStyle="{fontSize: '12px'}"
            >
              <a-icon
                :style="{fontSize: '20px', color: Object.keys(fileUpload).length ? '#00000033' : ''}"
                type="folder"
              />
            </a-tooltip>
          </a-upload>
        </div>
      </div>
      <div class="editor-area">
        <div class="draft-input">
          <!-- 输入框 -->
          <div>
            <!-- <wysiwyg
              v-model="messageContent"
              v-show="!Object.keys(fileUpload).length"
              class="textarea-input"
              @keydown.enter.stop.prevent.exact
              @keyup.alt.enter.exact="messageContent += '\n'"
              @keyup.ctrl.enter.exact="messageContent += '\n'"
            /> -->
            <!-- @keyup.enter.native="sendMessage(sendSecretLevel)" -->
            <textarea
              v-show="!Object.keys(fileUpload).length"
              size="large"
              class="textarea-input"
              v-model="messageContent"
              @keydown.enter.stop.prevent.exact
              @keyup.enter.stop.prevent.exact="sendMessage(sendSecretLevel)"
              @keyup.alt.enter.exact="messageContent += '\n'"
              @keyup.ctrl.enter.exact="messageContent += '\n'"
            />
          </div>
          <!-- 文件上传进度 -->
          <div v-show="Object.keys(fileUpload).length" class="upload-display">
            <a-card
              class="file-card"
              :bodyStyle="{lineHeight: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}"
            >
              <a-icon type="paper-clip" style="fontSize: 20px; marginRight: 10px;" />
              <a-tooltip :title="fileUpload.name">
                <span>{{ fileUpload.name }}</span>
              </a-tooltip>
              <a-progress
                :percent="fileUpload.percent"
                :status="uploadStatus[fileUpload.status]"
                size="small"
                style="display: block;"
              />
              <a-tooltip placement="top" title="删除">
                <a-icon
                  type="close"
                  @click="removeFile"
                  style="position: absolute; top: 5px; right: 5px; font-size: 11px; cursor: pointer;"
                />
              </a-tooltip>
            </a-card>
          </div>

          <!-- 发送键 -->
          <div class="send-toolbar">
            <div style="marginLeft: auto">
              <!-- 发送键 -->
              <a-radio-group @change="handleSendSecretLevel" v-model="sendSecretLevel">
                <template v-for="item in sendSecretList">
                  <a-radio :value="item" :key="item">
                    <span :class="'s-' + item">【{{ item | fileSecret }}】</span>
                  </a-radio>
                </template>
              </a-radio-group>
              <a-button
                type="primary"
                @click="sendMessage(sendSecretLevel)"
                :disabled="sendDisabled"
              >
                发送
                <span :class="'s-' + sendSecretLevel">【{{ sendSecretLevel | fileSecret }}】</span>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-layout-footer>

    <!-- 文件上传进度条 -->
    <a-modal
      v-model="progressVisible"
      :closable="false"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
    >
      <a-progress
        :percent="fileUpload.percent"
        :status="uploadStatus[fileUpload.status]"
      />
    </a-modal>
  </a-layout>

  <a-layout v-else style="height: 100%; textAlign: center;">
    <div class="unselected-tip">
      <a-icon type="message" style="fontSize: 140px; color: #d7d9db" />
      <p>未选择聊天</p>
    </div>
  </a-layout>
</template>

<script>
import {
  MessagePiece,
  TalkHistory,
  MoreInfo,
  GroupNotice,
  TalkSetting,
  MarkMessage,
  TalkFile,
  UserFile
} from '@/components/Talk'
import { LandingStatus } from '@/utils/constants'
import api from '@/api/talk'
import { SocketMessage, Tweet } from '@/utils/talk'
import { mapGetters } from 'vuex'
// 生成随机uuid
import uuidv4 from 'uuid/v4'
import Face from './Face'
import Watermark from '@/utils/waterMark'

export default {
  name: 'ConvBox',
  components: {
    MessagePiece,
    TalkHistory,
    GroupNotice,
    TalkSetting,
    MarkMessage,
    TalkFile,
    MoreInfo,
    UserFile,
    Face
  },
  props: {
    /** 聊天对话框的基本信息--结构同最近联系人 */
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
      // 是否是群聊消息
      // isGroupMessage,
      // 所有被at用的id
      atId: [],
      // 消息类型
      messageType: 1,
      // 输入框内容
      messageContent: '',
      // 发送消息的密级，默认为非密
      sendSecretLevel: 30,
      // 发送键的可选密级选项
      sendSecretList: [],
      // 控制表情选择框不自动关闭
      faceVisible: false,
      // 文件上传时的请求头部
      headers: {},
      // 上传的文件
      fileUpload: {},
      // 文件上传状态对应表
      uploadStatus: {
        uploading: 'active',
        done: 'success',
        error: 'exception'
      },
      // 显示文件上传进度条
      progressVisible: false,
      messageList: [],

      imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
      fileFormat: [
        'doc',
        'docx',
        'jpg',
        'jpeg',
        'png',
        'gif',
        'xls',
        'xlsx',
        'pdf',
        'gif',
        'exe',
        'msi',
        'swf',
        'sql',
        'apk',
        'psd'
      ]
    }
  },
  computed: {
    ...mapGetters(['onlineState', 'userSecretLevel', 'userId', 'avatar', 'nickname', 'token']),
    // 发送按钮的可用状态
    sendDisabled () {
      if (this.onlineState === LandingStatus.ONLINE) {
        return this.fileUpload.status && this.fileUpload.status !== 'done'
      } else return true
    },
    fileUploadUrl () {
      return api.fileUpload
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
        this.$store
          .dispatch('UpdateDraftMap', [oldId + 'file', this.fileUpload])
          .then(() => {
            this.fileUpload = this.$store.state.talk.draftMap.get(newId + 'file') || {}
          })
          .then(() => {
            this.$store.dispatch('UpdateDraftMap', [oldId, this.messageContent]).then(() => {
              this.messageContent = this.$store.state.talk.draftMap.get(newId) || ''
            })
          })
      },
      immediate: true
    },
    messageList: function (newValue) {
      this.$store.commit('SET_TALK_MAP', {
        fromServer: false,
        talkMapData: [[this.chatInfo.id, newValue]]
      })
      // 滚动到最下方
      this.scrollToBottom()
    }
  },
  mounted () {
    // 页面创建时，消息滚动到最近一条
    this.scrollToBottom()
    // this.$nextTick(() => {
    this.printWaterMark(this.nickname)
    // })
  },
  methods: {
    /**
     * 重写上传action方法
     */
    // customRequest (data) {
    //   const formData = new FormData()
    //   formData.append('file', data.file)
    //   data.onProgress()
    //   uploadFile(formData).then(res => {
    //     if (res.status === 200) {
    //       // const imageUrl = res.result
    //       // vue-cropper插件img绑定url时，会有跨域问题，图片类型转base64传递到子组件
    //       this.getBase64(data.file, (imageUrl) => {
    //         this.$refs.modal.edit(imageUrl)
    //       })
    //     }
    //   })
    // },
    /** 给研讨界面添加水印 */
    printWaterMark (username) {
      const config = {
        text: username,
        font: '24px serif',
        opacity: 0.4,
        density: 0.8,
        rotate: (-1 / 6) * Math.PI,
        z_index: 999,
        color: 'rgba(178, 178, 178, 0.3)',
        yOffset: 1
      }
      const watermark = new Watermark(config)
      watermark.embed('.conv-box-message', 'qqqqq')
    },
    /**
     * 文件上传状态变化时触发
     * @param {Object} info {file, fileList}
     */
    handleUpload ({ file }) {
      this.progressVisible = true
      this.fileUpload = file
      if (file.status === 'done') {
        this.progressVisible = false
        this.$message.success(`${file.name} 上传成功`)
      } else if (file.status === 'error') {
        this.progressVisible = false
        this.$message.error(`${file.name} 上传失败.`)
        this.fileUpload = {}
      }
    },
    beforeUpload () {
      this.headers.authorization = this.token
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
     * 聊天消息滚到到最新一条
     * 1. 发送消息 2. 页面创建 3.页面更新
     * @param {Number} height 滚动的高度
     */
    scrollToBottom (height) {
      this.$nextTick(() => {
        const msgContr = this.$el.querySelector('.talk-main-box')
        if (msgContr) {
          msgContr.scrollTop = height ? msgContr.scrollTop + Number.parseInt(height) : msgContr.scrollHeight
        }
      })
    },
    /**
     * 通过isGroup属性过滤聊天选项
     */
    optionFilter (isGroup) {
      // 聊天操作选项
      const optionList = [
        // { group: true, name: 'groupNotice', message: '群公告', type: 'notification' },
        // { group: true, name: 'markMessage', message: '标记信息', type: 'tags' },
        { group: false, name: 'talkHistory', message: '聊天内容', type: 'file-text' },
        { group: false, name: isGroup ? 'talkFile' : 'userFile', message: '文件', type: 'folder-open' },
        { group: false, name: isGroup ? 'moreInfo' : 'personMoreInfo', message: '更多', type: 'ellipsis' }
      ]

      return isGroup ? optionList : optionList.filter(item => !item.group)
    },
    /**
     * 根据drawerName打开对应的抽屉
     */
    triggerDrawer (drawerName) {
      this.activeOption = drawerName
    },
    /**
     * 设置发送消息的密级
     */
    handleSendSecretLevel (even) {
      const secretLevel = even ? parseInt(event.target.value) : 30
      const allSendMenu = [30, 40, 60].filter(item => item <= this.userSecretLevel)
      const curTalkSecret = this.chatInfo.secretLevel
      this.sendSecretLevel = secretLevel
      this.sendSecretList = allSendMenu.filter(item => item <= curTalkSecret)
    },
    /**
     * 获取缓存消息
     */
    getCacheMessage () {
      const hasCache = this.$store.state.talk.talkMap.has(this.chatInfo.id)
      if (!hasCache) {
        this.$store.commit('SET_TALK_MAP', {
          fromServer: false,
          talkMapData: [[this.chatInfo.id, []]]
        })
      }
      this.messageList = this.$store.state.talk.talkMap.get(this.chatInfo.id)
    },
    /**
     * 发送消息
     */
    sendMessage (secretLevel) {
      if (this.sendDisabled) {
        this.$message.warning('还不能发送消息！')
        return
      }
      const tweet = new Tweet()
      /**
       * 文件上传响应体中包含以下属性
       * "fileId": "AAAWUHAAGAAAAxkAAG",
       * "fileName": "api-ms-win-core-namedpipe-l1-1-0.dll",
       * "fileExt": "",
       * "fileType": "",
       * "sizes": 18744,
       * "path": "20190619",
       * "readPath": "",
       * "createTime": "2019-06-19 14:52:22",
       * "creator": "登录人id_测试",
       * "updateTime": "2019-06-19 14:52:22",
       * "updator": "登录人id_测试",
       * "groupId": "",
       * "levels": ""
       */
      const { status } = this.fileUpload
      const content = this.messageContent
      // 如果有文件消息，发送文件消息，忽略文字消息
      if (status === 'done') {
        const { fileId, fileName, readPath, fileExt } = this.fileUpload.response.result
        this.generateFileMsg(tweet, fileId, readPath, fileExt, fileName, secretLevel)
      } else {
        // 没有文件消息，验证文字消息的合法性
        if (content.replace(/\n/g, '').trim() === '') {
          this.$message.warning('消息内容不能为空')
        } else if (content.length > 2000) {
          this.$message.warning('消息内容不能超过2000个字符')
        } else {
          this.generateTextMsg(tweet, content, secretLevel)
        }
      }
      // 如果消息类型属性存在，消息内容创建成功
      if (tweet.content && tweet.content.type) {
        this.generateBaseInfo(tweet, secretLevel)
        // this.updateChatInfo(tweet)
        this.addSenderInfo(tweet)
        const baseMessage = new SocketMessage({
          code: this.chatInfo.isGroup ? 1 : 0,
          data: tweet
        }).toString()
        this.SocketGlobal.send(baseMessage)
        // 将消息放进当前的消息列表
        this.messageList.push(tweet)
        this.$store.dispatch('UpdateRecentContacts', {
          ...this.chatInfo,
          reOrder: true,
          addUnread: false
        })

        this.scrollToBottom()
        tweet.content.type === 1 ? (this.messageContent = '') : (this.fileUpload = {})
      }
    },
    /** 添加发信人信息或者群组信息 */
    addSenderInfo (tweet) {
      const { chatInfo, userId, nickname, avatar, userSecretLevel } = this
      tweet.contactInfo = {}
      if (tweet.isGroup) {
        tweet.contactInfo.id = chatInfo.id
        tweet.contactInfo.name = chatInfo.name
        tweet.contactInfo.avatar = chatInfo.avatar
        tweet.contactInfo.secretLevel = chatInfo.secretLevel
        tweet.contactInfo.memberNum = chatInfo.memberNum
        tweet.contactInfo.isGroup = true
      } else {
        tweet.contactInfo.id = userId
        tweet.contactInfo.name = nickname
        tweet.contactInfo.avatar = avatar
        tweet.contactInfo.secretLevel = userSecretLevel
        tweet.contactInfo.memberNum = 2
        tweet.contactInfo.isGroup = false
      }
    },
    /** 更新当前联系人信息 */
    // TODO: 这个地方可以不处理，在刷新最近联系人列表处统一处理
    updateChatInfo (tweet) {
      // this.chatInfo.time = format(tweet.time, 'hh:mm')
      // if (tweet.content.type === 1) {
      //   this.chatInfo.lastMessage.title = tweet.content.title
      //   this.messageContent = ''
      // } else if (tweet.type === 2) {
      //   this.chatInfo.lastMessage = '[图片]:' + tweet.content.title
      // } else if (tweet.type === 3) {
      //   this.chatInfo.lastMessage = '[文件]:' + tweet.content.title
      // }
    },
    /** 生成消息体中的基本信息 */
    generateBaseInfo (tweet, secretLevel) {
      const { userId, avatar, nickname, chatInfo } = this
      tweet.id = uuidv4()
      tweet.username = nickname
      tweet.avatar = avatar
      tweet.fromId = userId
      tweet.toId = chatInfo.id
      tweet.atId = []
      tweet.time = new Date()
      tweet.isGroup = chatInfo.isGroup
    },
    /** 生成文字消息 */
    generateTextMsg (tweet, content, secretLevel) {
      tweet.content = {
        id: '0',
        url: '0',
        type: 1,
        extension: '0',
        title: content,
        secretLevel: secretLevel
      }
    },
    /** 生成图片和文件类消息 */
    generateFileMsg (tweet, id, url, extension, title, secretLevel) {
      const index = this.imgFormat.indexOf(extension.toLowerCase())
      tweet.content = {
        id: id,
        url: url,
        type: index < 0 ? 3 : 2,
        extension: extension,
        title: title,
        secretLevel: secretLevel
      }
    },
    showFaceBox: function () {
      this.faceVisible = !this.faceVisible
    },
    /** 插入表情 */
    insertFace (item) {
      this.messageContent = this.messageContent + 'face' + item
      this.faceVisible = false
    }
  },
  directives: {
    // 使元素获得焦点
    focus: el => {
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

.conv-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;

  // 头部区域
  &-header {
    height: 55px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

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
      // 右对齐
      overflow: hidden;
      font-size: 18px;

      .anticon:hover {
        color: #1890ff;
      }
    }
  }
  // 消息展示区域
  &-message {
    display: flex;
    flex-direction: column;
    flex: 1;

    .talk-main-box {
      position: relative;
      flex-grow: 1;
      overflow: hidden;
      &:hover {
        overflow: overlay;
      }

      .talk-main {
        // position: absolute;
        box-sizing: border-box;
        min-height: 100%;
        min-width: 360px;
        width: 100%;
        padding: 4px 16px 16px;
        background: rgba(255, 255, 255, 0);
        overflow: hidden;
        .talk-item {
          display: flex;
          flex-direction: row-reverse;
          flex-shrink: 0;
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
    height: 185px;
    flex-shrink: 0;
    background-color: #fff;
    display: flex;
    padding: 0;
    flex-direction: column;
    // 编辑器选项
    .editor-option {
      display: flex;
      height: 40px;
      line-height: 32px;
      border-top: 1px solid #dcdee0;
      padding: 4px 20px;
      font-size: 20px;
      z-index: 3;
      background-color: #fff;
    }
    // 文字编辑区域
    .editor-area {
      padding: 0 20px 5px;
      display: flex;
      flex-direction: column;

      .draft-input {
        flex: 1 0 auto;
        width: 100%;
        display: flex;
        height: 140px;
        flex-direction: column;
        cursor: text;
        // 输入框
        .textarea-input {
          height: 90px;
          width: 100%;
          line-height: 20px;
          color: black;
          resize: none;
          outline: none;
          border: none;
          z-index: 2;
          // margin-top: -40px;
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
        .send-toolbar {
          margin: 4px 0;
          display: flex;
          align-items: flex-end;
        }
      }
    }
  }
}
</style>
