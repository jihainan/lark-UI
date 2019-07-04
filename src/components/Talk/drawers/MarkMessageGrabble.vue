<template>
  <div>
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
            <p @click="isCurrent(item.content.title)" :class="{'current':flag}">{{ item.content.title }}</p>
          </div>
          <div class="history_right">
            <span>{{ item.time }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '60'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '30'">非密</a-tag>
            </div>
          </div>
        </div>
        <div class="borderDiv" v-if="item.content.type == 3" >
          <!-- <img :src="item.avatar" class="content_l" :alt="item.username"> -->
          <a-avatar class="content_l" shape="square" size="large" :src="item.avatar" >{{ item.username }}</a-avatar>
          <div class="content_r">
            <h3 class="user_name">{{ item.username }}</h3>
            <p></p>
            <img :src="item.content.url" alt="图片加载失败" class="content_img">
          </div>
          <div class="history_right">
            <span>{{ item.time }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '60'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '30'">非密</a-tag>
            </div>

          </div>
          <a-button class="down dow_height" type="primary" icon="download" @click="down( item.content.url.match(/Id=([a-zA-Z0-9]+)/g))" :disabled="Dowflag"></a-button>
        </div>
        <div class="borderDiv" v-if="item.content.type == 2">
          <!-- <img :src="item.avatar" class="content_l" alt> -->
          <a-avatar class="content_l" shape="square" size="large" :src="item.avatar" >{{ item.username }}</a-avatar>
          <div class="content_r">
            <h3 class="user_name">{{ item.username }}</h3>
            <dir class="content_file">
              <a-icon class="content_icon" type="file"/>
              <h3 class="content_h3" style=" width: 100px,  padding:0">{{ item.content.title }}</h3>
            </dir>
          </div>
          <div class="history_right">
            <span>{{ item.time }}</span>
            <div class="secret" style="margin: 6px 0 0 20px">
              <a-tag color="orange" v-if="item.content.secretLevel == '70'">秘密</a-tag>
              <a-tag color="tomato" v-if="item.content.secretLevel == '80'">机密</a-tag>
              <a-tag color="" v-if="item.content.secretLevel == '60'">非密</a-tag>
            </div>
          </div>
          <a-button class="down dow_height" type="primary" icon="download" @click="down( item.content.url.match(/Id=([a-zA-Z0-9]+)/g))" :disabled="Dowflag"></a-button>
        </div>
      </li>
    </ul>
    <a-button v-if="isShow" @click="getMark" style="margin: auto; display: block;"> 加载失败，点击重试</a-button>
  </div>

</template>
<script>
import { fileDownload, MarkMessageGrabble } from '@/api/talk.js'
export default {
  name: 'Rabble',
  directives: { scroll },
  props: {
    groupId: {
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
    this.activeOption = 'markMessage'
    this.getMark()
  },
  mounted () {
    window.addEventListener('scroll', (this.lazyLoading), true)
  },
  beforeDestroy () {
    this.activeOption = ''
  },
  updated () {
  },

  methods: {
    onSearch (value) {
      console.log(value)
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
    getMark () {
      this.userId = this.$store.getters.userId
      // this.userId, this.contactId, this.page
      MarkMessageGrabble(this.userId, this.page, this.groupId).then(data => {
        const datas = data.result.data
        datas.map((item, index, array) => {
          this.items.push(item)
        })
      }).catch(res => {
        this.isShow = true
        this.openNotification()
      })
    },
    down (id) {
      fileDownload(id).then(item => {
        // if (item === 1) {
        //   this.flag = true
        // }
        window.open('/api/chat/zzFileManage/downloadFile' + '?file' + id, '_self')
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

          if (this.activeOption === 'markMessage') {
            // this.getHistory()
            MarkMessageGrabble(this.userId, this.page, this.groupId).then(data => {
              const datas = data.result.data
              datas.map((item, index, array) => {
                this.items.push(item)
              })
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
  // height: 55px;
  // line-height: 55px;
  // display: block
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
    top: 0
  }
  .dow_height{
    height: 15px;
  }

}
</style>
