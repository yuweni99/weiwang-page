<template>
  <div>
    <el-table
      v-loading="loading"
      :data="schoolInfos"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="logo" width="100">
        <template v-slot="scope">
          <el-image
            style="width: 100px;height: 100px"
            :src="scope.row.logoUrl"
            :preview-src-list="[scope.row.logoUrl]"
            fit="fit"
          />
        </template>
      </el-table-column>

      <el-table-column label="学校名称" prop="name" />
      <el-table-column label="建校时间" prop="shortName" />
      <el-table-column label="停办日期" prop="code" />
      <el-table-column label="省" prop="province" />
      <el-table-column label="市" prop="city" />

      <el-table-column label="操作" fixed="right" width="80">
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="openEditSchool(scope.row.id)"
          >修改
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
      v-if="dialogVisible"
      title="修改学校"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <EditSchoolInfo :id="id" :handle-close="handleClose" :desc-flag="descFlag" />
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>
import { pageList } from '@/api/schoolInfo'
import EditSchoolInfo from '@/views/schoolInfo/compoents/EditSchoolInfo.vue'

export default {
  name: 'SuspensionSchool',
  components: { EditSchoolInfo },
  data() {
    return {
      dialogVisible: false,
      total: 0,
      loading: false,
      schoolInfos: [],
      descFlag: false,
      id: null,
      queryParams: {
        page: 1,
        limit: 10,
        suspensionStatus: '1'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleClose(refreshFlag = false) {
      this.dialogVisible = false
      this.id = null
      this.descFlag = false
      if (refreshFlag) {
        this.getList()
      }
    },
    openEditSchool(id) {
      this.id = id
      this.dialogVisible = true
    },
    async getList() {
      try {
        this.loading = true

        const result = await pageList(this.queryParams)
        const { data, count } = result

        this.schoolInfos = data
        this.total = count
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
