<template>
  <!-- 研讨布局 -->
  <a-layout class="talk-layout">
    <a-layout-sider class="talk-layout-sider">
      <div class="search-bar">
        <SearchInput/>
        <!-- <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="$refs.model.beginTalk()">发起研讨</a-menu-item>
            <a-menu-item key="2">发起会议</a-menu-item>
          </a-menu>
          <a-button type="default" size="small" icon="plus" style="margin-left:3px;"></a-button>
        </a-dropdown> -->
        <a-tooltip title="发起研讨" placement="bottom" :overlayStyle="{fontSize: '12px'}">
          <a-button @click="startTalk" icon="plus" size="small" style="marginLeft: 3px"></a-button>
        </a-tooltip>
      </div>
      <SearchArea
        :activeChat="activeChat"
        :activeGroup="activeGroup"
        :contactsGroup="activeContacts"
        :searchResultList="searchResultList"
        :searchGroupResultList="searchGroupResultList"
        :showSearchContent="showSearchContent"
        :searchContactsResultList="searchContactsResultList"
      />
      <a-tabs
        v-if="showSearchContent"
        :activeKey="activeKey"
        @change="changePane"
        :tabBarGutter="0"
        :tabBarStyle="{ margin: '0 20px' }"
        :animated="false"
      >
        <a-tab-pane key="1" forceRender>
          <span slot="tab">
            <a-icon type="clock-circle" style="{fontSize: 16px}"/>最近
          </span>
          <!-- 最近里面每一项 -->
          <div class="recent-contacts-container tab-content-container">
            <div v-for="(item, index) in recentContacts" :key="index" @click="showConvBox(item)">
              <recent-contacts-item :contactsInfo="item" :activated="item.id === activeChat"></recent-contacts-item>
            </div>

            <!-- 没有最新联系人或者联系人加载失败时的提示信息 -->
            <div v-if="!recentContacts || !recentContacts.length" class="empty-tips">
              <p>
                暂无聊天信息，
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  :loading="recentLoading"
                  @click="getRecentContacts"
                >重新加载</a-button>
              </p>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="team" style="{fontSize: 16px}"/>群组
          </span>

          <div class="group-contacts-container tab-content-container">
            <div v-for="(item, index) in groupList" :key="index" @click="showGroup(item)">
              <group-item :groupInfo="item" :activated="item.id === activeGroup"></group-item>
            </div>

            <!-- 没有群组或者群组加载失败时的提示信息 -->
            <div v-if="!groupList || !groupList.length" class="empty-tips">
              <p>
                暂无群组信息，
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  :loading="groupLoading"
                  @click="getGroupList"
                >重新加载</a-button>
              </p>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="user" style="{fontSize: 18px, margin: 0}"/>联系人
          </span>

          <div class="contacts-container tab-content-container">
            <contacts-tree
              :contactsTree="contactsTree"
              @SelectContacts="showContacts"
              style="paddingLeft: 18px;"
            />

            <!-- 获取联系人树失败时的提示信息 -->
            <div v-if="!contactsTree || !contactsTree.length" class="empty-tips">
              <p>
                加载失败，
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  :loading="contactsLoading"
                  @click="getContactsTree"
                >重新加载</a-button>
              </p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>

    <a-layout class="talk-layout-content">
      <div v-show="activeKey == '1'" class="chat-area">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
      <div v-show="activeKey == '2'" class="info-area">
        <group-info :selected="activeGroup" @t="s"></group-info>
      </div>

      <div v-show="activeKey == '3'" class="info-area">
        <contacts-info :selected="activeContacts"></contacts-info>
      </div>
    </a-layout>

    <!-- 创建新的研讨模态框 -->
    <CreateTalk :showModal="showCreateModal" />
    <SearchRecordModal :searchRecordModalVisible="searchRecordModalVisible"/>
  </a-layout>
</template>

<script>
import {
  ContactsTree,
  ContactsInfo,
  GroupInfo,
  RecentContactsItem,
  GroupItem,
  CreateTalk
} from '@/components/Talk'

import SearchInput from './SearchInput'
import SearchArea from './SearchArea'
import SearchRecordModal from './SearchRecordModal'

