<template>
  <a-modal
    v-model="visible"
    style="top: 20px;"
    :maskClosable="false"
    :width="850"
    destroyOnClose
    :footer="null"
    @cancel="handleCloseModal"
  >
    <template slot="title">
      <div class="create-talk-title">创建研讨组</div>
    </template>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写基本信息" />
        <a-step title="选择群组成员" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <BaseInfo v-if="currentTab === 0" :groupInfo="baseInfo" @nextStep="nextStep" ref="baseInfo"/>
        <UserSelect v-if="currentTab === 1" :groupInfo="baseInfo" @nextStep="nextStep" @prevStep="prevStep"/>
        <ResultPage v-if="currentTab === 2" :groupInfo="baseInfo" @toTalk="toTalk" @finish="finish"/>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { SocketMessage } from '@/utils/talk'
import BaseInfo from './BaseInfo'
import UserSelect from './UserSelect'
import ResultPage from './ResultPage'

export default {
  name: 'StepForm',
  components: { BaseInfo, UserSelect, ResultPage },
  props: {
    // 显示显示模态框,需要一个返回true或者false的方法
    showModal: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      visible: false,
      currentTab: 0,
      baseInfo: {}
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  watch: {
    showModal (fuc) {
      if (fuc()) this.visible = true
    }
  },
  methods: {
    nextStep (values, step) {
      if (step === 1) {
        const createInfo = {
          creator: this.userId,
          updator: this.userId,
          type: '3'
        }
        Object.assign(this.baseInfo, values, createInfo)
      }
      if (step === 2) {
        Object.assign(this.baseInfo, { userList: values })
        console.log('创建的数据：')
        console.log(this.baseInfo)
        const createGroupMsg = new SocketMessage({
          code: 3,
          data: this.baseInfo
        }).toString()
        console.log('发送的数据')
        console.log(createGroupMsg)
        this.SocketGlobal.send(createGroupMsg)
      }
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
        // 回显基本信息
        this.$nextTick(() => {
          this.$refs.baseInfo.setFormData(this.baseInfo)
        })
      }
    },
    finish () {
      this.currentTab = 0
    },
    toTalk () {
      this.visible = false
    },
    /** 创建成功后再次打开模态框回到第一步 */
    handleCloseModal () {
      if (this.currentTab === 2) {
        this.currentTab = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
  .create-talk-title {
    text-align: center;
  }
</style>
