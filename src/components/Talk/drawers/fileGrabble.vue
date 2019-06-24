<template>
  <div>
    <input type="text" class="seek_inp" placeholder="输入要搜索内容" v-model="searchVal" >
    <a-button type="primary" icon="search" style="border-radius:0"></a-button>

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

        <a-list-item-meta class="file_name">
          <a class="file_a" slot="title">{{ newItem.name.last }}</a>
          <a-avatar slot="avatar" :src="newItem.url"/>
        </a-list-item-meta>
        <span class="file_sp">{{ newItem.name.title }}</span>
        <div class="file_time">{{ newItem.time }}</div>
        <a href>
          <div class="secret secret1">
            <a-tag color="orange" v-if="newItem.Concentrated === 'secret'">保密</a-tag>
            <a-tag color="tomato" v-if="newItem.Concentrated === 'top-secret'">机密</a-tag>
            <a-tag color v-if="newItem.Concentrated === 'no-secret'">非密</a-tag>
          </div>
        </a>
        <a class="down">下载</a>

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
export default {
  name: 'Rabble',
  data () {
    return {
      searchVal: '',
      items: [],
      data: [],
      loading: false,
      loadingMore: false,
      showLoadingMore: true,
      item: []
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
    onSearch (value) {
      console.log(value)
    },

    getData (callback) {
      this.$http.get('https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/file').then(data => {
        callback(data)
      })
    },
    onLoadMore () {
      this.loadingMore = true
      this.getData(res => {
        this.data = this.data.concat(res.results)
        this.loadingMore = false
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    },
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    }
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.data.map(function (item) {
        if (item.name.last.search(_this.searchVal) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  }
}
</script>

<style lang="less" scoped>
ul{
  margin-bottom: 100px;
  overflow: hidden;
  .history_box{
  height: 55px;
  margin-bottom: 50px;
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
  }
}
.file_name{
  float: left;
  margin-right: 20px;
  line-height: 55px
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
  line-height: 55px
}
.file_time{
  float: left;
  margin-right: 20px;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 55px
}
.secret1{
  float: left;
  margin-right: 12px;
  line-height: 55px
}
.down{
  float:right;
  height: 55px;
  line-height: 55px;
  display: block
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
      font-size: 5px;
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
