<!--
组件使用指南
组件功能：一个带有Transfer穿梭框，Transfer左侧组织树，点击组织节点，可根据节点查询该组织下人员名单
        父组件可传已选择的人员信息 类型为人员信息的JSON数组 参数非必填

使用方法：组件引入后，使用如下方法
        <user-transfer ref="transfer" @ok="handleSaveOk"/>
        this.$refs.transfer.beginChooseUser(传到子组件的参数，查询项)

        目前只支持两个查询项：密级和不包含身份证号
        const test = "{'secretLevels':'40,50','exPid':'110101******38688'}"
        eval("("+test+")")

        可自定义子组件的确认方法(change事件)
        返回值结构同样为人员信息的JSON数组

        支持更改穿梭框尺寸 listStyle 默认 430px 430px
-->
<template>
  <a-row :gutter="8">
    <a-col :span="7">
      <a-card title="组织信息" :bodyStyle="bodyStyle">
        <div style="overflow:scroll;height:344px">
          <a-tree :treeData="orgTree" @select="handleClick" />
        </div>
      </a-card>
    </a-col>
    <a-col :span="17">
      <a-spin :spinning="tLoading">
        <a-transfer
          :titles="['可选择人员', '已选择人员']"
          :dataSource="ds"
          showSearch
          @search="usersFilter"
          :listStyle="listStyle"
          :targetKeys="targetKeys"
          @change="handleChange"
          :render="renderItem"
          :operations="['添加','移除']"
        ></a-transfer>
      </a-spin>
    </a-col>
  </a-row>
</template>
<script>
import { getUserList, getOrgTree } from '@/api/admin'

export default {
  name: 'UserTransfer',
  data () {
    return {
      bodyStyle: { height: '352px' },
      orgTree: [],
      // key userid value userinfo
      // 用于存储人员信息
      userMap: new Map(),
      // 页2 transfer左侧绑定数据源
      ds: [],
      // 页3 transfer右侧绑定数据源
      targetKeys: [],
      // props: 'props',
      tLoading: false,
      queryparamter: {},
      userfilter: {}
    }
  },
  created () {
    // 获取树形组织信息
    getOrgTree({ parentTreeId: 'root' }).then(res => {
      this.orgTree = this.handleVal(res.result.data)
    })
  },
  props: {
    listStyle: {
      type: Object,
      required: false,
      default: () => ({
        width: '400px',
        height: '400px'
      })
    }
  },
  methods: {
    /**
     * 打开人员选择器
     * userArr 非必填 transfer组件中已选中的人员
     *         类型：数组 [{人员信息}]
     * filter 非必填 人员信息过滤
     * 目前只支持两个查询项：密级和不包含人员身份证号 {'secretLevels':'40,50','exPid':'110101******38688'}
     */
    beginChooseUser: function (userArr, filter) {
      this.targetKeys = []
      this.ds = []
      this.userMap = new Map()
      this.userfilter = filter
      if (userArr && userArr.length) {
        userArr.forEach(item => {
          this.targetKeys.push(item.id)
          item.key = item.id
          item.title = item.name
          this.ds.push(item)
          this.userMap.set(item.id, item)
        })
      }
    },
    /**
     * 点击组织机构树，获取该组织下人员信息
     */
    handleClick (item, e) {
      this.tLoading = true
      // 限制点击根节点触发后台请求操作
      if (item.length > 0 && item[0] === 'key-01') {
        return
      }
      this.queryparamter = { orgCode: item[0] }
      // 获取组织节点对应的人员信息
      this.getUsers()
    },
    /**
     * 根据人员姓名检索人员信息
     * 如需其他检索项，可在parameter中添加项目
     * TODO 检索项添加时，这里需要调整
     */
    usersFilter (t, searchvalue) {
      if (t === 'left') {
        this.ds.filter(item => {
          return item.title.indexOf(searchvalue) > -1
        })
      } else {
        // 右侧数据只能绑定key值，需要将信息补全后进行过滤
        this.targetKeys.filter(item => {
          const userinfo = this.userMap.get(item)
          if (userinfo.title.indexOf(searchvalue) > -1) {
            return true
          }
        })
      }
    },
    /**
     * 请求后台获取人员信息
     */
    getUsers () {
      this.tLoading = true
      if (this.queryparamter.orgCode === undefined) {
        this.tLoading = false
        return
      }
      // 添加筛选项
      if (this.userfilter) {
        this.queryparamter.secretLevels = this.userfilter.secretLevels || ''
        this.queryparamter.pId = this.userfilter.exPid || ''
      } else {
        this.queryparamter.secretLevels = ''
        this.queryparamter.pId = ''
      }
      getUserList(this.queryparamter)
        .then(res => {
          const members = res.result.data
          // 每次刷新更改绑定数据源时，需要合并右侧已选中的集合
          this.joinDs(this.targetKeys, members)
          this.tLoading = false
        })
        .catch(() =>
          this.$notification['error']({
            message: '出现异常，请联系系统管理员',
            duration: 4
          })
        )
    },
    /**
     * 合并数据源
     * 同时给新数据源指定key和title值
     */
    joinDs (oldds, newds) {
      newds.forEach(item => {
        item.key = item.id
        item.title = item.name
        this.userMap.set(item.id, item)
      })
      oldds.forEach(oldval => {
        let check = false
        check = newds.some(newval => {
          if (newval.id === oldval) {
            return true
          }
        })
        if (!check) {
          newds.push(this.userMap.get(oldval))
        }
      })
      this.ds = newds
    },
    /**
     * 点击新增/撤销
     */
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
      const userarr = []
      this.targetKeys.forEach(item => {
        userarr.push(this.userMap.get(item))
      })
      this.$emit('ok', userarr, this.targetKeys)
    },
    // 如需在人员信息上拼接其他人员信息 {item.title} - {item.orgname} - {item.secretLevel}
    renderItem (item) {
      const customLabel = <span class="custom-item">{item.title}</span>
      return {
        // for displayed item
        label: customLabel,
        // for title and filter matching
        value: item.title
      }
    },
    /**
     * 处理后台返回值 替换名字 id=>key label=>title
     */
    handleVal (value) {
      let str = JSON.stringify(value[0].children[0].children)
      str = str.replace(/id/g, 'key').replace(/label/g, 'title')
      return JSON.parse(str)
    }
  }
}
</script>
