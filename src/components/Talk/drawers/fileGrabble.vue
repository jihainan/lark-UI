<template>
  <div>
    <div style="width: 100%">
      <a-input-search
        placeholder="输入要搜索内容"
        @search="onSearch"
        enterButton
        type="text"
        v-model="searchVal"
        style="margin-bottom: 20px; width: 49%"
      />
      <!-- <span style="width: 49%;margin-left:20px">
        <a-button class="button_ma" @click="fileAll">全部</a-button>
        <a-button class="button_ma" @click="finish">已上传</a-button>
        <a-button class="button_ma" @click="pending">待审核</a-button>
      </span> -->
    </div>
    <ul class="history_box">
      <li>
        <div class="nav_box">
          <ul style="display: flex ">
            <li class="flex" style="flex:1.2">文件名</li>
            <li class="flex">上传者</li>
            <li class="flex">上传时间</li>
            <li class="flex">密级</li>
            <li class="flex" style="flex:0.8">操作</li>
          </ul>
        </div>
        <p></p>
      </li>
      <li v-for="(newItem,index) in NewItems" class="history_cotent" :key="index" :value="newItem.value">
        <a-list-item-meta class="file_name">
          <a-tooltip slot="title" :title="newItem.fileName">
            <a class="file_a" message="sss">{{ newItem.fileName }}</a> <!-- 文件名 -->
          </a-tooltip> <!-- 文件图片 -->
          <a-avatar slot="avatar" :src="newItem.url" style="border-radius:0;  font-size: 25px;" > <a-icon type="file"></a-icon> </a-avatar>
        </a-list-item-meta>
        <a-tooltip :title="newItem.reviser">
          <span class="file_sp">{{ newItem.reviser }}</span><!-- 人名  -->
        </a-tooltip>
        <a-tooltip :title="newItem.time">
          <div class="file_time">{{ newItem.time }}</div> <!-- 上传时间 -->
        </a-tooltip>
        <a>
          <div class="secret secret1">
            <a-tag color="orange" v-if="newItem.levels === '40'">秘密</a-tag>
            <a-tag color="tomato" v-if="newItem.levels === '60'">机密</a-tag>
            <a-tag color v-if="newItem.levels === '30'">非密</a-tag>
          </div>
        </a>
        <a :href="genDownLoadPath(newItem.fileId)" class="down">下载</a>
      </li>
      <li>
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-spin v-if="loadingMore"/>
          <a-button v-else @click="onLoadMore">加载更多文件</a-button>
        </div>
      </li>
      <li>
        <div v-if="loading" class="example">
          <a-spin />
        </div>
        <div v-if="noFile" class="login_img">
          没有更多文件...
        </div>
      </li>
    </ul>

  </div>

</template>
<script>
import { fileGrabble } from '@/api/talk.js'
import api from '@/api/talk'

export default {
  name: 'Rabble',
  props: {
    contactId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchVal: '',
      items: [],
      data: [],
      loading: false,
      loadingMore: false,
      showLoadingMore: false,
      item: [],
      pageNumber: 1,
      flag: false,
      noFile: false,
      state: ''
    }
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 生成下载路径
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId
    },
    onSearch (value) {
      console.log(value)
    },
    // 提示
    openNotification () {
      this.$notification.warning({
        message: '无法获取文件，稍后再试',
        description: '',
        onClick: () => {
          console.log('Notification Clicked!')
        }
      })
    },

    getData (callback) {
      this.loading = true
      this.showLoadingMore = false
      const options = {
        id: this.contactId,
        state: this.state,
        page: this.pageNumber,
        size: 5
      }
      fileGrabble(options).then(data => {
        this.loading = false
        this.showLoadingMore = true
        if (data.result.data.length < 5) {
          this.showLoadingMore = false
          this.loading = false
          this.noFile = true
        }
        const datas = data.result.data
        datas.map(item => {
          this.data.push(item)
          this.loading = false
        })
      }).catch(res => {
        this.openNotification()
        this.loading = false
        this.showLoadingMore = true
      })
    },
    onLoadMore () {
      this.state = ''
      this.loadingMore = true
      this.pageNumber++
      this.getData((res) => {
        this.data = this.data.concat(res.results)
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
      this.loadingMore = false
    },
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    },
    fileAll () {
      this.state = ''
      this.getData()
    },
    finish () {
      this.state = '1'
      this.getData()
    },
    pending () {
      this.state = '0'
      this.getData()
    }
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.data.map(function (item) {
        if (item.fileName.search(_this.searchVal) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  }
}
</script>

<style lang="less" scoped>
.seek_inp{
  width: 90%;
  height: 30px;
  outline: none;
  border: 1px solid #cccccc;
  border-radius: 5px 0 0 5px;
  margin-bottom: 20px;
}
.history_box{
  margin-bottom: 100px;
  overflow: hidden;
  list-style: none;
  padding: 0;
  .history_cotent{
    height: 55px;
    margin-bottom: 5px;
  }
}
.ant-list-item-meta{
  float: left;
  width: 144px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 55px;
  h4{
    line-height: 55px;
    width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }
}
.file_name{
  float: left;
  margin-right: 20px;
  line-height: 55px;
}
.file_sp{
  float: left;
  display: block;
  width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  margin-right: 30px;
  text-align: left;
  // line-height: 55px
  margin-top: 18px
}

.file_time{
  float: left;
  margin-right: 20px;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // line-height: 55px
  margin-top: 18px
}
.secret1{
  float: left;
  margin-right: 12px;
  line-height: 55px
}
.down{
  float:right;
  line-height: 50px;
}
.nav_box {
  width: 100%;
  height: 20px;
  ul {
    width: 100%;
    li {
      list-style: none;
      text-align: right;
      // width: 50px;
      // float: left;
      // font-size: 15px;
      &:nth-child(1) {
        text-align: left
      };
      &:nth-child(2) {
        text-align: left
      }
      // &:nth-child(3) {
      //   text-align: right
      // }
      // &:nth-child(4) {
      //  text-align: right
      // }
    }
  }
}
.login_img{
  text-align: center;
  color: #cccccc;
}

.example {
    text-align: center;
    border-radius: 4px;
    margin: 10px 0 20px 0;
  }
.button_ma{
  flex: 1;
  margin: 0 10px 0 0;
  &:nth-child(3){
    margin: 0
  }

}
.flex{
  flex: 1
}
</style>
