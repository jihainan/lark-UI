<template>
  <div>
    <!-- <input type="text" class="seek_inp" placeholder="输入要搜索内容" v-model="searchVal" >
    <a-button type="primary" icon="search" style="border-radius:0"></a-button> -->

    <!--
      1 文本
      2 文件
      3 图片
     -->
    <a-input-search
      placeholder="输入要搜索内容"
      @search="onSearch"
      enterButton
      type="text"
      v-model="searchVal"
      style="margin-bottom: 20px"
    />
    <ul class="history_box">
      <li v-for="(item) in NewItems" class="history_cotent" :key="item.id" :value="item.value">
        <div class="borderDiv" v-if="item.content.type == 1" >
          <!-- <img :src="item.avatar" class="content_l" :alt="item.username"> -->
          <a-avatar class="content_l" shape="square" size="large" :src="item.avatar" >{{ item.username }}</a-avatar>
          <div class="content_r">
            <h3 class="user_name">{{ item.username }}</h3>
            <div @click="isCurrent(item.content.title)" :class="{'current':flag}" v-html="item.content.title"></div>
          </div>
          <div class="history_right">
            <span>{{ item.sendTimeShort }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '60'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '30'">非密</a-tag>
            </div>
          </div>
        </div>
        <div class="borderDiv" v-if="item.content.type == 2" >
          <!-- <img :src="item.avatar" class="content_l" :alt="item.username"> -->
          <a-avatar class="content_l" shape="square" size="large" :src="item.avatar" >{{ item.username }}</a-avatar>
          <div class="content_r">
            <h3 class="user_name">{{ item.username }}</h3>
            <p></p>
            <img :src="item.content.url" alt="图片加载失败" class="content_img">
          </div>
          <div class="history_right">
            <span>{{ item.sendTimeShort }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '60'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '30'">非密</a-tag>
            </div>

          </div>
          <a :href="genDownLoadPath(item.content.id)" class="down dow_height">下载</a>
        </div>
        <div class="borderDiv" v-if="item.content.type == 3">
          <!-- <img :src="item.avatar" class="content_l" alt> -->
          <a-avatar class="content_l" shape="square" size="large" :src="item.avatar" >{{ item.username }}</a-avatar>
          <div class="content_r">
            <h3 class="user_name">{{ item.username }}</h3>
            <dir class="content_file">
              <a-icon class="content_icon" type="file"/>
              <a-tooltip :title="item.content.title">
                <h3 class="content_h3" style=" width: 100px,  padding:0">{{ item.content.title }}</h3>
              </a-tooltip>
            </dir>
          </div>
          <div class="history_right">
            <span>{{ item.sendTimeShort }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '60'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '30'">非密</a-tag>
            </div>
          </div>
          <a :href="genDownLoadPath(item.content.id)" class="down dow_height">下载</a>
        </div>
      </li>
    </ul>
    <a-button v-if="isShow" @click="getHistory" style="margin: auto; display: block;"> 加载失败，点击重试</a-button>
    <div v-if="!isShow" class="login_img">
      没有更多信息...
    </div>
  </div>

</template>
<script>
import { talkHistoryAll } from '@/api/talk.js'
import api from '@/api/talk'

export default {
  name: 'Rabble',
  directives: { scroll },
  props: {
    contactId: {
      type: String,
      default: '',
      required: true
    },
    hisGrop: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      searchVal: '',
      items: [],
      flag: true,
      activeOption: '',
      userMessage: false,
      userId: '',
      page: 1,
      Dowflag: false,
      fileId: '',
      isShow: false
    }
  },
  created () {
    this.activeOption = 'talkHistory'
    this.getHistory()
  },
  mounted () {
    window.addEventListener('scroll', (this.lazyLoading), true)
  },
  beforeDestroy () {
    this.activeOption = ''
  },
  methods: {
    /** 生成下载路径 */
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId
    },
    onSearch (value) {
    },
    isCurrent (str) {
      if (str.length > 100) {
        this.flag = !this.flag
      }
    },
    // 提示
    openNotification () {
      this.$notification.warning({
        message: '无法获取聊天内容，稍后再试',
        description: '',
        onClick: () => {
          console.log('Notification Clicked!')
        }
      })
    },
    getHistory () {
      this.userId = this.$store.getters.userId
      talkHistoryAll(this.userId, this.hisGrop, this.contactId, this.page).then(data => {
        this.isShow = false
        const datas = data.result.data
        datas.map((item) => {
          this.items.push(item)
        })
      }).catch(res => {
        this.isShow = true
        this.openNotification()
      })
    },
    // 滚动获取数据
    lazyLoading () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.page++

          if (this.activeOption === 'talkHistory') {
            // this.getHistory()
            talkHistoryAll(this.userId, this.hisGrop, this.contactId, this.page).then(data => {
              const datas = data.result.data
              datas.map((item, index, array) => {
                this.items.push(item)
              })
            }).catch((res) => {
              this.isShow = true
              this.openNotification()
            })
          }
        }, 1000)
      } else {
      }
    }
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.items.map(function (item) {
        if (item.username.search(_this.searchVal) !== -1 || item.content.title.search(_this.searchVal) !== -1 || item.time.search(_this.searchVal) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  }
}
</script>
<style lang="less" scoped>
.current {
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  user-select: none;
}
.a-input {
  margin-bottom: 20px;
}
.history_cotent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .borderDiv{
    border-bottom: 1px solid #cccccc;

  }
  .content_l {
    width: 40px;
    height: 40px;
    background-size: 30px 30px;
    position: absolute;
    top: 10px;
    left: 0;
    line-height: 40px;
    font-size: 10px;
    background: #00a2ae;
    color: white;
    text-align: center
  }
  .content_r {
    display: inline-block;
    margin-left: 50px;
    box-sizing: border-box;
    .user_name {
      margin-bottom: 0;
      padding-top: 7px;
      width: 150px;
    }
    p {
      // width: 250px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .history_right {
    float: right;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    span {
      display: block;
      padding-top: 6px;
      float: left;
    }
    .secret {
      float: right;
    }
  }
}
.seek_inp{
  width: 90%;
  height: 30px;
  outline: none;
  border: 1px solid #cccccc;
  // border-radius: 5px;
  margin-bottom: 20px;
}
.history_box{
  padding:0;
  margin-bottom: 50px
}
.down{
  margin: 10px 10px 0 0;
  position: absolute;
  bottom: 10px;
  right: 0;
  height: 20px
}
.small{
  width: 20px;
  height: 20px;
  margin-right: 10px;
  text-align: center!important;
  font-size: 3px
}
.content_img{
  max-width: 285px;
  max-height: 285px;
  min-height: 50px;
  margin-bottom: 10px
}
.content_file{
  width: 180px;
  padding: 0;
  border: 1px solid #cccccc;
  border-radius: 8px;
  position: relative;
  .content_icon{
    display: inline-block;
    width: 50px;
    height: 50px;
    font-size: 30px;
    line-height: 50px
  }
  .content_h3{
    display: inline-block;
    position: absolute;
    top: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100px
  }
  .dow_height{
    height: 15px
  }

}
.login_img{
  text-align: center;
  color: #cccccc;
}
</style>
