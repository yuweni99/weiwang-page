<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item>
        <el-form-item label="应用名字">
          <el-input v-model="queryParams.name" size="mini" placeholder="请输入应用名称" clearable />
        </el-form-item>

        <el-form-item label="应用">
          <el-select v-model="queryParams.applicationId" size="mini" placeholder="请选择应用分类">
            <el-option
              v-for="item in applications"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-select v-model="queryParams.status" size="mini" placeholder="请选择启用状态">
            <el-option
              v-for="item in statues"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-select v-model="queryParams.useStatus" size="mini" placeholder="请选择开启状态">
            <el-option
              v-for="item in useStatues"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="getList">搜索</el-button>
          <el-button size="mini" type="primary" @click="getExpiringSoonList">即将过期</el-button>
          <el-button size="mini" type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptApplications"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="applicationName" label="应用程序名称" />
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column prop="deptName" label="部门名称" />
      <el-table-column prop="startDateStr" label="开始日期" />
      <el-table-column prop="endDateStr" label="结束日期" />
      <el-table-column prop="effectiveDays" label="有效期/天" />
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === '0' ? 'success':'info'">{{
            scope.row.status === '0' ? '禁用' : '启用'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="useStatus" label="使用状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.useStatus === '0' ? 'success':'info'">{{
            scope.row.status === '0' ? '禁用' : '使用'
          }}
          </el-tag>
        </template>
      </el-table-column>
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
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            @click="deleteDeptApplication(scope.row)"-->
          <!--          >删除-->
          <!--          </el-button>-->

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

        <el-form-item label="开始时间" prop="startDateStr">
          <el-date-picker
            v-model="deptApplicationForm.startDateStr"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endDateStr">
          <el-date-picker
            v-model="deptApplicationForm.endDateStr"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="deptApplicationForm.remark" type="textarea" placeholder="备注" />
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
import { list as getApplications } from '@/api/application/application'

export default {
  name: 'DeptApplication',
  data() {
    return {
      statues: [
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' }
      ],
      useStatues: [
        { label: '关闭', value: '0' },
        { label: '开启', value: '1' }
      ],
      codes: [
        { label: '校友卡', value: 'alumniCard' }
      ],
      dialogVisible: false,
      loading: false,
      applications: [],
      deptApplicationForm: {
        id: null,
        name: null,
        status: null,
        startDateStr: null,
        endDateStr: null,
        remark: null
      },
      deptApplications: [],
      queryParams: {
        name: null,
        applicationId: this.$route.query.applicationId,
        status: null,
        useStatus: null,
        expiringSoonStatus: null,
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
    this.getApplications()
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
    getExpiringSoonList() {
      this.queryParams.expiringSoonStatus = '1'
      this.getList()
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
    async getApplications() {
      try {
        this.loading = true

        const result = await getApplications(this.queryParams)
        const { data } = result

        this.applications = data
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
