<template>
  <div>
    <a-card
      :loading="loading"
      :headStyle="headStyle"
      :bodyStyle="bodyStyle"
      :bordered="true"
      :title="content.title"
      :style="{ minHeight: '350px', borderRadius: '4px' }">
      <a-popover
        placement="left"
        slot="extra"
        trigger="click">
        <template slot="content">
          <a slot="content">移除卡片</a>
        </template>
        <a href="#"><a-icon type="ellipsis" /></a>
      </a-popover>
      <div v-if="content.title == '待办事项'">

      </div>
      <div v-else>
        <card-content :listData="contentData"/>
        <div style="justify-content: center;position: absolute;bottom: 0;width: 100%;">
          <a-button class="footer-more" size="small" ghost block>全部</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
import CardContent from '@/components/monitor/card/CardContent'
export default {
  name: 'Card',
  components: {
    CardContent
  },
  data () {
    return {
      loading: true,
      headStyle: { height: '52px', 'border-top': '4px solid #1890ff', 'border-bottom': 'none' },
      bodyStyle: { padding: '0' },
      content: this.cardData,
      contentData: []
    }
  },
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  created () {
    this.$http.get(this.content.url)
      .then(res => {
        this.loading = false
        this.contentData = res.result.data
      })
  }
}
</script>
<style lang="less" scoped>
.card-footer{
  position: absolute;
    bottom: 0;
}
    .footer-more{
        border:0;
        color: #a6a6a6;
        font-size: 12px;
        // background: linear-gradient(180deg,#ffffff,#e0e0e0) !important;
    }
    .footer-more:hover{
      color: #1890ff;
    }
</style>
