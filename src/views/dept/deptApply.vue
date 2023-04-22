<template>
  <div class="app-container">

    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" @click="$router.back()">返回</el-button>
        <el-button type="primary" @click="getList">刷新数据</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
    >
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="managerUserId" label="申请人id" />
      <el-table-column prop="managerUserName" label="申请人名称" />
      <el-table-column prop="managerUserMobile" label="申请人电话" />
      <el-table-column prop="createTimeStr" label="申请时间" />
      <el-table-column label="状态" width="60">
        <template slot-scope="scope">
          <el-tag :type="statueTypes[scope.row.status]">{{ statues[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === '0'"
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleOverrulePass(scope.row)"
          >通过
          </el-button>
          <el-button
            v-if="scope.row.status === '0'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openOverrulePage(scope.row)"
          >驳回
          </el-button>

          <el-button
            v-if="scope.row.status === '0' || scope.row.status === '2'"
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

    <el-dialog title="驳回申请" :visible.sync="showOverrulePage" width="630px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回原因">
              <el-input v-model="form.overruleCause" clearable placeholder="请输入驳回原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOverrule('2')">确 定</el-button>
        <el-button @click="cancelOverrule">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { approvalDept, delDept, pageQueryDept } from '@/api/dept'

export default {
  name: 'DeptApply',
  data() {
    return {
      dept: {},
      form: { overruleCause: undefined },
      searchForm: {},
      showOverrulePage: false,
      loading: false,
      queryParams: {
        status: '0,1,2',
        companyId: this.$route.query.companyId,
        type: '3',
        page: 1,
        limit: 10
      },
      statues: ['待审核', '已通过', '驳回'],
      statueTypes: ['danger', 'success', 'warning'],
      deptList: [],
      total: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 处理审核通过
     */
    async handleOverrulePass(row) {
      this.dept = row
      await this.$confirm('确定要通过审核吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
      this.handleOverrule('1')
    },
    cancelOverrule() {
      this.form.overruleCause = undefined
      this.showOverrulePage = false
    },
    async handleOverrule(status) {
      const data = { id: this.dept.id, status, remark: this.form.overruleCause }
      await approvalDept(data)
      this.$message.success('操作成功')
      this.showOverrulePage = false
      this.form.overruleCause = undefined

      this.queryParams.page = 1
      this.getList()
    },
    /**
     * 打开驳回页面
     */
    openOverrulePage(row) {
      this.dept = row
      this.showOverrulePage = true
    },
    async getList() {
      this.loading = true
      const result = await pageQueryDept(this.queryParams)
      const { data, count } = result

      this.deptList = data
      this.total = count
      this.loading = false
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      await this.$confirm('是否确认删除名称为"' + row.name + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
      await delDept(row.id)
      this.$message.success('操作成功')
      this.queryParams.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
