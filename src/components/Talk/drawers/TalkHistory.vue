<template>
  <!-- 聊天记录的抽屉 -->
  <a-drawer
    title="聊天内容"
    placement="right"
    :wrapStyle="{marginTop: '64px',overflow: 'auto', paddingBottom: '108px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='talkHistory'"
    destroyOnClose
    key="2"
  >
    <sou :contactId="contactId" :hisGrop="hisGrop"></sou>
  </a-drawer>
</template>

<script>
import sou from './messageGrabble.vue'
export default {
  name: 'TalkHistory',
  props: {
    /** 抽屉挂载的元素 */
    // mountEle: {
    //   type: String,
    //   default: '.conv-box',
    //   required: false
    // },
    activeOption: {
      type: String,
      default: ''
    },
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
      items: [],
      color: '',
      // changeTimer: null,
      hackReset: true,
      visible: false
    }
  },
  components: {
    sou
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'talkHistory') {
      }
    }
  },
  created () {
  },
  mounted () {
    window.addEventListener('scroll', (this.lazyLoading), true)
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.visible = false
      this.$emit('closeDrawer')
    },

    onSearch (value) {
      console.log(value)
    }

  }
}
</script>

<style lang="less" scoped>
body{
  .ant-drawer .ant-drawer-content {
    width: 100%;
    height: 92%;
  }
}
  .ant-drawer .ant-drawer-content {
    width: 100%!important;
    height: 92%!important;
}
</style>
