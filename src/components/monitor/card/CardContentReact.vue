<template>
  <div>
    <div v-if="listData.length!=0" class="card-content">
      <a-list
        :bordered="bordered"
        :dataSource="listData.slice(0, 8)"
        class="card-list"
      >
        <a-list-item style="padding: 3px 21px 3px 21px" slot="renderItem" slot-scope="item">
          <a-list-item-meta v-if="item.msgType==='1'">
            <div slot="title">{{ item.msgSender+'：'+item.msg }}</div>
            <a-avatar slot="avatar" :src="fileurl+''+item.avatar">
              <span>{{ item.msgSender }}</span>
            </a-avatar>
          </a-list-item-meta>
          <div v-if="item.msgType==='1'">{{ item.sendTime|timeFormat }}</div>
        </a-list-item>
      </a-list>
    </div>
    <div v-else style="margin: 40px auto 0 auto;text-align: center;" class="card-content">
      <a-icon type="file-exclamation" theme="twoTone" :style="fontSize" />
      <p class="description">卡片暂无内容</p>
    </div>
  </div>
</template>
<script>
import { toWeiXinString } from '@/utils/util'
import { FILE_SERVER_IP } from '@/utils/constants'
export default {
  name: 'CardContent',
  data () {
    return {
      bordered: false,
      fontSize: { fontSize: '52px' },
      list: [],
      fileurl: FILE_SERVER_IP
    }
  },
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  filters: { timeFormat: toWeiXinString },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
    .card-list{
      .ant-list-item{
        cursor: pointer;
        transition: background-color 218ms;
        border-bottom: 0px solid #e8e8e8;
      }
      .ant-list-item:hover{
        background-color: #f5f5f5;
      }
    }
</style>
