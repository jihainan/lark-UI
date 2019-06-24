<template>
  <div>
    <a-form style="max-width: 650px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="只能选择与群组密级相符合的用户"
        style="margin-bottom: 24px;"
      />

      <UserTransfer
        ref="groupUserTransfer"
        @ok="handleUserSelect"
        :listStyle="listStyle"
      />

      <a-form-item :wrapperCol="{span: 14, offset: 10}">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
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
        width: '200px', height: '450px'
      }
    }
  },
  computed: {
    ...mapGetters(['userId', 'userPId', 'avatar', 'nickname', 'userSecretLevel'])
  },
  mounted () {
    const secretListMap = new Map([
      [60, [60, 70]],
      [40, [40, 50, 60, 70]],
      [30, [30, 40, 50, 60, 70]]
    ])
    this.$refs.groupUserTransfer.beginChooseUser([], {
      secretLevels: secretListMap.get(this.groupInfo.levels).join(),
      exPid: this.userPId
    })
  },
  methods: {
    nextStep () {
      if (this.userList.length < 1) {
        this.$notification.warning({ message: '请选择群组成员' })
        return
      } else if (this.userList.length < 2) {
        this.$notification.warning({ message: '成员数量不满足要求' })
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
