<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="群组名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['groupName', {rules: [{
            required: true, message: '研讨组名称不能为空',
          }, {
            max: 20, message: '名字太长了'
          }, {
            whitespace: true, message: '名称不能为空'
          }]}]"
          placeholder="给研讨组起一个名字"
        />
      </a-form-item>
      <a-form-item
        label="群组密级"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          v-decorator="['levels', {rules: [{
            required: true, message: '研讨组密级不能为空',
          }]}]"
          placeholder="设置研讨组密级"
        >
          <a-select-option v-for="item in secretOption" :key="item" :value="item">
            {{ item | fileSecret }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="所属项目"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['pname', {rules: [{
            required: true, message: '项目不能为空',
          }]}]"
          placeholder="请填写研讨组所属项目"
        />
      </a-form-item>
      <a-form-item
        label="参与范围"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['scop', {}]"
          type="textarea"
          placeholder="填写研讨组讨论范围（可选）"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="描述信息"
      >
        <a-input
          v-decorator="['groupDescribe', {}]"
          type="textarea"
          placeholder="研讨组的详细信息（可选）"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>群组创建注意事项</h4>
      <p>群组创建注意事项，群组创建注意事项，群组创建注意事项，群组创建注意事项</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BaseInfo',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters(['userSecretLevel', 'userId', 'avatar', 'nickname']),
    secretOption () {
      return [30, 40, 60].filter(item => item <= this.userSecretLevel)
    }
  },
  methods: {
    nextStep (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$emit('nextStep', values, 1)
          console.log('创建的数据：', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
