<template>
  <a-list
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }"
    :dataSource="cardList"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card
        hoverable
        style="width: 240px"
      >
        <img
          alt="example"
          :src="item.icon"
          slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
          <a-icon type="plus" />
          <a-icon type="ellipsis" />
        </template>
        <a-card-meta
          :title="item.title"
          :description="item.detail">
        </a-card-meta>
      </a-card>
    </a-list-item>
  </a-list>
</template>
<script>

export default {
  data () {
    return {
      cardList: []
    }
  },
  created () {
    this.getAllCards()
  },
  methods: {
    getAllCards () {
      this.$http.get('/workplace/all')
        .then(res => {
          this.cardList = res.result.data
        })
    }
  }
}
</script>
<style>

</style>
