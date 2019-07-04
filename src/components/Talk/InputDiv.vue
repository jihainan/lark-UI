<template>
  <div
    class="textarea-input"
    contenteditable="true"
    @input="changeText"
    @keydown.enter.stop.prevent
  >
    <img :escape="false" v-for="(item, index) in faceMessage" :key="index" :src="item" style="width: 2rem; height: 2rem;">
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
      required: true
    },
    faceMessage: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      innerText: this.value
    }
  },
  created () {
  },
  methods: {
    changeText () {
      this.innerText = this.$el.innerHTML
      this.$emit('input', this.innerText)
    }
  }
}
</script>
<style>
  .textarea-input {
    height: 100px;
    width: 100%;
    line-height: 20px;
    color: black;
    resize: none;
    outline: none;
    border: none;
  }
</style>
