<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="工具列表">

      <div slot="extra">
        <a-radio-group>
          <a-radio-button>全部</a-radio-button>
          <a-radio-button>已选</a-radio-button>
          <a-radio-button>未选</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list size="large">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="'/tools/Icon-'+item.description+'.png'"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="addId(item.id), isShow($event, index)" v-if="flag[index]">加入常用</a>
            <a @click="removeId(item.id), isShow($event, index)" v-if="flags[index]">已添加</a>
          </div>
          <div class="list-content">
            <!-- <div class="list-content-item">
              <span>所属部门</span>
              <p>{{ item.owner }}</p>
            </div> -->
            <!-- <div class="list-content-item">
              <span>使用量</span>
              <p>{{ item.downloadNum }}</p>
            </div> -->
            <div class="list-content-item">
              <span>更新时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <a-rate :defaultValue="item.star" disabled />
            </div>
          </div>
        </a-list-item>
      </a-list>
      <div v-text="t" style="display:none"></div>
    </a-card>
  </div>
</template>
<script>
import { setCheckCommonTools, getSelfCommonTools, delCheckCommonTools } from '@/api/setting'
export default {
  name: 'StandardList',
  components: {
  },
  data () {
    return {
      flags: [],
      flag: [],
      data: [],
      t: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    /**
     * 添加个人常用工具
     */
    addId (id) {
      setCheckCommonTools({ 'toolId': id })
        .then(res => {
          if (res.status === 200) {
            this.$notification['success']({
              message: '操作成功',
              duration: 2
            })
          }
        })
    },
    /**
     * 取消个人常用工具
     */
    removeId (id) {
      delCheckCommonTools({ 'commonToolId': id })
        .then(res => {
          if (res.status === 200) {
            this.$notification['success']({
              message: '取消常用',
              duration: 2
            })
          }
        })
    },
    /**
     * 加入常用/已添加 按钮切换
     */
    isShow ($event, index) {
      this.t = Math.random()
      this.flag[index] = !this.flag[index]
      this.flags[index] = !this.flags[index]
    },
    /**
     * 获取工具
     */
    getData () {
      getSelfCommonTools().then(res => {
        const datas = res.result.data
        datas.map(item => {
          this.data.push(item)
          if (item.defaultChecked === true) {
            this.flags.push(true)
            this.flag.push(false)
          } else {
            this.flags.push(false)
            this.flag.push(true)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>
