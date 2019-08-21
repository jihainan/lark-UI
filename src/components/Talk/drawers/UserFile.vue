<template>
  <!--个人文件的抽屉 -->
  <a-drawer
    title="文件"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="510"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='userFile'"
    :destroyOnClose="true"
  >
    <user-file-grabble :contactId="contactId"></user-file-grabble>

  </a-drawer>
</template>

<script>
import infiniteScroll from 'vue-scroll'
import userFileGrabble from './UserFileGrabble.vue'
export default {
  directives: { infiniteScroll },
  name: 'UserFile',
  props: {
    /** 抽屉挂载的元素 */
    // mountEle: {
    //   type: String,
    //   // default: '.conv-box',
    //   required: false
    // },
    activeOption: {
      type: String,
      default: '',
      required: true
    },
    contactId: {
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
  created () {
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'userFile') {
      }
    }
  },
  components: {
    userFileGrabble
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
