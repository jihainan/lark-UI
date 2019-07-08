<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-list style="margin-left:20px">
          <a-list-item v-for="msg in msglist.slice(0,6)" :key="msg.id">
            <router-link :to="{ name: 'myNotice' }">
              <a-list-item-meta :title="msg.title" @click="visible = false"></a-list-item-meta>
            </router-link>
          </a-list-item>
        </a-list>
        <span style="margin-left:60px;font-weight:bold">
          <router-link :to="{ name: 'myNotice' }">查看全部</router-link>
        </span>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-icon :style="{'fontSize':'18px'}" type="bell" theme="twoTone" />
      <!-- <a-badge :count="msgNum">
      </a-badge>-->
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
        return getNotice({ orgCode: this.userInfo.orgCode }).then(res => {
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
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
