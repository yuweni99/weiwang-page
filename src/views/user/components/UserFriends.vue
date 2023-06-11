<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="queryParams">

      <el-form-item>
        <el-button type="primary" size="mini" @click="handleMultipleSelectionDelete">多选删除</el-button>
        <el-button type="primary" size="mini" @click="exportFriends">导出好友明细</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="friends"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column type="index" label="序号" />
      <el-table-column prop="toUserId" label="好友Id" />
      <el-table-column prop="toNickname" label="好友昵称" />
      <el-table-column label="状态">
        <template v-slot="scope">
          <span>{{ status[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否拉黑">
        <template v-slot="scope">
          <span>{{ scope.row.blacklist === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否被拉黑">
        <template v-slot="scope">
          <span>{{ scope.row.isBeenBlack === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否消息免打扰">
        <template v-slot="scope">
          <span>{{ scope.row.offlineNoPushMsg === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="成为好友的时间">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="300">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="deleteFriends(scope.row.toUserId)">删除好友</el-button>
          <el-button type="primary" size="mini" @click="openChatLogPage(scope.row)">聊天记录</el-button>
          <el-button type="primary" size="mini" @click="joinBlack(scope.row)">
            {{ scope.row.blacklist === 1 ? '移除黑名单' : '加入黑名单' }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="friendsList"
    />

    <el-dialog
      v-if="chatLogDialogVisible"
      title="聊天记录"
      :visible.sync="chatLogDialogVisible"
      width="80%"
      append-to-body
    >
      <el-button type="primary" size="mini" @click="handleMultipleSelectionChatLogDelete">删除</el-button>
      <el-table
        v-loading="chatLogLoading"
        :data="chatLogs"
        row-key="id"
        @selection-change="handleSelectionChatLogChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="sender" label="用户Id" />
        <el-table-column prop="sender_nickname" label="发送者" />
        <el-table-column prop="receiver" label="好友Id" />
        <el-table-column prop="receiver_nickname" label="接收者" />
        <el-table-column prop="contentType" label="消息类型">
          <template v-slot="scope">
            <span>{{ msgType[scope.row.contentType] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeSend" label="发送时间">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.timeSend) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="消息内容" />
        <el-table-column prop="desc" label="备注" />
        <el-table-column label="操作" fixed="right" width="300">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="deleteChatLog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="chatLogTotal>0"
        :total="chatLogTotal"
        :page.sync="chatLogQueryParams.page"
        :limit.sync="chatLogQueryParams.limit"
        @pagination="findChatLogs"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="chatLogDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { deleteFriends, delFriendsChatRecord, friendsChatRecord, friendsList, joinBlackList } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'UserFriends',
  props: {
    userId: {
      require: true,
      type: Number
    }
  },
  data() {
    return {
      chatLogLoading: false,
      chatLogDialogVisible: false,
      chatLogs: [],
      chatLogTotal: 0,
      multipleSelection: [],
      selectionChatLogs: [],
      chatLogQueryParams: {
        page: 1,
        limit: 10
      },
      status: {
        '1': '关注',
        '2': '好友',
        '-1': '黑名单'
      },
      friends: [],
      total: 0,
      loading: false,
      queryParams: {
        page: 1,
        limit: 10
      },
      friend: {},
      msgType: {
        '1': '文本消息',
        '2': '图片消息',
        '3': '语音消息',
        '4': '位置消息',
        '5': '动画消息',
        '6': '视频消息',
        '7': '音频消息',
        '8': '名片消息',
        '9': '文件消息',
        '10': '提醒消息',
        '28': '红包消息',
        '83': '领取红包消息',
        '86': '红包退回消息',
        '29': '转账消息',
        '80': '单条图文消息',
        '81': '多条图文消息',
        '84': '戳一戳消息',
        '85': '聊天记录消息',
        '88': '转账被领取消息',
        '89': '转账已退回消息',
        '90': '付款码已付款通知消息',
        '91': '付款码已到账通知消息',
        '92': '收款码已付款通知消息',
        '93': '收款码已到账通知消息',
        '95': '阅后即焚消息截屏消息',
        '96': '双向撤回消息',
        '201': '正在输入消息',
        '202': '撤回消息',
        '100': '发起语音通话消息',
        '102': '接听语音通话消息',
        '103': '拒绝语音通话消息',
        '104': '结束语音通话消息',
        '110': '发起视频通话消息',
        '112': '接听视频通话消息',
        '113': '拒绝视频通话消息',
        '114': '结束视频通话消息',
        '115': '会议邀请消息',
        '901': '修改昵称消息',
        '902': '修改房间名消息',
        '903': '解散房间消息',
        '904': '退出房间消息',
        '905': '新公告消息',
        '906': '禁言、取消禁言消息',
        '907': '增加成员消息',
        '913': '设置、取消管理员消息',
        '915': '设置群已读消息',
        '916': '群验证消息',
        '917': '群组是否公开消息',
        '918': '是否展示群成员列表消息',
        '919': '允许发送名片消息',
        '920': '全员禁言消息',
        '921': '允许普通群成员邀请好友加群',
        '922': '允许普通成员上传群共享',
        '923': '允许普通成员发起会议',
        '924': '允许普通成员发送讲课',
        '925': '转让群组',
        '930': '设置、取消隐身人，监控人',
        '931': '群组被后台封锁/解封',
        'unknown': '其他消息类型'
      }
    }
  },
  mounted() {
    this.friendsList()
  },
  methods: {
    async openChatLogPage(data) {
      this.friend = data
      this.chatLogDialogVisible = true
      await this.findChatLogs()
    },

    async handleMultipleSelectionChatLogDelete() {
      if (!this.selectionChatLogs || !this.selectionChatLogs.length) {
        this.$message.warning('请选择要操作的数据')
        return
      }
      const messageIds = this.selectionChatLogs.map(item => item.messageId).join(',')
      await this.$confirm(`确认删除聊天记录吗?`, '警告')
      const data = {
        userId: this.userId,
        adminUserId: this.$store.getters.userId,
        messageIds
      }
      await deleteFriends(data)
      this.$message.success('操作成功')
      await this.friendsList()
    },
    async deleteChatLog(chatLog) {
      await this.$confirm(`确认删除聊天记录吗?`, '警告')
      const data = {
        sender: chatLog.sender,
        adminUserId: this.$store.getters.userId,
        messageIds: chatLog.messageId
      }

      await delFriendsChatRecord(data)
      this.$message.success('操作成功')
      this.findChatLogs()
    },
    async findChatLogs() {
      this.chatLogLoading = true
      try {
        this.chatLogQueryParams.userId = this.friend.userId
        this.chatLogQueryParams.toUserId = this.friend.toUserId
        const result = await friendsChatRecord(this.chatLogQueryParams)
        this.chatLogs = result.data
        this.chatLogTotal = result.count
      } finally {
        this.chatLogLoading = false
      }
    },
    exportFriends() {
      const token = getToken()
      const base = process.env.VUE_APP_BASE_API

      const url = `${base}/console/exportExcelByFriends?access_token=${token}&userId=${this.userId}`
      window.location.href = url
    },
    handleSelectionChatLogChange(row) {
      this.selectionChatLogs = row
    },
    async handleMultipleSelectionDelete() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message.warning('请选择要操作的数据')
        return
      }
      const toUserIds = this.multipleSelection.map(item => item.userId).join(',')
      await this.deleteFriends(toUserIds)
    },
    async deleteFriends(toUserIds) {
      await this.$confirm(`确认删除好友吗`, '警告')
      const data = {
        userId: this.userId,
        adminUserId: this.$store.getters.userId,
        toUserIds
      }
      await deleteFriends(data)
      this.$message.success('操作成功')
      await this.friendsList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async joinBlack(friend) {
      await this.$confirm(`确认将该好友${friend.toNickname}${friend.blacklist === 1 ? '移除黑名单' : '加入黑名单'}`, '警告')
      const type = friend.blacklist === 1 ? 0 : 1

      const data = {
        userId: friend.userId,
        toUserId: friend.toUserId,
        type,
        adminUserId: this.$store.getters.userId
      }

      await joinBlackList(data)
      this.$message.success('操作成功')
      await this.friendsList()
    },
    async friendsList() {
      this.loading = true
      try {
        this.queryParams.userId = this.userId
        const result = await friendsList(this.queryParams)
        this.friends = result.data
        this.total = result.count
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
