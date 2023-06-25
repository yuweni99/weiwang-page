<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item label="在线状态">
        <el-select v-model="queryParams.onlinestate" size="mini" placeholder="请选择在线状态">
          <el-option
            v-for="item in onlineStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="用户昵称">
        <el-input v-model="queryParams.keyWord" size="mini" placeholder="请输入用户昵称" clearable />
      </el-form-item>

      <el-form-item label="用户姓名">
        <el-input v-model="queryParams.authName" size="mini" placeholder="请输入用户姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.phone" size="mini" placeholder="请输入手机号" clearable />
      </el-form-item>

      <el-form-item label="身份证">
        <el-input v-model="queryParams.authIdCard" size="mini" placeholder="请输入身份证" clearable />
      </el-form-item>

      <el-form-item label="微网账号">
        <el-input v-model="queryParams.account" size="mini" placeholder="请输入微网账号" clearable />
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="queryParams.sex" size="mini" clearable placeholder="请选择性别">
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="民族">
        <el-input v-model="queryParams.nation" size="mini" placeholder="请输入民族" clearable />
      </el-form-item>

      <el-form-item label="籍贯">
        <el-input v-model="queryParams.origin" size="mini" placeholder="请输入籍贯" clearable />
      </el-form-item>

      <el-form-item label="最后在线时间">
        <el-date-picker
          v-model="onlineDates"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择最后在线时间"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleOnlineDateChange"
        />
      </el-form-item>

      <el-form-item label="最后离线时间">
        <el-date-picker
          v-model="offlineDates"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择最后离线时间"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleOfflineDateChange"
        />
      </el-form-item>

      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dates"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择注册时间"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="getList">搜索</el-button>
        <el-button size="mini" type="info" @click="reset">重置</el-button>
        <el-button size="mini" type="primary" @click="openEditUserPage">新增用户</el-button>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="loading"
      :data="users"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="用户照片" width="100">
        <template v-slot="scope">
          <el-image
            style="width: 100px;height: 100px"
            :src="scope.row.photo"
            :preview-src-list="[scope.row.photo]"
            fit="fit"
          />
        </template>
      </el-table-column>

      <el-table-column label="头像" width="100">
        <template v-slot="scope">
          <el-image
            style="width: 100px;height: 100px"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
            fit="fit"
          />
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="微网id" />
      <el-table-column prop="authName" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="authIdCard" label="身份证" width="200" />
      <el-table-column prop="account" label="微网账号" />
      <el-table-column label="性别">
        <template v-slot="scope">
          <el-tag :type="scope.row.sex === 0 ? 'success':'info'">{{
            scope.row.sex === 0 ? '女' : '男'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="birthdayStr" label="生日" />
      <el-table-column prop="age" label="民族">
        <template v-slot="scope">
          <el-tag v-if="scope.row.userSeniorAuth" type="success"> {{ scope.row.userSeniorAuth.nation }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="origin" label="籍贯" width="150" />
      <el-table-column prop="balance" label="用户余额" />
      <el-table-column prop="age" label="登陆设备">
        <template v-slot="scope">
          <span v-if="scope.row.loginLog ">
            {{ scope.row.loginLog.model ? scope.row.loginLog.model : '其他设备' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="200" :formatter="dateFormatter" label="注册时间" />
      <el-table-column label="在线状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.onlinestate === '0' ? 'success':'info'">{{
            scope.row.onlinestate === 1 && scope.row.loginLog ? '在线' : '离线'
          }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="在线应用" />
      <el-table-column prop="loginLog" label="最后上线时间">
        <template v-slot="scope">
          <span v-if="scope.row.loginLog">{{ parseTime(scope.row.loginLog.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginLog" label="最后离线时间">
        <template v-slot="scope">
          <span v-if="scope.row.loginLog && scope.row.login">{{ parseTime(scope.row.loginLog.offlineTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="400">
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="openEditUserPage(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteUser(scope.row)"
          >删除
          </el-button>

          <el-button
            size="mini"
            @click="openResetPasswordPage(scope.row.userId)"
          >重置密码
          </el-button>
          <el-button
            size="mini"
            @click="changeStatus(scope.row)"
          >{{ scope.row.status === 1 ? '封号' : '解封' }}
          </el-button>

          <el-button
            v-if="scope.row.authStatus === '1'"
            size="mini"
            @click="cleanAuth(scope.row)"
          >清理实名
          </el-button>

          <el-button
            size="mini"
            @click="recharge(scope.row)"
          >充值
          </el-button>

          <el-button
            size="mini"
            @click="withdrawalAmount(scope.row)"
          >提现
          </el-button>

          <el-button
            size="mini"
            @click="openBillPage(scope.row)"
          >账单
          </el-button>
          <el-button
            size="mini"
            @click="openFriendsPage(scope.row)"
          >好友管理
          </el-button>
          <el-button
            size="mini"
            @click="openSendMessagePage(scope.row)"
          >发送消息
          </el-button>
          <el-button
            size="mini"
            @click="openUserSettingPage(scope.row)"
          >用户设置
          </el-button>
          <el-button
            size="mini"
            @click="openUserInfoPage(scope.row)"
          >用户详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="user.userId ? '修改用户' : '新增用户'"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="handleUserClose"
    >
      <el-form ref="userForm" :rules="userRules" :model="user" label-width="150px">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="user.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="user.phone"
            clearable
            type="number"
            placeholder="请输入手机号"
          />
        </el-form-item>

        <!--        <el-form-item v-if="user.userId" label="微网账号" prop="account">-->
        <!--          <el-input-->
        <!--            v-model="user.account"-->
        <!--            clearable-->
        <!--            placeholder="微网账号"-->
        <!--          />-->
        <!--        </el-form-item>-->

        <el-form-item v-if="!user.userId" label="密码" prop="password">
          <el-input
            v-model="user.password"
            clearable
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="出生日期类别" prop="birthDateType">
          <el-select v-model="user.birthDateType" placeholder="请选择出生日期类别">
            <el-option
              v-for="item in birthDateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthdayStr">
          <el-date-picker
            v-model="user.birthdayStr"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="出生日期"
          />
        </el-form-item>

        <el-form-item label="是否设置为公众号" prop="userType">
          <el-select v-model="user.userType" placeholder="请选择是否设置公众号">
            <el-option
              v-for="item in setOfficialAccountTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUserClose">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="resetPasswordDialogVisible"
      width="30%"
      append-to-body
      :before-close="handleResetPasswordClose"
    >
      <el-form ref="resetPasswordForm" :rules="resetPasswordRules" :model="resetPassword" label-width="80px">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="resetPassword.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item label="密码" prop="confirmPassword">
          <el-input
            v-model="resetPassword.confirmPassword"
            type="password"
            placeholder="请输入确认密码"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleResetPasswordClose">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="billDialogVisible"
      title="账单"
      :visible.sync="billDialogVisible"
      width="80%"
      append-to-body
      :before-close="handleBillClose"
    >
      <UserBill :user-id="userId" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBillClose">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="friendsDialogVisible"
      title="好友列表"
      :visible.sync="friendsDialogVisible"
      append-to-body
      width="80%"
    >
      <UserFriends :user-id="userId" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="friendsDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="sendMessageDialogVisible"
      title="发送消息"
      :visible.sync="sendMessageDialogVisible"
      width="40%"
    >
      <el-form ref="sendMessageForm" :rules="sendMessageRules" :model="sendMessage" label-width="80px">
        <el-form-item label="接收的用户Id" prop="toUserId">
          <el-input
            v-model="sendMessage.toUserId"
            disabled
          />
        </el-form-item>

        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="sendMessage.content"
            type="text"
            placeholder="请输入消息内容"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSendMessage">发送</el-button>
        <el-button @click="handleSendMessageClose">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="userSettingDialogVisible"
      title="用户设置"
      :visible.sync="userSettingDialogVisible"
      append-to-body
      width="80%"
    >
      <UserSetting :user-id="userId" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="userSettingDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="userInfoDialogVisible"
      title="用户信息"
      :visible.sync="userInfoDialogVisible"
      append-to-body
      width="80%"
    >
      <UserInfo :user-id="userId" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInfoDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import md5 from 'md5'

import { parseTime } from '@/utils/index.js'

import UserBill from '@/views/user/components/UserBill.vue'
import UserFriends from '@/views/user/components/UserFriends.vue'
import UserSetting from '@/views/user/components/UserSetting.vue'
import UserInfo from '@/views/user/components/UserInfo.vue'

import {
  changeStatus,
  cleanAuth,
  deleteUser,
  recharge,
  sendUserMsg,
  updateUser,
  updateUserPassword,
  userList,
  withdrawalAmount
} from '@/api/user'

export default {
  name: 'User',
  components: {
    UserBill,
    UserFriends,
    UserSetting,
    UserInfo
  },
  data() {
    return {
      userSettingDialogVisible: false,
      userInfoDialogVisible: false,
      sendMessageDialogVisible: false,
      dialogVisible: false,
      billDialogVisible: false,
      friendsDialogVisible: false,
      userId: null,
      resetPasswordDialogVisible: false,
      resetPassword: {
        password: null,
        confirmPassword: null
      },
      user: {
        birthday: null,
        birthDate: null,
        userType: null,
        birthDateType: null,
        telephone: null,
        nickname: null,
        password: null,
        account: null,
        userId: null,
        phone: null
      },
      sexList: [
        { value: '0', label: '女' },
        { value: '1', label: '男' }
      ],
      birthDateTypes: [
        { value: '1', label: '阳历' },
        { value: '2', label: '阴历' }
      ],
      setOfficialAccountTypes: [
        { value: 0, label: '否' },
        { value: 2, label: '是' }
      ],
      dates: [],
      // 在线时间
      onlineDates: [],
      // 离线时间
      offlineDates: [],
      loading: false,
      queryParams: {
        page: 1,
        limit: 10,
        onlinestate: null,
        keyWord: null,
        authIdCard: null,
        account: null,
        sex: null,
        nation: null,
        origin: null,
        phone: null,
        userType: 1,
        offlineEndDate: null,
        offlineStartDate: null,
        onlineStartDate: null,
        onlineEndDate: null
      },
      onlineStates: [
        { label: '在线', value: 1 },
        { label: '离线', value: 0 }
      ],
      users: [],
      total: 0,
      sendMessage: {
        type: 1,
        content: null,
        toUserId: null
      },
      sendMessageRules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        toUserId: [
          { required: true, message: '接受用户id不能为空', trigger: 'blur' }
        ]
      },
      resetPasswordRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' }
        ]
      },
      userRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        birthDateType: [
          { required: true, message: '请选择生日类别', trigger: 'blur' }
        ],
        birthdayStr: [
          { required: true, message: '请选择生日', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择是否设置公众号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleBirthDateChange(value) {
      this.$set(this.user, 'birthDate', value)
      this.$forceUpdate()
    },
    openUserSettingPage(data) {
      this.userId = data.userId
      this.userSettingDialogVisible = true
    },
    openUserInfoPage(data) {
      this.userId = data.userId
      this.userInfoDialogVisible = true
    },
    handleSendMessage() {
      this.$refs.sendMessageForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        this.sendMessage.type = '1'
        await sendUserMsg(this.sendMessage)

        await this.this.$message.success('发送成功')
        this.sendMessageDialogVisible = false
      })
    },
    handleSendMessageClose() {
      this.sendMessageDialogVisible = false
      this.sendMessage = {}
    },
    openSendMessagePage(data) {
      this.user = data
      this.sendMessage.toUserId = data.userId
      this.sendMessageDialogVisible = true
    },
    async openBillPage(user) {
      this.userId = user.userId
      this.billDialogVisible = true
    },
    async openFriendsPage(user) {
      this.userId = user.userId
      this.friendsDialogVisible = true
    },
    validatePassword(rule, value, callback) {
      if (this.resetPassword.password !== this.resetPassword.confirmPassword) {
        callback(new Error('确认密码不一致'))
        return false
      }
      callback()
    },
    handleBillClose() {
      this.billDialogVisible = false
    },
    handleResetPasswordClose() {
      this.resetPasswordDialogVisible = false
      this.resetPassword = {
        password: null,
        confirmPassword: null
      }
      this.userId = null
    },
    openResetPasswordPage(userId) {
      this.userId = userId
      this.resetPasswordDialogVisible = true
    },
    openEditUserPage(user = {}) {
      this.user = { ...user }

      if (!this.user.userId) {
        this.user.userId = 0
      }

      this.dialogVisible = true
    },
    handleUserClose() {
      this.dialogVisible = false
      this.user = {}
    },
    parseTime,
    handleDateChange() {
      if (!this.dates || !this.dates.length) {
        this.queryParams.startDate = null
        this.queryParams.endDate = null
        return
      }

      const [startDate, endDate] = this.dates
      this.queryParams.startDate = startDate
      this.queryParams.endDate = endDate
    },

    handleOnlineDateChange() {
      if (!this.onlineDates || !this.onlineDates.length) {
        this.queryParams.onlineStartDate = null
        this.queryParams.onlineEndDate = null
        return
      }

      const [onlineStartDate, onlineEndDate] = this.onlineDates
      this.queryParams.onlineStartDate = onlineStartDate
      this.queryParams.onlineEndDate = onlineEndDate
    },
    handleOfflineDateChange() {
      if (!this.offlineDates || !this.offlineDates.length) {
        this.queryParams.offlineStartDate = null
        this.queryParams.offlineEndDate = null
        return
      }

      const [startDate, endDate] = this.offlineDates
      this.queryParams.offlineStartDate = startDate
      this.queryParams.offlineEndDate = endDate
    },
    dateFormatter(row, column, cellValue, index) {
      if (!cellValue) {
        return ''
      }

      return parseTime(cellValue, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    reset() {
      this.queryParams = {
        page: 0,
        limit: 10,
        onlinestate: null,
        keyWord: null,
        authIdCard: null,
        account: null,
        sex: null,
        nation: null,
        origin: null,
        phone: null,
        userType: 1,
        offlineEndDate: null,
        offlineStartDate: null,
        onlineStartDate: null,
        onlineEndDate: null
      }
      this.dates = []
      this.onlineDates = []
      this.offlineDates = []
      this.getList()
    },
    async getList() {
      try {
        this.loading = true

        const result = await userList(this.queryParams)
        const { data, count } = result

        this.users = data
        this.total = count
      } finally {
        this.loading = false
      }
    },
    saveUser() {
      this.$refs.userForm.validate(async(valid) => {
        if (!valid) {
          return false
        }
        this.user.setType = 1
        this.user.telephone = this.user.phone
        this.user.birthday = Date.parse(this.user.birthdayStr) / 1000
        await updateUser(this.user)
        this.$message.success('操作成功')
        this.handleUserClose()
        await this.getList()
      })
    },
    updatePassword() {
      this.$refs.resetPasswordForm.validate(async(valid) => {
        if (!valid) {
          return false
        }
        await updateUserPassword({ userId: this.userId, password: md5(this.resetPassword.password) })
        this.$message.success('重置成功')
        this.handleResetPasswordClose()
      })
    },
    async deleteUser(data) {
      await this.$confirm(`确认删除'${data.nickname}'用户吗?`, '警告')
      await deleteUser(data.userId)
      this.$message.success('操作成功')
      await this.getList()
    },
    async changeStatus(data) {
      const status = data.status === 1 ? -1 : 1
      await this.$confirm(`确认${data.status === 1 ? '封号' : '解封'}用户吗?`, '警告')
      await changeStatus({ status, userId: data.userId })
      this.$message.success('操作成功')
      await this.getList()
    },
    async cleanAuth(data) {
      await this.$confirm(`确认清理${data.nickname}用户认证吗?`, '警告')
      await cleanAuth({ userId: data.userId })
      this.$message.success('操作成功')
    },
    withdrawalAmount(data) {
      this.$prompt('请输入金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d/,
        inputErrorMessage: '请输入金额'
      }).then(async({ value }) => {
        if (value && value > 1) {
          this.$message.warning('每次只能提现1元')
          return
        }

        await withdrawalAmount({ userId: data.userId, money: 1 })
        this.$message.success('提现成功')
      })
    },
    async recharge(data) {
      this.$prompt('请输入金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d/,
        inputErrorMessage: '请输入金额'
      }).then(async({ value }) => {
        if (value && value > 1) {
          this.$message.warning('每次只能充值1元')
          return
        }

        await recharge({ userId: data.userId, money: 1 })
        this.$message.success('充值成功')
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
