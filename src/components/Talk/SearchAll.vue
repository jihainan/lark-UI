<template>
  <div class="search-all">
    <div class="input-mask" v-show="showInputMask"></div>
    <a-input
      placeholder="联系人/群组"
      v-model="searchText"
      @focus="showDrawer"
      :style="inputStyle"
      size="small"
    >
      <!-- @blur="exitSearch" -->
      <a-icon slot="prefix" type="search" />
      <a-icon v-if="searchText" slot="suffix" type="close-circle" @click="exitSearch" />
    </a-input>
    <!-- 搜索结果展示 -->
    <a-drawer
      placement="left"
      getContainer=".talk-layout-sider"
      :wrapStyle="{marginTop: '118px'}"
      :maskStyle="{background: 'transparent'}"
      :width="280"
      :closable="false"
      :destroyOnClose="true"
      @close="exitSearch"
      :visible="visible"
      :zIndex="10"
    >
      <div class="result-container">
        <div v-if="groupResultList.length || contResultList.length">
          <!-- 群组匹配结果 -->
          <div class="group-result" v-if="groupResultList.length">
            <p class="category-label">群组</p>
            <GroupItem
              v-for="(item, index) in groupResultList"
              :groupInfo="item"
              :key="index"
              :activated="activated===item.groupId"
              @select="toTalk(item)"
            />
          </div>

          <!-- 联系人匹配结果 -->
          <div class="contact-result" v-if="contResultList.length">
            <p class="category-label">联系人</p>
            <ContactItem
              v-for="(item, index) in contResultList"
              :contactsInfo="item"
              :key="index"
              :activated="activated===item.key"
              @select="toTalk(item)"
            />
          </div>
        </div>

        <div v-else class="no-result-tip">
          <p>无匹配结果</p>
        </div>

      </div>
    </a-drawer>
  </div>
</template>

<script>
import { GroupItem, ContactItem } from '@/components/Talk'
import { mapGetters } from 'vuex'

export default {
  name: 'SearchAll',
  props: {
    inputStyle: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  components: { GroupItem, ContactItem },
  data () {
    return {
      visible: false,
      // 搜索文本
      searchText: '',
      // 群组的匹配结果
      groupResultList: [],
      // 联系人的匹配结果
      contResultList: [],
      // 选中的id
      activated: ''
    }
  },
  computed: {
    ...mapGetters(['groupList', 'contactsTree']),
    showInputMask () {
      return !this.visible
    }
  },
  watch: {
    searchText (newValue) {
      if (newValue) {
        this.inputFilter(newValue)
      }
    }
  },
  methods: {
    exitSearch () {
      [this.visible, this.activated, this.searchText, this.groupResultList, this.contResultList] =
      [false, '', '', [], []]
    },
    showDrawer () {
      this.visible = true
      this.setDrawerStyle()
    },
    /** 设置抽屉样式 */
    setDrawerStyle () {
      this.$nextTick(() => {
        const drawerContainer = document.getElementsByClassName('ant-drawer-content-wrapper')
        for (let i = 0; i < drawerContainer.length; i++) {
          const item = drawerContainer[i]
          if (item.clientWidth === 280) {
            item.style.boxShadow = 'none'
          }
        }
      })
    },
    /**
     * 对输入的信息进行过滤，筛选出相关信息
     */
    inputFilter (searchText) {
      this.groupFilter(searchText)
      this.contactsFilter(searchText)
    },
    /** 筛选群组列表 */
    groupFilter (searchText) {
      this.groupResultList = []
      this.groupList.forEach(item => {
        if (item.groupName.includes(searchText)) {
          this.groupResultList.push(item)
        }
      })
    },
    /** 筛选联系人树 */
    contactsFilter (searchText) {
      this.contResultList = []
      this.traverseTree(this.contactsTree, searchText)
    },
    /** 遍历树的工具函数 */
    traverseTree (tree, text) {
      const self = this
      tree.forEach(function (item) {
        if (item.scopedSlots.title === 'orgNode') {
          self.traverseTree(item.children, text)
        } else {
          if (item.title.includes(text)) {
            self.contResultList.push(item)
          }
        }
      })
    },
    /** 跳转到研讨界面 */
    toTalk (item) {
      let isGroup = false
      if (item.groupId) {
        isGroup = true
        this.activated = item.groupId
      } else {
        this.activated = item.key
      }
      this.$emit('showDetail', item, isGroup)
    }
  }
}
</script>

<style lang="less" scoped>
  .search-all {
    .input-mask {
      position: fixed;
      width: 200px;
      height: 31px;
      border-radius: 4px;
      z-index: 10;
      background-color: #a7a8ac;
      opacity: 0.5;
      pointer-events: none;
      border: 1px solid #d1d2d4;
    }
  }

  .result-container {
    height: 100vh;
    background-color: #e6e8eb;
    margin: -24px;
    border-top: 1px #d5d8de solid;
    &:hover {
      overflow: overlay;
    }

    .category-label {
      margin: 0;
      padding-left: 17px;
      color: #a0a1a5;
      background-color: #dcdcdc;
      border-bottom: 1px #d5d8de solid;
    }
  }
  .no-result-tip {
    p {
      text-align: center;
      padding: 24px;
    }
  }
</style>
