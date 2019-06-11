<template>
  <a-modal
    v-model="visible"
    :maskClosable="false"
    :width="800"
    destroyOnClose
  >
    <!-- 标题 -->
    <template slot="title">
      <div class="create-talk-title">创建研讨组</div>
    </template>

    <a-form formLayout="horizontal">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="名称"
        help="请填写群组名称"
      >
        <a-input placeholder="群组名称"></a-input>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="密级"
        help="请填写群组密级"
      >
        <a-select @change="handleSecretChange">
          <a-select-option v-for="item in secretOption" :key="item" :value="item">
            {{ item | fileSecret }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="主题"
        help="请填写群组主题"
      >
        <a-input type="textarea" />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="描述"
        help="请填写群组描述"
      >
        <a-input type="textarea" />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="成员"
        help="请选择成员"
      >
        <!-- <a-transfer
          :dataSource="mockData"
          :titles="['Source', 'Target']"
          :targetKeys="targetKeys"
          :selectedKeys="selectedKeys"
          @change="handleChange"
          @selectChange="handleSelectChange"
          @scroll="handleScroll"
          :render="item=>item.title"
          :disabled="disabled"
        /> -->
      </a-form-item>
    </a-form>

    <!-- 操作按键 -->
    <template slot="footer">
      <a-button size="small" :loading="false" class="option-btn" @click="handleOk" type="primary">确定</a-button>
      <a-button size="small" :loading="false" class="option-btn" @click="handleCancel">取消</a-button>
    </template>

    <!-- 人员选择框 -->
    <UserTransfer ref="userSelector" />
  </a-modal>
</template>

<script>
import UserTransfer from '@/components/admin/UserTransfer'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateTalk',
  props: {
    // 显示显示模态框,需要一个返回true或者false的方法
    showModal: {
      type: Function,
      required: true
    }
  },
  components: { UserTransfer },
  data () {
    return {
      visible: false,
      secretOption: [60, 70, 80],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }
  },
  computed: {
    ...mapGetters(['userSecretLevel'])
  },
  watch: {
    showModal (fuc) {
      if (fuc()) this.visible = true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    handleSecretChange () {
      // 修改密级 重新筛选人员
      this.$refs.userSelector.beginChoose()
    },
    handleOk (event) {
      console.log('ok')
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .create-talk-title {
    text-align: center;
  }

  .option-btn {
    padding: 0 20px;
  }
</style>
