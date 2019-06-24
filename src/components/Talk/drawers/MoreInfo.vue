<template>
  <div>
    <!-- <a-button type="primary" @click="showDrawer">
      Open
    </a-button> -->
    <a-drawer
      title="更多"
      placement="right"
      :closable="false"
      @close="onClose"
      :width="448"
      :visible="activeOption=='personMoreInfo'"
      :wrapStyle="{marginTop: '64px'}"

    >
      <div class="add_box">
        <a-button class="add">
          <a-icon class="add_icon" type="plus" />
        </a-button>
        <p>添加</p>
      </div>
      <div class="user_box">
        <img :src="items.avatar" alt="">
        <p>{{ items.name }}</p>
      </div>
      <div class="switch">
        <div class="switch_top">
          <p>消息免打扰</p>
          <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="false"/>
        </div>
        <div>
          <p>置顶聊天</p>
          <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="false"/>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  name: 'PersonMoreInfo',
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
      visible: false,
      items: []
    }
  },
  created () {
    this.$http.get('/admin/user/front/info').then((item) => {
      this.items = item.result
    })
  },
  methods: {
    onClose () {
      this.$emit('closeDrawer')
    }

  }
}
</script>
<style lang="less" scoped>
    .add_box{
      margin: 0 50px 0 2px;
      width: 60px;
      display: inline-block;
      .add{
        width: 60px;
        height: 60px;
        border: 2px solid #cccccc;
        .add_icon{
          font-size: 30px;
          display: block;
        }
      }
      p{
        width: 60px;
        text-align: center
      }
    }
    .user_box{
      margin: 0 5px 0 2px;
      width: 60px;
      display: inline-block;
      img{
        width: 60px;
        height: 60px;
        display: block;
      }
      p{
        width: 60px;
        text-align: center
      }
    }
    .switch{
      margin-left: 5px;
      p{
        margin-bottom: 0
      }
      .switch_top{
        margin: 30px 0 10px 0
      }
    }
</style>
