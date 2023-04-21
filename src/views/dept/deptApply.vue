<template>
  <div class="app-container">

    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
    >
      <el-table-column prop="id" label="id" width="260" />
      <el-table-column prop="name" label="部门名称" width="100" />
      <el-table-column prop="managerUserId" label="申请人id" width="100" />
      <el-table-column prop="managerUserName" label="申请人名称" width="100" />
      <el-table-column prop="managerUserMobile" label="申请人电话" width="130" />
      <el-table-column prop="createTimeStr" label="申请时间" width="180" />
      <el-table-column label="状态" width="60">
        <template slot-scope="scope">
          <el-tag :type="statueTypes[scope.row.status]">{{ statues[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
          >人员列表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
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

  </div>
</template>

<script>
import { pageQueryDept } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: 'DeptApply',
  components: { Treeselect },
  data() {
    return {
      searchForm: {},
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
    async getList() {
      this.loading = true
      const result = await pageQueryDept(this.queryParams)
      const { data, count } = result

      this.deptList = data
      this.total = count
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
