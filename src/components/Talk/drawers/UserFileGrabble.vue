<template>
  <div>
    <!-- <input type="text" class="seek_inp" placeholder="输入要搜索内容" v-model="searchVal" >
    <a-button type="primary" icon="search" style="border-radius:0 5px 5px 0"></a-button> -->
    <a-input-search
      placeholder="输入要搜索内容"
      @search="onSearch"
      enterButton
      type="text"
      v-model="searchVal"
      style="margin-bottom: 20px"
    />
    <ul class="history_box">
      <li>
        <div class="nav_box">
          <ul>
            <li>文件名</li>
            <li>上传者</li>
            <li>上传时间</li>
          </ul>
        </div>
      </li>
      <li v-for="(newItem,index) in NewItems" class="history_cotent" :key="index" :value="newItem.value">
        <!-- {{ NewItems }} -->
        <a-list-item-meta class="file_name">
          <a-tooltip slot="title" :title="newItem.fileName">
            <a class="file_a" message="sss">{{ newItem.fileName }}</a> <!-- 文件名 -->
          </a-tooltip>
          <!-- <a-avatar slot="avatar" :src="newItem.url" style="border-radius:0" />   -->
          <a-avatar slot="avatar" :src="newItem.url" style="border-radius:0;  font-size: 25px;" > <a-icon type="file"></a-icon> </a-avatar><!-- 文件图片 -->
          <!-- <a-icon class="content_icon" type="file"/> -->
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
        <a :href="genDownLoadPath(newItem.fileId)" class="down" download>下载</a>
      </li>
      <li>
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-spin v-if="loadingMore"/>
          <a-button v-else @click="onLoadMore">loading more</a-button>
        </div>
      </li>
    </ul>

  </div>

</template>
<script>
import { userfileGrabble, fileDownload } from '@/api/talk.js'
import api from '@/api/talk'

export default {
  name: 'Rabble',
  props: {
    contactId: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      searchVal: '',
      items: [],
      data: [],
      loading: false,
      loadingMore: false,
      showLoadingMore: true,
      item: [],
      pageNumber: 1,
      flag: false,
      userId: ''
    }
  },
  created () {
  },
  mounted () {
    this.getData(res => {
      this.loading = false
      this.data = res.results
    })
  },
  methods: {
    /** 生成下载路径 */
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId
    },
    onSearch (value) {
      console.log(value)
    },

    getData (callback) {
      this.userId = this.$store.getters.userId
      userfileGrabble(this.userId, this.contactId, this.pageNumber).then(data => {
        if (data.result.data.length < 5) {
          this.showLoadingMore = false
        }
        // callback(data.result.data)
        const datas = data.result.data
        datas.map(item => {
          this.data.push(item)
        })
      })
    },
    onLoadMore () {
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
    down (id) {
      fileDownload(id).then(item => {
        // if (item === 1) {
        //   this.flag = true
        // }
        window.open('/api/chat/zzFileManage/downloadFile' + '?fileId=' + id, '_self')
      })
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
      width: 50px;
      float: left;
      font-size: 11px;
      &:nth-child(1) {
        margin-right: 55px;
      }
      &:nth-child(2) {
        margin-right: 50px;
      }
    }
  }
}

</style>
