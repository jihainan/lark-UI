<template>
  <div class="user-wrapper">
    <!-- <span class="action" @click="messageFun">
      <a-icon type="message"/>
    </span>-->

    <router-link :to="{ name: 'Feedback' }">
      <span class="action">
        <a-icon :style="{'fontSize':'18px'}" type="experiment" theme="twoTone"></a-icon>
      </span>
    </router-link>

    <header-notice class="action" />
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <!-- 添加登录状态展示 -->
        <a-badge
          :status="statusMap.get(onlineState)"
          :offset="[-10, 23]"
          :numberStyle="{padding: '4px'}"
        >
          <a-avatar
            class="avatar"
            size="small"
            :src="avatar"
            style="backgroundColor: #f49d2a"
          >{{ nickname.slice(0,1) }}</a-avatar>
        </a-badge>
        <span>{{ nickname }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!-- <a-menu-item key="0">
          <router-link :to="{ name: 'Center' }">
            <a-icon type="user" />
            <span>个人信息</span>
          </router-link>
        </a-menu-item>-->
        <a-menu-item key="1">
          <router-link :to="{ name: 'Settings' }">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" disabled>
          <a-icon type="setting" />
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout" />
            <span>注销</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import { mapActions, mapGetters } from 'vuex'
import Utils from '../../../src/utils/utils.js'
import { ONLINE_STATUS } from '@/utils/constants'

export default {
  name: 'UserMenu',
  components: {
    HeaderNotice
  },
  data () {
    return {
      statusMap: new Map([
        [ONLINE_STATUS.LANDING, 'warning'],
        [ONLINE_STATUS.ONLINE, 'success'],
        [ONLINE_STATUS.EXITING, 'error'],
        [ONLINE_STATUS.OFFLINE, 'default']
      ])
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    onlineState () {
      return this.$store.state.talk.onlineState
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel () {}
      })
    },
    messageFun () {
      Utils.$emit('message', 'msg')
      this.$router.push({ name: 'Workplace', params: { messageFlag: true } })
    },
    /**
     * 打开评论面板
     */
    openCommentBoard () {}
  }
}
</script>
