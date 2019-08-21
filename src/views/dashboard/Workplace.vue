<template>
  <div style="margin-bottom: 64px;">
    <a-spin tip="加载中,请稍候..." v-if="loading" style="z-index:200;">
      <div class="spin-content">
      </div>
    </a-spin>
    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="isDesktop() ? 'desktop' : ''">
      <grid-layout
        :layout.sync="cardList"
        :col-num="2"
        :row-height="61"
        :max-rows="12"
        :is-draggable="true"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="grid in cardList"
          dragAllowFrom=".ant-card-head"
          :minH="cardSize.minH"
          :maxH="cardSize.maxH"
          :minW="cardSize.minW"
          :key="grid.id"
          :x="grid.x"
          :y="grid.y"
          :w="1"
          :h="5"
          :i="grid.i"
          :vertical-compact="true"
          @moved="moved"
        >
          <l-card :cardData="grid" :unRequstType="config" @refreshCard="refreshCard" @loadingDone="loadingDone">
          </l-card>
        </grid-item>
      </grid-layout>
    </div>
    <!--这个地方放置最近访问-->
    <footer-tool-bar :style="{height:'72px', width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <div class="tool-list">
        <div class="tool-item" v-for="item in toolList" :key="item.id">
          <a @click="openExlink(item.uri)">
            <img :src="'/images/tools/Icon-'+item.description+'.png'" width="40" height="40" :alt="item.description" :title="item.title"/>
          </a>
          <div class="tool-name">{{ item.title }}</div>
        </div>
      </div>
    </footer-tool-bar>
    <div v-if="cardList.length===0&&!loading">
      <div class="img_arrow">
        <img src="/arrow.png"/>
      </div>
      <div class="exception">
        <div class="img">
          <img src="/images/exceptionImg/500.svg"/>
        </div>
        <div class="content">
          <div class="desc">温馨提示：在账户设置/卡片设置中，可维护常用卡片</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import FooterToolBar from '@/components/FooterToolbar'
import VueGridLayout from 'vue-grid-layout'
import LCard from '@/views/dashboard/Card'
import { getCommonTools, getUserCard, moveUserCard } from '@/api/workplace'
import { mapGetters } from 'vuex'

export default {
  name: 'Monitor',
  mixins: [mixin, mixinDevice],
  data () {
    return {
      cardList: [],
      cardSize: { maxH: 5, minH: 5, maxW: 1, minW: 1 },
      // items: generateItems(50, i => ({ id: i, data: 'Draggable' + i }))
      is: [],
      ids: [],
      index: '',
      toolList: [],
      cardmap: new Map(),
      loading: true,
      cardLoad: [],
      // 不需要请求数据的卡片类型
      config: ['intro', 'local', 'activity']
    }
  },
  components: {
    LCard,
    FooterToolBar,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  computed: {
    ...mapGetters(['userPId'])
  },
  created () {
    this.getSelfWorkplace()
    this.getSelfTools()
  },
  methods: {
    getSelfWorkplace () {
      getUserCard()
        .then(res => {
          this.cardList = []
          const dataTemp = res.result.data
          for (var i = 0; i < dataTemp.length; i++) {
            const temp = {}
            temp.id = dataTemp[i].id
            temp.x = 1 * parseInt((parseInt(dataTemp[i].i) + 1) % 2)
            temp.y = 5 * parseInt(dataTemp[i].i / 2)
            temp.w = 1
            temp.h = 5
            temp.i = dataTemp[i].i
            temp.type = dataTemp[i].type
            temp.title = dataTemp[i].title
            temp.url = dataTemp[i].url
            this.cardList.push(temp)
          }
          // 当常用卡片个数为0 或设置的卡片全部不需要请求后台数据时，加载样式关闭
          if (dataTemp.length === 0) {
            this.loading = false
          }
          let check = false
          check = this.config.some(item => {
            dataTemp.forEach(card => {
              if (item !== card.type) {
                return true
              }
            })
          })
          if (!check) {
            this.loading = false
          }
        })
    },
    /**
     * 获取个人常用工具栏信息 byfanjiao
     */
    getSelfTools () {
      getCommonTools().then(res => {
        this.toolList = res.result.data
      })
    },
    /**
     * 子组件点击移除卡片后触发 by fanjiao
     */
    refreshCard () {
      this.getSelfWorkplace()
    },
    /**
     * 子组件反馈数据加载完成
     * by fanjiao
     */
    loadingDone () {
      this.cardLoad.push(true)
      let length = 0
      this.cardList.forEach(item => {
        if (this.config.indexOf(item.type) === -1) {
          length++
        }
      })
      // 卡片数据全部加载完成后，'加载中'的样式关闭
      if (this.cardLoad.length === length) {
        this.loading = false
      }
    },
    /**
     * 移动完成后保存位置变化
     */
    moved (a, newX, newY) {
      moveUserCard(this.handleCardI()).then(res => {
      })
    },
    /**
     * 每次移动卡片都将卡片的位置全部重新获取
     */
    handleCardI () {
      let temp = ''
      this.cardList.forEach(item => {
        temp += ',' + item.id + ':' + (parseInt(item.y) / 5 * 2 + parseInt(item.x) + 1)
      })
      return temp.substring(1)
    },
    /**
     * 工具栏打开外部链接
     * by fanjiao
     */
    openExlink (uri) {
      // 如果需要拼接用户信息，在这里添加 ?userId=userPId
      window.open('http://' + uri, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }

  .description{
    margin-top: 24px;
    color: gray;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
  }
  .dropdown-container{
    position: relative;
    background: #fff;
    border: 0 solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 20px rgba(0,0,0,.1);
    .menu {
        border-radius: 4px;
        background: #fff;
        list-style: none;
        overflow: auto;
        margin: 0;
        padding: 4px 0;
        max-height: 400px;
        min-width: 200px;
        .menu-item {
            min-height: 36px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-size: 14px;
            color: #383838;
            box-sizing: border-box;
            padding: 8px 16px;
            word-break: break-all;
        }
    }
  }
.tool-list{
  margin-left: 64px;
  .tool-item{
    width: 52px;
    margin-left: 12px;
    text-align:center;
    font-size:8px;
    text-overflow: ellipsis;
    float: left;
    .tool-name{
      overflow: hidden;/*超出部分隐藏*/
      white-space: nowrap;/*不换行*/
      text-overflow:ellipsis;/*超出部分文字以...显示*/
      margin-top:-26px;
    }
  }
}
.exception {
  min-height: 500px;
  height: 80%;
  align-items: center;
  text-align: center;
  margin-top: 100px;
  .img {
    display: inline-block;
    padding-right: 52px;
    zoom: 1;
    img {
      height: 360px;
      max-width: 430px;
    }
  }
  .content {
    display: inline-block;
    flex: auto;
    .desc {
      color: rgba(0, 0, 0, .45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
.img_arrow {
  margin-top: 10px;
  margin-right: 55px;
  align-items:end;
  text-align: end;
}
.spin-content{
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 100%;
}
</style>
