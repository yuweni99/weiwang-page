<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item>
        <el-form-item label="应用名字">
          <el-input v-model="queryParams.name" size="mini" placeholder="请输入应用名称" clearable />
        </el-form-item>

        <el-button size="mini" type="primary" @click="getList">搜索</el-button>
        <el-button size="mini" type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptApplications"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="deptName" label="部门名称" />
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column prop="applicationCode" label="应用编码" />
      <el-table-column prop="startDateStr" label="开始日期" />
      <el-table-column prop="endDateStr" label="结束日期" />
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === '0' ? 'success':'info'">{{
            scope.row.status === '0' ? '禁用' : '启用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applicationName" label="应用程序名称" />
      <el-table-column prop="createUserId" label="申请用户id" />
      <el-table-column prop="createUserName" label="申请用户名" />
      <el-table-column prop="createMobile" label="申请用户手机号" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            @click="openEditDeptApplicationDialog(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="deleteDeptApplication(scope.row)"
          >删除
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
      :title="deptApplicationForm.id ? '编辑单位应用' : '添加单位应用'"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="handleDeptApplicationClose"
    >
      <el-form
        ref="deptApplicationForm"
        :rules="deptApplicationFormRules"
        :model="deptApplicationForm"
        label-width="80px"
      >
        <el-form-item label="使用状态" prop="name">
          <el-switch
            v-model="deptApplicationForm.status"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <el-form-item prop="startDateStr">
          <el-date-picker
            v-model="deptApplicationForm.startDateStr"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          />
        </el-form-item>

        <el-form-item prop="endDateStr">
          <el-date-picker
            v-model="deptApplicationForm.endDateStr"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeptApplicationClose">取 消</el-button>
        <el-button type="primary" @click="saveDeptApplication">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteDeptApplication, pageList, updateDeptApplication } from '@/api/application/deptApplication'

export default {
  name: 'DeptApplication',
  data() {
    return {
      codes: [
        { label: '校友卡', value: 'alumniCard' }
      ],
      dialogVisible: false,
      loading: false,
      deptApplicationForm: {
        id: null,
        name: null,
        status: null,
        startDateStr: null,
        endDateStr: null
      },
      deptApplications: [],
      queryParams: {
        name: null,
        page: 1,
        limit: 10
      },
      total: 0,
      deptApplicationFormRules: {
        status: [
          { required: true, message: '请选择启用状态', trigger: 'blur' }
        ],
        startDateStr: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDateStr: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    openEditDeptApplicationDialog(data = {}) {
      this.deptApplicationForm = { ...data }
      this.dialogVisible = true
    },
    handleDeptApplicationClose() {
      this.dialogVisible = false
      this.deptApplicationForm = {}
    },
    reset() {
      this.queryParams = {
        name: null,
        page: 1,
        limit: 10
      }
      this.getList()
    },
    saveDeptApplication() {
      this.$refs.deptApplicationForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        await updateDeptApplication(this.deptApplicationForm)
        this.$message.success('操作成功')
        this.handleDeptApplicationClose()
        await this.getList()
      })
    },
    async getList() {
      try {
        this.loading = true

        const result = await pageList(this.queryParams)
        const { data, count } = result

        this.deptApplications = data
        this.total = count
      } finally {
        this.loading = false
      }
    },
    async deleteDeptApplication(data) {
      await this.$confirm(`确认删除单位应用吗?`, '警告')
      await deleteDeptApplication(data.id)
      this.$message.success('操作成功')
      await this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
