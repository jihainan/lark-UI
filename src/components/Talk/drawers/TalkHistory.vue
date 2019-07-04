<template>
  <!-- 聊天记录的抽屉 -->
  <a-drawer
    id="ss"
    title="聊天记录"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='talkHistory'"
    ref="ss"
    v-if="hackReset"
    destroyOnClose
    key="2"
  >
    <sou :contactId="contactId" :hisGrop="hisGrop"></sou>
    <div class="login_img">
      没有更多信息...
    </div>
  </a-drawer>
</template>

<script>
import sou from './messageGrabble.vue'
export default {
  name: 'TalkHistory',
  props: {
    /** 抽屉挂载的元素 */
    mountEle: {
      type: String,
      default: '.conv-box',
      required: false
    },
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
        console.log('在这里加载数据')
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
.login_img{
  text-align: center;
  color: #cccccc;
}

</style>
