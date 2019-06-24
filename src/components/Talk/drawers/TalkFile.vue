<template>
  <!--群文件的抽屉 -->
  <a-drawer
    title="文件"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="510"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='talkFile'"
  >
    <file-grabble></file-grabble>

  </a-drawer>
</template>

<script>
import infiniteScroll from 'vue-scroll'
import fileGrabble from './fileGrabble.vue'
export default {
  directives: { infiniteScroll },
  name: 'TalkFile',
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
      data: []
    }
  },
  created () {},
  watch: {
    activeOption (newValue) {
      if (newValue === 'talkFile') {
        console.log('在这里加载数据')
      }
    }
  },
  components: {
    fileGrabble
  },
  methods: {
    onSearch (value) {
      console.log(value)
    },

    //   /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    }
  }

}
</script>

 <style lang="less" scoped>
    .ant-avatar-image{
      border-radius: 0
    }
</style>
