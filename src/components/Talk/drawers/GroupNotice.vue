<template>
  <!-- 群公告的抽屉 -->
  <a-drawer
    title="群公告"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='groupNotice'">

    <div class="notice-p"> {{ item.content }} <p></p></div>
    <span class="notice-s">发布时间 : {{ item.createTime }}</span>
  </a-drawer>
</template>

<script>
export default {
  name: 'GroupNotice',
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
      time: '',
      item: {}
    }
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'groupNotice') {
        console.log('在这里加载数据')
        this.getContent()
      }
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {},
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    },
    getContent () {
      this.$http.get('https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/notice').then((data) => {
        this.item = data
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .notice-p{
     text-align:left;
     text-indent:2em;
     padding-bottom:10px;
     border-bottom: 1px solid #cccccc;
     font-size: 20px;
     margin-bottom: 20px
  }
  .notice-s{
    float: right
  }
</style>
