<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    :overlayStyle="{ width: '300px', top: '50px' }">
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-list>
          <a-list-item v-for="msg in msglist.slice(0,6)" :key="msg.id">
            <router-link :to="{ name: 'MsgList' }">
              <!-- TODO 接口暂未提供发布时间 -->
              <!-- <a-list-item-meta :description="msg.date|timeFormat" :title="msg.title"> -->
              <a-list-item-meta :title="msg.title">
                <a-avatar style="background-color: white" slot="avatar" :src="getImgPath(msg.type)"/>
              </a-list-item-meta>
            </router-link>
          </a-list-item>
          <a-list-item key="item-all" style="margin-left:45px;margin-top:10px">
            <router-link :to="{ name: 'MsgList' }">
              <a-list-item-meta title="查看全部" @click="visible = false">
              </a-list-item-meta>
            </router-link>
          </a-list-item>
        </a-list>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge :count="msgNum">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { getNotice } from '@/api/workplace'
import { toWeiXinString } from '@/utils/util'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loadding: false,
      visible: false,
      msglist: [],
      msgNum: 0
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  filters: { timeFormat: toWeiXinString },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loadding = true
        return getNotice({ 'orgCode': this.userInfo.orgCode }).then(res => {
          if (res.status === 200) {
            this.msglist = res.result.data
            this.msgNum = res.result.count
            this.loadding = false
          }
        })
      } else {
        this.loadding = false
      }
      this.visible = !this.visible
    },
    /**
     * 根据消息类型获取消息图标
     */
    getImgPath (item) {
      if (item === 'admin') {
        return '/tools/Icon-msg-admin.png'
      } else {
        return '/tools/Icon-msg-sys.png'
      }
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
