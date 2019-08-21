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
            <p class="category-label" @click="groupExpand = !groupExpand">
              <span>群组</span>
              <a-icon class="option-btn" :type="groupExpand ? 'caret-down' : 'caret-left'"></a-icon>
            </p>
            <transition name="result">
              <div v-if="groupExpand">
                <GroupItem
                  v-for="(item, index) in groupResultList"
                  :groupInfo="item"
                  :key="index"
                  :activated="activated===item.groupId"
                  @select="toTalk(item)"
                />
              </div>
            </transition>
          </div>

          <!-- 联系人匹配结果 -->
          <div class="contact-result" v-if="contResultList.length">
            <p class="category-label" @click="contactExpand = !contactExpand">
              <span>联系人</span>
              <a-icon class="option-btn" :type="contactExpand ? 'caret-down' : 'caret-left'"></a-icon>
            </p>
            <transition name="result">
              <div v-if="contactExpand">
                <ContactItem
                  v-for="(item, index) in contResultList"
                  :contactsInfo="item"
                  :key="index"
                  :activated="activated===item.key"
                  @select="toTalk(item)"
                />
              </div>
            </transition>
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
      activated: '',
      // 展开群组搜索结果
      groupExpand: true,
      // 展开联系人搜索结果
      contactExpand: true
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
      ;[
        this.visible,
        this.activated,
        this.searchText,
        this.groupResultList,
        this.contResultList,
        this.groupExpand,
        this.contactExpand
      ] = [false, '', '', [], [], true, true]
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
    background-color: #a9adb8;
    opacity: 0.5;
    pointer-events: none;
    border: 1px solid #d1d2d4;
  }
}

.result-container {
  height: calc(100vh - 119px);
  background-color: #ebeff5;
  margin: -24px;
  border-top: 1px #e4e8ec solid;
  overflow: auto;

  .category-label {
    margin: 0;
    padding-left: 17px;
    color: #a0a1a5;
    background-color: #e6e9ed;
    border-bottom: 1px #eaecf1 solid;
    .option-btn {
      cursor: pointer;
      float: right;
      margin-top: 3px;
    }
  }
}

.result-enter-active,
.result-leave-active {
  transition: opacity 0.2s ease;
}
.result-enter,
.result-leave-to {
  opacity: 0;
}
.no-result-tip {
  p {
    text-align: center;
    padding: 24px;
  }
}
</style>
