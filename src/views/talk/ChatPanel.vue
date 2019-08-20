<template>
  <a-layout class="talk-layout">
    <a-layout-sider class="talk-layout-sider">
      <div class="search-bar">

        <SearchAll :inputStyle="{height: '31px', width: '200px'}" @showDetail="showSearchDetail" />

        <a-dropdown placement="bottomLeft">
          <a-button class="add-group-btn" icon="plus" size="small" />
          <a-menu slot="overlay">
            <a-menu-item key="talk" @click="startTalk">
              <a-icon type="message" />发起研讨
            </a-menu-item>
            <a-menu-item key="meeting" @click="startMeeting" disabled title="功能未完成">
              <a-icon type="coffee" />发起会议
            </a-menu-item>
          </a-menu>
        </a-dropdown>

      </div>
      <a-tabs
        :activeKey="activeKey"
        @change="changePane"
        :tabBarGutter="10"
        :tabBarStyle="{margin: '0 20px'}"
        animated
      >
        <a-tab-pane key="1" forceRender>
          <span slot="tab">
            <a-tooltip placement="top" title="最近" :overlayStyle="tabOverLayStyle">
              <a-icon type="clock-circle" style="fontSize: 18px" />
            </a-tooltip>
          </span>
          <div class="recent-contacts-container tab-content-container">
            <div v-for="(item, index) in recentContacts" :key="index" @click="showConvBox(item)">
              <RecentContactsItem :contactsInfo="item" :activated="item.id === activeChat" />
            </div>

            <!-- 没有最新联系人或者联系人加载失败时的提示信息 -->
            <div v-if="!recentContacts || !recentContacts.length" class="empty-tips">
              <p>
                暂无聊天信息
                <!-- <a-button
                  type="primary"
                  ghost
                  size="small"
                  :loading="recentLoading"
                  @click="getRecentContacts"
                >重新加载</a-button> -->
              </p>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="2" forceRender>
          <span slot="tab">
            <a-tooltip placement="top" title="群组" :overlayStyle="tabOverLayStyle">
              <a-icon type="team" style="fontSize: 18px" />
            </a-tooltip>
          </span>

          <div class="group-contacts-container tab-content-container">
            <div v-for="(item, index) in groupList" :key="index" @click="showGroup(item)">
              <GroupItem :groupInfo="item" :activated="item.groupId === activeGroup" />
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

        <a-tab-pane key="3" forceRender>
          <span slot="tab">
            <a-tooltip placement="top" title="联系人" :overlayStyle="tabOverLayStyle">
              <a-icon type="user" style="fontSize: 18px" />
            </a-tooltip>
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

        <a-tab-pane key="4" forceRender>
          <span slot="tab">
            <a-tooltip placement="top" title="会议" :overlayStyle="tabOverLayStyle">
              <a-icon type="coffee" style="fontSize: 18px" />
            </a-tooltip>
          </span>

          <div class="contacts-container tab-content-container">
            <!-- 无会议时提示信息 -->
            <div v-if="true" class="empty-tips">
              <p>暂无会议</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>

    <a-layout class="talk-layout-content">
      <div v-show="activeKey == '1'" class="chat-area">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
      <div v-show="activeKey == '2'" class="info-area">
        <GroupInfo :selected="activeGroup" @clickSend="handleClickSend" />
      </div>

      <div v-show="activeKey == '3'" class="info-area">
        <ContactsInfo :selected="activeContacts" @clickSend="handleClickSend" />
      </div>

      <div v-show="activeKey == '4'" class="info-area">
        <p>暂无会议</p>
      </div>
    </a-layout>

    <!-- 创建新的研讨模态框 -->
    <CreateTalk :showModal="showCreateModal" />
  </a-layout>
</template>

<script>
import { ContactsTree,
  ContactsInfo,
  GroupInfo,
  RecentContactsItem,
  GroupItem,
  CreateTalk,
  SearchAll } from '@/components/Talk'
import { mapGetters } from 'vuex'
export default {
  name: 'ChatPanel',
  components: {
    ContactsTree,
    ContactsInfo,
    GroupInfo,
    RecentContactsItem,
    GroupItem,
    CreateTalk,
    SearchAll
  },
  data () {
    return {
      // 当前选中的标签页
      activeKey: '1',
      // 是否显示创建研讨的模态框
      showCreateModal: () => false,

      // 记录当前选中的联系人/群组信息
      activeContacts: '',
      activeGroup: '',

      // 加载状态
      recentLoading: false,
      groupLoading: false,
      contactsLoading: false,

      tabOverLayStyle: { fontSize: '12px' }
    }
  },
  computed: {
    ...mapGetters([
      'recentContacts',
      'groupList',
      'contactsTree'
    ]),
    // 当前激活的研讨ID
    activeChat () {
      return this.$store.getters.currentTalk.id
    }
  },
  methods: {
    handleClickSend () {
      this.activeKey = '1'
    },
    /* 切换面板 */
    changePane (activeKey) {
      this.activeKey = activeKey
    },
    /** 发起研讨 */
    startTalk () {
      this.showCreateModal = () => true
    },
    /** 发起会议 */
    startMeeting () {
      console.log('发起会议')
    },
    /**
     * 展示研讨对话框
     * @param {RecentContact} selectedItem 当前研讨
     */
    showConvBox (selectedItem) {
      this.$router.push({ name: 'ChatBox' })
      this.$store.dispatch('UpdateRecentContacts', { ...selectedItem, reOrder: false, addUnread: false })
        .then(() => {
          this.$store.commit('SET_CURRENT_TALK', selectedItem.id)
        })
    },
    /** 展示群组详细信息 */
    showGroup (group) {
      this.activeGroup = group.groupId
    },
    /** 展示联系人详细信息 */
    showContacts (key) {
      this.activeContacts = key
    },
    /** 加载群组列表 */
    getGroupList () {
      this.groupLoading = true
      this.$store.dispatch('GetGroupList').finally(() => {
        this.groupLoading = false
      })
    },
    /**  加载联系人树 */
    getContactsTree () {
      this.contactsLoading = true
      this.$store.dispatch('GetContactsTree').finally(() => {
        this.contactsLoading = false
      })
    },
    /** 获取最近联系列表 */
    getRecentContacts () {
      this.recentLoading = true
      this.$store.dispatch('GetRecentContacts').finally(() => {
        this.recentLoading = false
      })
    },
    /** 查看搜索结果详情 */
    showSearchDetail (item, isGroup) {
      if (isGroup) {
        this.activeKey = '2'
        this.activeGroup = item.groupId
      } else {
        this.activeKey = '3'
        this.activeContacts = item.key
      }
    }
  }
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

  background-color: #ebeff5;
  border-right: 1px solid #dcdee0;

  // 聊天搜索栏样式 该部分高度为48px
  .search-bar {
    display: flex;
    margin: 16px 19px 8px;
    .add-group-btn {
      margin-left: 10px;
      width: 31px;
      height: 31px;
      background-color: #d3d6dc;
      color: #7c7a7a;
      font-size: 18px;
    }
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
  // .group-contacts-container {
  // }

  // 联系人标签页样式
  // .contacts-container {
  // }

  // 让最近 群组 联系人tab页的内容可以滚动的样式
  .tab-content-container {
    overflow: hidden;

    // 视窗高度-头部导航栏高度-搜索框高度-tab页高度
    height: calc(100vh - 64px - 55px - 46px);

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
