<template>
  <!-- 标记信息的抽屉 -->
  <a-drawer
    title="标记信息"
    placement="right"
    :getContainer="mountEle"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='markMessage'"
  >
    <a-input-search class="a-input" placeholder="input search text" @search="onSearch" enterButton/>

    <div class="history_cotent" v-for="item in items" :key="item.id">
      <img :src="item.avatar" class="content_l" alt>
      <div class="content_r">
        <h3>{{ item.name }}</h3>
        <p @click="isCurrent()" :class="{'current':flag}">{{ item.lastMessage }}</p>
      </div>
      <div class="history_right">
        <span>2013-2-2 22:22</span>
        <div class="secret" style="margin: 6px 0 0 20px">
          <a-tag color="orange" v-if="item.Concentrated === 'secret'">秘密</a-tag>
          <a-tag color="tomato" v-if="item.Concentrated === 'top-secret'">机密</a-tag>
          <a-tag color v-if="item.Concentrated === 'no-secret'">非密</a-tag>
        </div>
      </div>
    </div>
    <div class="login_img">
      <a-spin/>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'MarkMessage',
  props: {
    /** 抽屉挂载的元素 */
    mountEle: {
      type: String,
      default: '.conv-box',
      required: false
    },
    activeOption: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      flag: true,
      items: [],
      color: ''
    }
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'markMessage') {
        console.log('在这里加载数据')
        this.getHistory()
      }
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    window.addEventListener('scroll', this.lazyLoading, true)
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    },
    isCurrent () {
      this.flag = !this.flag
    },
    getHistory () {
      this.$http
        .get('https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/history')
        .then(data => {
          const datas = data.result.data
          this.page = data.result.pageNo
          const dataa = datas.map((item, index, array) => {
            return item
          })
          this.items.push(...dataa)
        })
    },
    onSearch (value) {
      console.log(value)
    },
    // 滚动获取数据
    lazyLoading () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight + 10 >= scrollHeight) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getHistory()
        }, 1200)
      } else {
      }
    }
  }
}
</script>

<style lang="less" scope>
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
  border-bottom: 1px solid #cccccc;
  .content_l {
    width: 40px;
    height: 40px;
    // background-image: url("./file.jpg");
    background-size: 30px 30px;
    position: absolute;
    top: 10px;
    left: 0;
  }
  .content_r {
    display: inline-block;
    margin-left: 50px;
    box-sizing: border-box;
    h3 {
      margin-bottom: 0;
      padding-top: 6px;
      width: 150px;
    }
    p {
      // width: 250px;
      border-radius: 5px;
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
</style>
