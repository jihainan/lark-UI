<template>
  <div>
    <a-form style="max-width: 650px; margin: 40px auto 0;">
      <a-alert :closable="true" :message="alertMessage" style="margin-bottom: 12px;" />

      <UserTransfer ref="groupUserTransfer" @ok="handleUserSelect" :listStyle="listStyle" />

      <a-form-item :wrapperCol="{span: 14, offset: 10}" style="margin-top: 8px;">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" :loading="loading" type="primary" @click="nextStep">创 建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTransfer from '@/components/admin/UserTransfer'

export default {
  name: 'UserSelect',
  components: { UserTransfer },
  props: {
    groupInfo: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data () {
    return {
      loading: false,
      userList: [],
      listStyle: {
        width: '188px',
        height: '400px'
      }
    }
  },
  computed: {
    ...mapGetters(['userId', 'userPId', 'avatar', 'nickname', 'userSecretLevel'])
  },
  mounted () {
    const secretListMap = new Map([
      [60, [60, 70, 80, 90]],
      [40, [40, 50, 60, 70, 80, 90]],
      [30, [30, 40, 50, 60, 70, 80, 90]]
    ])
    this.$refs.groupUserTransfer.beginChooseUser([], {
      secretLevels: secretListMap.get(this.groupInfo.levels).join(),
      exPid: this.userPId
    })
  },
  methods: {
    alertMessage () {
      switch (this.groupInfo.levels) {
        case 60:
          return '机密级群组成员数量不能超过50'
        case 40:
          return '秘密级群组成员数量不能超过100'
        case 30:
        default:
          return '下列用户已根据群组密级进行了筛选'
      }
    },
    nextStep () {
      const memberNum = this.userList.length
      if (memberNum < 1) {
        this.$notification.warning({ message: '请选择群组成员' })
        return
      } else if (memberNum < 2) {
        this.$notification.warning({ message: '成员数量不满足要求' })
        return
      } else if (this.groupInfo.levels === 40 && memberNum >= 100) {
        this.$notification.warning({ message: '秘密级群组成员数量不能超过100' })
        return
      } else if (this.groupInfo.levels === 60 && memberNum >= 50) {
        this.$notification.warning({ message: '机密级群组成员数量不能超过50' })
        return
      }
      const members = this.userList.map(item => {
        const newItem = {}
        const { id, secretLevel, img } = item
        newItem.userId = id
        newItem.userLevels = secretLevel
        newItem.img = img
        return newItem
      })
      members.push({
        userId: this.userId,
        userLevels: this.userSecretLevel,
        img: this.avatar
      })
      this.$emit('nextStep', members, 2)
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleUserSelect (userArr) {
      this.userList = userArr
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
</style>
