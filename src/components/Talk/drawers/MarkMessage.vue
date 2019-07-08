<template>
  <!-- 标记信息的抽屉 -->
  <a-drawer
    title="标记信息"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='markMessage'"
    destroyOnClose

  >
    <mark-message-grabble :groupId="groupId"></mark-message-grabble>
    <div class="login_img">
      没有更多信息...
    </div>
  </a-drawer>
</template>

<script>
import MarkMessageGrabble from './MarkMessageGrabble.vue'
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
    },
    groupId: {
      type: String,
      default: '',
      required: true
    }
  },
  components: {
    MarkMessageGrabble
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
      }
    }
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    },
    isCurrent () {
      this.flag = !this.flag
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
