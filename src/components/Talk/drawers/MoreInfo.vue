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
      :destroyOnClose="true"
    >
      <div class="user_box">
        <!-- <img :src="items.avatar" alt=""> -->
        <a-avatar class="content_l" shape="square" :size="60" :src="items.avatar" style="background: #00a2ae">{{ items.name }}</a-avatar>
        <div class="secret" style="margin: 6px 0 0 20px, width:30px">
          <a-tag color="orange" v-if="items.secretLevel === '40'">秘密</a-tag>
          <a-tag color="tomato" v-if="items.secretLevel === '60'">机密</a-tag>
          <a-tag color="" v-if="items.secretLevel === '30'">非密</a-tag>
        </div>
        <a-tooltip placement="bottom" :title="items.name">
          <p class="more_name">{{ items.name }}</p>
        </a-tooltip>
      </div>
      <div class="more_list">
        <h4 class="float">备注:</h4>
        <p class="line_height">{{ items.remark }}</p>
      </div>
      <div class="more_list">
        <h4 class="float">电话:</h4>
        <p class="line_height">{{ items.phone }}</p>
      </div>
      <div class="more_list">
        <h4 class="float">职称:</h4>
        <p class="line_height">{{ items.proTitle }}</p>
      </div>
      <div class="more_list">
        <h4 class="float">人员所在组织:</h4>
        <p class="line_height">{{ items.orgName }}</p>
      </div>
      <!-- <div class="switch">
        <div class="switch_top">
          <p>消息免打扰</p>
          <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="false"/>
        </div>
        <div>
          <p>置顶聊天</p>
          <a-switch checkedChildren="开" unCheckedChildren="关" :defaultChecked="false"/>
        </div>
      </div> -->
    </a-drawer>
  </div>
</template>
<script>
import { getContactsInfo } from '@/api/talk.js'
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
    },
    contactId: {
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

  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'personMoreInfo') {
        getContactsInfo(this.contactId).then((item) => {
          this.items = item.result
        })
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('closeDrawer')
    }

  }
}
</script>
<style lang="less" scoped>
    .secret{
      display: inline-block;
      float: right;
    }
    .float{
      float: left;
      margin-right: 20px;
      margin-bottom: 0;
      width: 100px
    }
    .line_height{
      // line-height: 25px;
      display: inline-block;
      text-align:left;
      text-indent:2em;
    }
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
      width: 100%;
      display: inline-block;
      img{
        width: 60px;
        height: 60px;
        display: inline-block;
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
    .more_list{
      margin-top: 15px;
      height: 40px;
    }
    .more_name{
      width: 60px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
</style>
