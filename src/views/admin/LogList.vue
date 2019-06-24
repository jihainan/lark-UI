<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="32" type="flex" justify="end">
            <a-col :span="4">
              <a-form-item label="菜单">
                <a-input v-model="queryParam.opt"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="stable"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="false"
      >
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import { getGateLog } from '@/api/admin'
export default {
  name: 'GateLogList',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单',
          dataIndex: 'menu'
        },
        {
          title: '请求',
          dataIndex: 'opt'
        },
        {
          title: 'uri',
          dataIndex: 'uri'
        },
        // {
        //   title: '创建账号',
        //   dataIndex: 'crtUser'
        // },
        {
          title: '创建人',
          dataIndex: 'crtName'
        },
        {
          title: '创建时间',
          dataIndex: 'crtTime'
        },
        {
          title: '主机',
          dataIndex: 'crtHost'
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGateLog(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      }
    }
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    }
  }
}
</script>
