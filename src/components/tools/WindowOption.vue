<template>
  <div v-if="isLarkClient()" class="option-wrapper">
    <a-tooltip title="收起" :mouseLeaveDelay="0">
      <span class="action" @click="handleOption('mini')">
        <a-icon class="window-option-btn" type="minus" />
      </span>
    </a-tooltip>
    <a-tooltip title="切换" :mouseLeaveDelay="0">
      <span class="action" @click="handleOption('resize')">
        <a-icon class="window-option-btn" type="swap" />
      </span>
    </a-tooltip>
    <!-- <a-tooltip title="关闭" :mouseLeaveDelay="0">
      <span class="action" @click="handleOption('close')">
        <a-icon class="window-option-btn" type="close" />
      </span>
    </a-tooltip> -->
  </div>
</template>

<script>
import {
  isLarkClient,
  minimizeWindow,
  closeWindow,
  maximizeWindow,
  resizeWindow,
  isFullScreen } from '@/utils/client'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'WindowOption',
  mixins: [mixinDevice],
  data () {
    return {}
  },
  methods: {
    isLarkClient () {
      return isLarkClient()
    },
    handleOption (option) {
      switch (option) {
        case 'mini':
          minimizeWindow()
          break
        case 'resize':
          if (isFullScreen()) {
            resizeWindow()
          } else {
            maximizeWindow()
          }
          break
        case 'close':
          closeWindow()
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .action {
    &:hover {
      color: #000000;
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
    }
  }
</style>
