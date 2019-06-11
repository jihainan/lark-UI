<template>
  <!-- 聊天消息框 -->
  <div :class="['message-piece', {send: isMe(), receive: !isMe()}]">

    <!-- 消息时间 需要判断显示时间的条件 -->
    <div class="time-stamp">
      <div>{{ messageInfo.time | timeFormat }}</div>
    </div>

    <!-- 用户头像 需要添加点击事件，显示用户信息 -->
    <a-avatar
      :class="['message-avatar', {send: isMe(), receive: !isMe()}]"
      shape="square"
      :src="isMe() ? userInfo.avatar : messageInfo.avatar"
      :size="40">
      <span>{{ messageInfo.username }}</span>
    </a-avatar>

    <div class="message-content">

      <!-- 需要判断什么时候显示 -- 群消息 且 不是当前用户发送的 且 设置了显示群昵称的 -->
      <div v-if="!isMe() && messageInfo.isGroup" class="message-nickname">
        <span>{{ messageInfo.username }}</span>
      </div>

      <!-- 判断消息类型：图片 文字 文件 -->
      <div class="message-bubble left right ">
        <div class="bubble-content">
          <div class="plain">
            <!-- 纯文本信息 -->
            <div v-if="messageInfo.type === 1">
              <div class="secret-tip">
                <span :class="'s-' + messageInfo.secretLevel">
                  【{{ JSON.parse(messageInfo.secretLevel) | fileSecret }}】
                </span>
              </div>
              <pre>{{ messageInfo.content }}</pre>
            </div>

            <!-- 图片消息 -->
            <div v-if="messageInfo.type === 2" class="img-message">
              <a-spin :spinning="imgLoading === 1" size="small">
                <img
                  @load="handleImg"
                  @error="handleImg"
                  @click="handlePreview('open')"
                  :src="messageInfo.content.src"
                  :alt="messageInfo.content.title" >

                <a-button
                  v-if="imgLoading === 3"
                  @click="handleImg"
                  style="float: right; margin: 0 10px"
                  type="primary"
                  size="small"
                  icon="redo" />

                <div class="img-message-option">
                  <div class="secret-tip">
                    <span :class="'s-' + messageInfo.secretLevel">
                      【{{ JSON.parse(messageInfo.secretLevel) | fileSecret }}】
                    </span>
                  </div>
                  <span class="download">下载</span>
                </div>
              </a-spin>

              <a-modal :visible="previewVisible" :closable="false" :footer="null" @cancel="handlePreview('close')">
                <img
                  :alt="messageInfo.content.title"
                  style="width: 100%"
                  :src="messageInfo.content.src" />
              </a-modal>
            </div>

            <!-- 文件消息 -->
            <div v-if="messageInfo.type === 3" class="file-message">
              <div class="file-message-icon">
                <a-icon type="file" theme="twoTone" style="fontSize: 26px" />
              </div>
              <div class="file-message-info">
                <a-tooltip placement="topLeft" :title="messageInfo.content.title">
                  <span>{{ messageInfo.content.title }}</span>
                </a-tooltip>

                <div class="file-option">
                  <div class="secret-tip">
                    <span :class="'s-' + messageInfo.secretLevel">
                      【{{ JSON.parse(messageInfo.secretLevel) | fileSecret }}】
                    </span>
                  </div>
                  <span class="download">下载</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { toWeiXinString } from '@/utils/util'
import { mapGetters } from 'vuex'

export default {
  name: 'MessagePiece',
  props: {
    /** 消息对象Tweet */
    messageInfo: {
      type: Object,
      default: () => ({}),
      required: true
    },
    /** 是否为群组消息 */
    isGroup: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      // 图片加载状态 0:无状态 1:加载中 2:加载成功 3:加载失败
      imgLoading: 0,
      previewVisible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    messageInfo: {
      handler: function () {
        // 处理图片的加载状态
        if (this.messageInfo.content.src) this.imgLoading = 1
        else this.imgLoading = 0
      },
      immediate: true,
      deep: true
    }
  },
  filters: { timeFormat: toWeiXinString },
  methods: {
    /**
     * 判断是否当前用户发送的消息
     * @param {String} fromId 消息发送者的id
     */
    isMe () {
      return this.messageInfo.fromId === this.userInfo.id
    },
    /**
     * 图片加载过程处理
     */
    handleImg (event) {
      if (event.type === 'load') {
        this.imgLoading = 2
        this.$emit('imgLoaded', event.target.height)
      }
      if (event.type === 'error') {
        this.imgLoading = 3
      }
      if (event.type === 'click') {
        this.messageInfo.content.src = this.messageInfo.content.src + '?t=' + Math.random()
      }
    },
    /**
     * 图片预览
     */
    handlePreview (option) {
      if (option === 'open' && this.imgLoading === 2) {
        this.previewVisible = true
      } else {
        this.previewVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
  // 接收到的消息样式
  .receive {
    float: left;

    .left {
      &::after, &::before {
        right: 100%;
        border-right-color: #fff !important;
        border-right-width: 4px;
      }
    }
  }

  // 发送的消息样式
  .send {
    float: right;
    text-align: right;

    .right {
      background-color: #cce4fc !important;
      &::before, &::after {
        left: 100%;
        border-left-color: #cce4fc !important;
        border-left-width: 4px;
      }
    }
  }
  // 下载键样式
  .download {
    cursor: pointer;
    &:hover {
      color: #295786;
    }
  }
  // 密级标识样式
  .secret-tip {
    display: inline;
    .s-60 {
      color: #b2b2b2;
    }
    .s-70 {
      color: orange;
    }
    .s-80 {
      color: tomato;
    }
  }

  .message-piece {
    width: 100%;
    margin-bottom: 15px;
    display: block;

    .time-stamp {
      text-align: center;
      margin: 10px auto;
      max-width: 50%;

      div {
        display: inline-block;
        font-size: 12px;
        color: #b2b2b2;
        padding: 1px 18px;
      }
    }

    .message-avatar {
      border-radius: 2px;
      cursor: pointer;
    }

    .message-content {
      overflow: hidden;

      .message-nickname {
        height: 22px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        padding-left: 10px;
        color: #4f4f4f;
        width: 350px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }

      .message-bubble {
        background-color: #ffffff;
        margin: 0 10px;
        max-width: 500px;
        min-height: 1em;
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align: left;
        font-size: 14px;
        border-radius: 3px;

        &::before, &::after {
          position: absolute;
          right: 100%;
          top: 14px;
          border: 6px solid transparent;
          content: " ";
        }

        .bubble-content {
          word-wrap: break-word;
          word-break: break-all;
          min-height: 25px;
          color: #4e4a4a;

          .plain {
            padding: 9px 13px;

            pre {
              margin: 0;
              display: inline;
              font-family: inherit;
              font-size: inherit;
              white-space: pre-wrap;
              word-break: normal;
            }

            .img-message {
              img {
                max-width: 450px;
                min-width: 85px;
              }
              &-option {
                text-align: right;
                font-size: 13px;
              }
            }

            .file-message {
              display: flex;
              &-icon {
                width: 48px;
                padding: 10px 0;
                border-radius: 2px;
                text-align: center;
                opacity: 0.8;
                background-color: seashell;
                margin-right: 5px;
              }
              &-info {
                width: 185px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .file-option {
                  font-size: 13px;
                  position: absolute;
                  right: 20px;
                  bottom: 9px;
                }
              }
            }
          }
        }

      }
    }

  }
</style>