export default {
  name: 'ChatPanel',
  components: {
    ContactsTree,
    ContactsInfo,
    GroupInfo,
    RecentContactsItem,
    GroupItem,
    CreateTalk,
    SearchInput,
    SearchArea,
    SearchRecordModal
  },
  data () {
    return {
      // 当前选中的标签页
      activeKey: '1',
      // 是否显示创建研讨的模态框
      showCreateModal: () => false,
      searchObj: {
        searchValue: ''
      },

      // 记录当前选中的联系人/群组信息
      activeContacts: '',
      activeGroup: '',
      activeChat: '',

      // 加载状态
      recentLoading: false,
      groupLoading: false,
      contactsLoading: false,

      searchRecordModalVisible: false
    }
  },
  computed: {
    currentTalk () {
      return this.$store.state.talk.currentTalk
    },
    recentContacts: {
      get: function () {
        return this.$store.state.talk.recentContacts
      },
      set: function (recentContacts) {
        this.$store.commit('SET_RECENT_CONTACTS', recentContacts)
      }
    },
    groupList () {
      return this.$store.state.talk.groupList
    },
    contactsTree () {
      return this.$store.state.talk.contactsTree
    },
    showSearchContent () {
      if (this.$store.state.chat.showSearchContent === null) {
        return true/*  */
      } else {
        return this.$store.state.chat.showSearchContent
      }
    },
    searchResultList () {
      return this.$store.state.chat.searchResultList
    },
    searchGroupResultList () {
      return this.$store.state.chat.searchGroupResultList
    },
    searchContactsResultList () {
      return this.$store.state.chat.searchContactsResultList
    }
  },
  watch: {
    currentTalk (newValue) {
      // 监听当前研讨的变化，更新最近联系人选中状态
      this.activeChat = newValue.id
    }
  },
  created () {
    // 页面创建时获取列表信息
    this.getRecentContacts()
    this.getContactsTree()
    this.getGroupList()
  },
  methods: {
    s (val) {
      this.activeKey = '1'
      // console.log('0202', val)
      this.activeChat = val
    },
    /* 切换面板 */
    changePane (activeKey) {
      this.activeKey = activeKey
    },
    handleSaveOk () {},
    /** 发起研讨 */
    startTalk () {
      this.showCreateModal = () => true
    },
    handleSaveClose () {},
    /**
     * 展示研讨对话框
     * @param {Object} currentTalk 当前研讨
     */
    showConvBox: function (currentTalk) {
      this.activeChat = currentTalk.id
      // 未读消息置为0
      currentTalk.unreadNum = 0
      // 初始化sotre中的当前会话
      // this.currentTalk = currentTalk
      this.$store.dispatch('UpdateRecentContacts', { ...currentTalk, reOrder: false, addUnread: false })

      // 路由跳转
      this.$router.push({
        path: '/talk/ChatPanel/ChatBox',
        query: currentTalk
      })
    },
    delChat (chat) {
      this.$store.commit('DEL_CHAT', chat)
    },
    /** 展示群组详细信息 */
    showGroup (group) {
      this.activeGroup = group.id
    },
    /** 展示联系人详细信息 */
    showContacts (key) {
      this.activeContacts = key
    },
    /**
     * 加载群组列表
     */
    getGroupList () {
      this.groupLoading = true
      this.$store.dispatch('GetGroupList').finally(() => {
        this.groupLoading = false
      })
    },
    /**
     * 加载联系人树
     */
    getContactsTree () {
      this.contactsLoading = true
      this.$store.dispatch('GetContactsTree').finally(() => {
        this.contactsLoading = false
      })
    },
    /**
     * 获取最近联系列表
     */
    getRecentContacts () {
      this.recentLoading = true
      this.$store
        .dispatch('GetRecentContacts')
        .finally(() => {
          this.recentLoading = false
        })
    },
    handleOpenSearchRecordModal () {
      this.searchRecordModalVisible = true
    },
    handleCloseSearchRecordModal () {
      this.searchRecordModalVisible = false
    }
  },
  activated: function () {}
}
</script>

<style lang="less" scoped>
.talk-layout {
  // height: calc(100vh - 64px);
  overflow-y: hidden;
}

.talk-layout-sider {
  // 覆盖默认样式
  max-width: 280px !important;
  flex: 0 0 280px !important;

  background: rgb(230, 232, 235);
  border-right: 1px solid #dcdee0;

  // 聊天搜索栏样式 该部分高度为48px
  .search-bar {
    display: flex;
    margin: 16px 27px 8px;
  }

  // 调整tabs标签样式
  .ant-tabs-nav .ant-tabs-tab .anticon {
    margin-right: 0px;
  }

  // 最近消息标签页样式
  .recent-contacts-container {
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    border-top: 1px solid #ebebeb;
  }

  // 群组标签页样式
  .group-contacts-container {
  }

  // 联系人标签页样式
  .contacts-container {
  }

  // 让最近 群组 联系人tab页的内容可以滚动的样式
  .tab-content-container {
    overflow: hidden;

    // 视窗高度-头部导航栏高度-搜索框高度-tab页高度
    height: calc(100vh - 64px - 48px - 46px);

    &:hover {
      overflow-y: overlay;
    }
  }

  // 加载失败或列表为空的提示信息样式
  .empty-tips {
    text-align: center;
    padding: 32px;
  }
}

.talk-layout-content {
  overflow: hidden;
  z-index: 8;
  background-color: rgb(242, 243, 245);
  .chat-area,
  .info-area {
    height: 100%;
  }
}
</style>
