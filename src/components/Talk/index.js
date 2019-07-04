// 这个组件必须最先引入，否则会报错
import MessagePiece from './MessagePiece'
// 抽屉组件
import TalkSetting from './drawers/TalkSetting'
import TalkHistory from './drawers/TalkHistory'
import GroupNotice from './drawers/GroupNotice'
import MarkMessage from './drawers/MarkMessage'
import MoreInfo from './drawers/MoreInfo'
import TalkFile from './drawers/TalkFile'
import UserFile from './drawers/UserFile'

import ConvBox from './ConvBox'
import RecentContactsItem from './RecentContactsItem'
import ContactsTree from './ContactsTree'
import ContactsInfo from './ContactsInfo'
import ContactItem from './ContactItem'
import GroupItem from './GroupItem'
import GroupInfo from './GroupInfo'

import CreateTalk from './createTalk/CreateTalk'

import SearchAll from './SearchAll'

export {
  // 消息展示组件
  MessagePiece,
  // 研讨设置
  TalkSetting,
  // 研讨历史
  TalkHistory,
  // 群公告
  GroupNotice,
  // 标记消息
  MarkMessage,
  // 更多信息
  MoreInfo,
  // 研讨文件
  TalkFile,
  // 个人文件
  UserFile,
  // 研讨对话框组件
  ConvBox,
  // 联系人组件
  ContactsTree,
  // 联系人信息组件
  ContactsInfo,
  // 最近联系人(项)组件
  RecentContactsItem,
  // 群组(项)组件
  GroupItem,
  ContactItem,
  // 群组信息组件
  GroupInfo,
  // 创建新的研讨
  CreateTalk,
  // 联系人搜索组件
  SearchAll

}
