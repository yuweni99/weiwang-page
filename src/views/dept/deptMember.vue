<template>
  <div class="app-container">

    <el-form :inline="true" :model="queryParams">
      <el-form-item label="部门人员">
        <el-input v-model.trim="queryParams.keyword" clearable placeholder="姓名/账号/手机号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button type="primary" @click="showInvitationMember = true">邀请人员</el-button>
        <el-button type="primary" @click="exportMembers">导出</el-button>
        <el-button type="primary" @click="$router.back()">返回</el-button>

        <el-upload
          class="upload-demo"
          :action="getUploadUrl()"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :limit="1"
          :show-file-list="false"
          :on-success="handleImportSuccess"
          :data="{
            deptId: $route.query.deptId,
            deptName: $route.query.deptName,
          }"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptMembers"
      row-key="id"
    >
      <el-table-column prop="id" label="id" />
      <el-table-column prop="userId" label="用户id" />
      <el-table-column prop="userName" label="用户姓名" />
      <el-table-column prop="userMobile" label="用户手机号" />
      <el-table-column prop="post" label="职位" />
      <el-table-column prop="joinDateStr" label="加入时间" />
      <el-table-column prop="deptName" label="部门名称" />
      <el-table-column prop="level" label="是否管理员">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showEditMemberPage(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            删除
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

    <el-dialog title="编辑用户" :visible.sync="showEditMember" width="630px">
      <el-form ref="deptMemberForm" :model="deptMember" :rules="deptMemberRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="职位">
              <el-input v-model="deptMember.post" clearable placeholder="请输入职位" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="权限" prop="level">
              <el-select v-model="deptMember.level" placeholder="placeholder" value="">
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
        <el-button @click="cancelUpdate">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="邀请用户" :visible.sync="showInvitationMember" width="630px">
      <el-form ref="invitationMemberForm" :model="invitationMember" :rules="invitationMemberRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号" prop="userMobile">
              <el-input
                v-model="invitationMember.userMobile"
                clearable
                placeholder="请输入联系电话(不加区号)"
                @input.native="findInfoByMobile"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="invitationMember.userName" disabled clearable placeholder="姓名" />

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleInvitationMember">确 定</el-button>
        <el-button @click="cancelInvitationMember">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { delDeptMember, inviteDeptMember, pageQuery, updateDeptMember } from '@/api/deptMember'
import { findInfoByMobile } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'DeptMember',
  data() {
    return {
      levels: [
        { name: '管理员', value: 1 },
        { name: '普通用户', value: 2 }
      ],
      invitationMember: {
        userMobile: null,
        userName: null
      },
      showInvitationMember: false,
      showEditMember: false,
      dept: {},
      deptMembers: [],
      loading: false,
      queryParams: {
        deptId: this.$route.query.deptId,
        keyword: null,
        page: 1,
        limit: 10
      },
      total: 0,
      deptMember: {
        post: null,
        level: null
      },
      userInfo: {},
      deptMemberRules: {
        level: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ]
      },
      invitationMemberRules: {
        userMobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        userName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 处理上传成功
    handleImportSuccess(response, file, fileList) {
      // 上传失败
      if (response.resultCode !== 1) {
        this.$message.error('上传失败，请联系管理员')
        return
      }

      const { num, successNum } = response.data
      this.$message.success(`操作成功,总条数${num}, 成功条数${successNum}`)
    },
    exportMembers() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const url = `${baseUrl}/console/deptMember/export?access_token=${this.token}&keyword=${(this.queryParams.keyword || '')}&deptId=${this.$route.query.deptId}`
      window.location.href = url
    },
    getUploadUrl() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const url = `${baseUrl}/console/deptInviteMember/importData?access_token=${this.token}`
      return url
    },
    async findInfoByMobile() {
      const pattern = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/

      this.$set(this.invitationMember, 'userName', '')
      if (!pattern.test(this.invitationMember.userMobile)) {
        return
      }

      const result = await findInfoByMobile({ mobile: this.invitationMember.userMobile })
      this.userInfo = result.data

      if (this.userInfo == null) {
        return
      }

      if (this.userInfo.authStatus !== '1') {
        return
      }
      this.$set(this.invitationMember, 'userName', this.userInfo.authName)
    },
    cancelInvitationMember() {
      this.showInvitationMember = false
      this.invitationMember = {}
    },
    handleInvitationMember() {
      this.$refs['invitationMemberForm'].validate(async valid => {
        if (!valid) {
          return false
        }

        const data = {
          ...this.invitationMember,
          deptId: this.$route.query.deptId,
          deptName: this.$route.query.deptId,
          userId: this.userInfo.userId,
          userIdCard: this.userInfo.authIdCard
        }

        await inviteDeptMember(data)
        this.$message.success('邀请成功')
        this.cancelInvitationMember()
      })
    },
    showEditMemberPage(row) {
      this.showEditMember = true
      this.deptMember = { ...row }
    },
    cancelUpdate() {
      this.showEditMember = false
    },
    async handleUpdate() {
      this.$refs['deptMemberForm'].validate(async valid => {
        if (!valid) {
          return false
        }
        await updateDeptMember(this.deptMember)
        this.$message.success('操作成功')
        this.queryParams.page = 1
        this.getList()
      })
    },
    async getList() {
      this.loading = true
      const result = await pageQuery(this.queryParams)
      const { data, count } = result

      this.deptMembers = data
      this.total = count
      this.loading = false
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      await this.$confirm('是否确认删除名称为"' + (row.userName || row.id) + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
      await delDeptMember(row.id)
      this.$message.success('操作成功')
      this.queryParams.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
