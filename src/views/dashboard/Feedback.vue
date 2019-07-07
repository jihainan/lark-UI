<template>
  <div>
    <a-card :bordered="false" v-show="feedbackCard">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="6" type="flex" justify="end">
            <a-col :md="6" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <span>
                <a-row type="flex" justify="start">
                  <a-col :md="4" :offset="6">
                    <a-button type="primary" @click="search">查询</a-button>
                  </a-col>
                  <a-col :md="4">
                    <a-button @click="() => queryParam = {}">重置</a-button>
                  </a-col>
                  <a-col :md="4">
                    <a-button type="primary" @click="openFbModal('add')">意见反馈</a-button>
                  </a-col>
                </a-row>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="stable"
        size="default"
        :columns="columns"
        :data="loadData"
        :rowKey="(record) => record.feedBackId"
      >
        <a slot="name" slot-scope="text, record" @click="openComment(record)">{{ record.title }}</a>
        <span slot="action" slot-scope="text, record">
          <div v-if="record.crtUser===user.id">
            <a @click="deleteFeedback(record)">删除</a>
            <a-divider type="vertical" />
            <a @click="openFbModal('update', record)">修改</a>
          </div>
        </span>
      </s-table>
      <a-modal
        title="意见反馈"
        style="top: 100px;"
        :width="800"
        v-model="editVisible"
        @ok="submitFeedback"
        :confirmLoading="confirmLoading"
        :destroyOnClose="true"
      >
        <a-form :form="editForm">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题" hasFeedback>
            <a-input v-decorator="['title',{rules: [{ required: true, message: '请填写标题' }]}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内容" hasFeedback>
            <a-textarea rows="4" v-decorator="['content']" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
    <a-card :bordered="false" v-show="commentCarcd" style="background-color: rgb(239, 239, 239);">
      <a-card style="padding: 20px;">
        <a-row>
          <a-col :md="20">
            <a-icon type="exclamation-circle" />
            <span style="font-size: 20px;font-weight:bold;">{{ fdRecord.title }}</span>
          </a-col>
          <a-col :md="4">
            <a-button @click="returnFbPage">
              <a-icon type="rollback" />返回
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <div style="height:15px"></div>
        </a-row>
        <a-row>
          <span style="margin-left:20px">{{ fdRecord.content }}</span>
        </a-row>
      </a-card>
      <a-card style="padding: 20px;">
        <span v-if="commentList.length === 0">暂时没有评论</span>
        <a-comment v-for="comment in commentList" :key="comment.commentId">
          <a-avatar
            style="color: #f56a00; backgroundColor: #fde3cf"
            slot="avatar"
          >{{ fdRecord.crtName }}</a-avatar>
          <span slot="content">{{ comment.content }}</span>
          <div v-if="fdRecord.crtUser===user.id">
            <span slot="actions">
              <a @click="deleteComment(comment)">删除</a>
            </span>
          </div>
        </a-comment>
        <!-- <a-comment>
          <a-avatar
            style="color: #f56a00; backgroundColor: #fde3cf"
            slot="avatar"
          >{{ fdRecord.crtName }}</a-avatar>
          <p slot="content">{{ fdRecord.title }}     {{ fdRecord.content }}</p>
          <span v-if="commentList.length === 0">暂时没有评论</span>
          <a-comment v-for="comment in commentList" :key="comment.commentId">
            <a-avatar
              style="color: #f56a00; backgroundColor: #fde3cf"
              slot="avatar"
            >{{ fdRecord.crtName }}</a-avatar>
            <span slot="content">{{ comment.content }}
            </span>
            <div v-if="fdRecord.crtUser===user.id">
              <span slot="actions">
                <a @click="deleteComment(comment)">删除</a>
              </span>
            </div>
          </a-comment>
        </a-comment>-->
      </a-card>
      <a-card style="padding: 20px;">
        <!-- 提交 -->
        <a-comment>
          <a-avatar style="color: #f56a00; backgroundColor: #fde3cf" slot="avatar">{{ user.name }}</a-avatar>
          <div slot="content">
            <a-form-item :wrapperCol="wrapperCol">
              <a-textarea :rows="4" v-model="commentValue" placeholder="评论"></a-textarea>
            </a-form-item>
            <a-form-item>
              <a-button
                htmlType="submit"
                :loading="commentloading"
                @click="submitComment"
                type="primary"
              >提交</a-button>
            </a-form-item>
          </div>
        </a-comment>
      </a-card>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import {
  getFeedback,
  addFeedback,
  delFeedback,
  updateFeedback,
  getComment,
  addComment,
  delComment
} from '@/api/workplace'
export default {
  name: 'Feedbacklist',
  components: {
    STable
  },
  data () {
    return {
      // 当前登录人信息
      user: {},
      // 弹出框
      editVisible: false,
      // 意见反馈主页
      feedbackCard: true,
      // 意见回复页
      commentCarcd: false,
      // 提交意见反馈等待状态
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      editForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '提出人',
          dataIndex: 'crtName'
        },
        {
          title: '提出时间',
          dataIndex: 'crtTime'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getFeedback(parameter).then(res => {
          return res.result
        })
      },
      // 单条意见反馈信息
      fdRecord: {},
      // 评论列表
      commentList: [],
      // 提交评论内容
      commentValue: '',
      // 提交评论加载样式
      commentloading: false,
      feedBackId: '',
      type: '',
      id: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    // 当前登录人信息
    this.user = this.userInfo
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    /**
     * 打开意见反馈窗口
     */
    openFbModal (type, record) {
      this.bindForm(type, record)
      this.editVisible = true
      this.type = type
      if (record) {
        this.id = record.id
      }
    },
    /**
     * 绑定表单值
     */
    bindForm (type, record) {
      if (type === 'add') {
        setTimeout(() => {
          this.editForm.setFieldsValue({
            title: '',
            content: ''
          })
        }, 0)
      } else {
        setTimeout(() => {
          this.editForm.setFieldsValue({
            title: record.title,
            content: record.content
          })
        }, 0)
      }
    },
    /**
     * 提出意见反馈
     */
    submitFeedback () {
      this.editForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.type === 'add') {
            addFeedback(values)
              .then(res => {
                if (res.status === 200) {
                  this.$notification['success']({
                    message: '操作成功',
                    duration: 2
                  })
                  this.editVisible = false
                  this.search()
                }
              })
              .catch(() =>
                this.$notification['error']({
                  message: '出现异常，请联系系统管理员',
                  duration: 4
                })
              )
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            values.id = this.id
            updateFeedback(values)
              .then(res => {
                if (res.status === 200) {
                  this.$notification['success']({
                    message: '操作成功',
                    duration: 2
                  })
                  this.editVisible = false
                  this.search()
                }
              })
              .catch(() =>
                this.$notification['error']({
                  message: '出现异常，请联系系统管理员',
                  duration: 4
                })
              )
              .finally(() => {
                this.confirmLoading = false
              })
          }
        }
      })
    },
    /**
     * 删除意见
     */
    deleteFeedback (record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确认删除吗?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          return delFeedback(record.id)
            .then(res => {
              if (res.status === 200) {
                _this.$notification['success']({
                  message: '删除成功',
                  duration: 2
                })
                _this.$refs.stable.refresh(true)
              } else {
                _this.$notification['error']({
                  message: res.message,
                  duration: 4
                })
              }
            })
            .catch(() =>
              _this.$notification['error']({
                message: '出现异常，请联系系统管理员',
                duration: 4
              })
            )
        },
        onCancel: () => {
          this.$notification['info']({
            message: '取消删除操作',
            duration: 4
          })
        }
      })
    },
    /**
     * 打开评论卡片
     */
    openComment (record) {
      this.commentCarcd = true
      this.feedbackCard = false
      this.fdRecord = Object.assign({}, record)
      this.feedBackId = record.id
      this.getCommentsById()
    },
    /**
     * 根据id获取评论列表
     */
    getCommentsById () {
      getComment({ 'feedbackId': this.feedBackId }).then(res => {
        if (res.status === 200) {
          this.commentList = res.result.data
        }
      })
    },
    /**
     * 返回意见反馈页
     */
    returnFbPage () {
      this.commentCarcd = false
      this.feedbackCard = true
    },
    // 提交评论
    submitComment () {
      if (this.commentValue) {
        this.commentloading = true
        addComment({ feedbackId: this.feedBackId, content: this.commentValue })
          .then(res => {
            if (res.status === 200) {
              this.$notification['success']({
                message: '操作成功',
                duration: 2
              })
              this.commentloading = false
              this.commentValue = ''
              this.getCommentsById()
            }
          })
          .catch(() =>
            this.$notification['error']({
              message: '出现异常，请联系系统管理员',
              duration: 4
            })
          )
      }
    },
    /**
     * 删除评论
     */
    deleteComment (record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确认删除吗?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          return delComment(record.id)
            .then(res => {
              if (res.status === 200) {
                _this.$notification['success']({
                  message: '删除成功',
                  duration: 2
                })
                _this.getCommentsById()
              } else {
                _this.$notification['error']({
                  message: res.message,
                  duration: 4
                })
              }
            })
            .catch(() =>
              _this.$notification['error']({
                message: '出现异常，请联系系统管理员',
                duration: 4
              })
            )
        },
        onCancel: () => {
          this.$notification['info']({
            message: '取消删除操作',
            duration: 4
          })
        }
      })
    }
  }
}
</script>
