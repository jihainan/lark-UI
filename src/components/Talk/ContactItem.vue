<template>
  <div :class="contactsItemClasses" @click="handleClick" :key="contactsInfo.key">
    <div class="avatar">
      <a-avatar
        class="avatar-img"
        shape="square"
        :src="contactsInfo.icon"
        :size="30"
      >{{ contactsInfo.title.substr(0, 2) }}</a-avatar>
    </div>
    <div class="extra">
      <p class="attr on-line">
        <!-- <a-icon type="check-circle" theme="filled" /> -->
      </p>
    </div>
    <div class="info">
      <p class="nickname">{{ contactsInfo.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactsItem',
  props: {
    contactsInfo: {
      type: Object,
      default: () => ({}),
      required: true
    },
    activated: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {}
  },
  computed: {
    contactsItemClasses () {
      return {
        'contacts-item': true,
        activated: this.activated
      }
    }
  },
  methods: {
    handleClick () {
      this.$emit('select', this.contactsInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.activated {
  background-color: #d3d6dc !important;
}
.on-line {
  color: rgba(43, 162, 69, 1);
}
.contacts-item {
  width: 100%;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  cursor: pointer;
  overflow: hidden;
  padding: 10px 18px 9px;
  background-color: #ebeff5;
  border-bottom: 1px solid #e4e8ec;

  &:hover {
    background-color: #d3d6dc99;
  }
}

.avatar {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;

  &-img {
    border-radius: 2px;
    background-color: #4da6fa;
    span {
      color: #fff;
    }
  }
}

.info {
  height: 30px;
  line-height: 30px;
  word-wrap: normal;
  white-space: nowrap;

  .nickname {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    color: rgb(0, 0, 0);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.extra {
  float: right;
  height: 30px;
  width: 30px;
  font-size: 12px;
  text-align: right;
  color: rgb(140, 141, 143);

  .attr {
    height: 30px;
    line-height: 30px;
    margin: 0;
  }
}
</style>
