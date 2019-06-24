<template>
  <div style="margin-bottom: 64px;">
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
          v-for="(grid, indexs) in cardList"
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
          @moved="moved"
          @move="click(indexs)"
        >
          <l-card :cardData="grid" @refreshCard="refreshCard"></l-card>
        </grid-item>
      </grid-layout>
    </div>
    <!--这个地方放置最近访问-->

    <footer-tool-bar :style="{height:'72px', width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <div class="tool-list">
        <div class="tool-item" v-for="item in toolList" :key="item.id">
          <img :src="'/tools/Icon-'+item.description+'.png'" width="40" height="40" :alt="item.description" :title="item.title"/>
          <div class="tool-name">{{ item.title }}</div>
        </div>
        <!-- <div class="tool-item">
          <img src="/tools/Icon-PDM.png" width="40" height="40" alt="PDM" title="项目数据管理系统"/>
          <div class="tool-name">项目数据管理系统</div>
        </div> -->
        <!-- <div class="tool-item">
          <img src="/tools/Icon-MPM.png" width="40" height="40" alt="MPM" title="项目管理系统"/>
          <div class="tool-name">项目管理系统</div>
        </div>
        <div class="tool-item">
          <img src="/tools/Icon-OA.png" width="40" height="40" alt="OA" title="协同办公系统"/>
          <div class="tool-name">协同办公系统</div>
        </div>
        <div class="tool-item">
          <img src="/tools/Icon-TDM.png" width="40" height="40" alt="TDM" title="试验数据管理系统"/>
          <div class="tool-name">试验数据管理系统</div>
        </div> -->
      </div>
      <!-- <a-button type="primary" @click="validate" :loading="loading">提交</a-button> -->
    </footer-tool-bar>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import FooterToolBar from '@/components/FooterToolbar'
import VueGridLayout from 'vue-grid-layout'
import LCard from '@/views/dashboard/Card'
import { getCommonTools, getUserCard } from '@/api/workplace'
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
      toolList: []
    }
  },
  components: {
    LCard,
    FooterToolBar,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  created () {
    this.getSelfWorkplace()
    this.getSelfTools()
  },
  methods: {
    getSelfWorkplace () {
      this.cardList = []
      // this.$http.get('/portal/userCard/myself')
      getUserCard()
        .then(res => {
          const dataTemp = res.result.data
          for (var i = 0; i < dataTemp.length; i++) {
            const temp = {}
            temp.id = dataTemp[i].id
            temp.x = 1 * parseInt(dataTemp[i].i % 2)
            temp.y = 5 * parseInt(dataTemp[i].i / 2)
            temp.w = 1
            temp.h = 5
            temp.i = dataTemp[i].i
            temp.type = dataTemp[i].type
            temp.title = dataTemp[i].title
            temp.url = dataTemp[i].url
            this.cardList.push(temp)
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
    click (index) {
      this.index = index
    },
    moved (a, newX, newY) {
      const i = (2 * newY) / 5
      const index = this.index
      // this.$http.get('/portal/userCard/myself', {
      getUserCard({
        params: {
          list: {
            cardId: this.ids[index],
            i: Math.round(i)
          }
        }
      }).then(res => {
      })
      this.getId()
    },
    getId () {
      for (let i = 0; i < this.cardList.length; i++) {
        this.ids.push(this.cardList[i].id)
      }
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

</style>
