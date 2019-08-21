<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result title="创建成功" :is-success="true" description style="max-width: 560px;">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">群组名称：</a-col>
            <a-col :sm="16" :xs="24">{{ groupInfo.groupName }}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">群组密级：</a-col>
            <a-col :sm="16" :xs="24">{{ groupInfo.levels | fileSecret }}</a-col>
          </a-row>
        </div>
        <div slot="action">
          <a-button @click="finish">再次创建</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="toTalk">开始研讨</a-button>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'ResultPage',
  components: {
    Result
  },
  props: {
    groupInfo: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    finish () {
      this.$emit('finish')
    },
    toTalk () {
      this.$emit('toTalk')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
