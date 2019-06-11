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

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a>加入常用</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>所属部门</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>更新时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <span>使用量</span>
              <p>{{ item.downloadNum }}</p>
            </div>
            <div class="list-content-item">
              <a-rate :defaultValue="item.star" disabled />
            </div>
          </div>
        </a-list-item>
      </a-list>

    </a-card>
  </div>
</template>

<script>

const data = []
data.push({
  title: 'PDM',
  avatar: '/tools/Icon-PDM.png',
  description: '项目数据管理系统，管理结果数据。',
  owner: '一室',
  startAt: '2018-07-26 22:44',
  star: 3,
  downloadNum: 133
})
data.push({
  title: 'MPM',
  avatar: '/tools/Icon-MPM.png',
  description: '项目管理信息系统，对项目进行管理。',
  owner: '十一室',
  startAt: '2018-07-26 22:44',
  star: 4,
  downloadNum: 121
})
data.push({
  title: '协同办公',
  avatar: '/tools/Icon-OA.png',
  description: '日常办公',
  owner: '八室',
  startAt: '2018-07-26 22:44',
  star: 1,
  downloadNum: 12
})
data.push({
  title: 'TDM',
  avatar: '/tools/Icon-TDM.png',
  description: '试验数据管理信息系统',
  owner: '九室',
  startAt: '2018-07-26 22:44',
  star: 3,
  downloadNum: 3
})

export default {
  name: 'StandardList',
  components: {
  },
  data () {
    return {
      data
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
