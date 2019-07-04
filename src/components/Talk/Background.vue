<template>
  <div>
    <div class="bg_box">
      <p class="bg_content">{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BG',
  data() {
    return {
      content: 'sssssssss'
    }
  }
}
</script>

<style lang="less" scoped>
.bg_box {
  position: relative;
  float: left;
  /* opacity: 0; */
  width: 50%;
  height: 500px;
}
.bg_content {
  position: absolute;
  top: 115px;
  left: 115px;
  color: rgba(0, 0, 0, 0.15);
  transform: rotate(-45deg);
  font-size: 30px;
}
</style>