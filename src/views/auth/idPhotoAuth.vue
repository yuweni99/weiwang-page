<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item label="姓名">
        <el-input v-model="queryParams.name" size="mini" clearable placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="身份证号">
        <el-input v-model="queryParams.number" size="mini" clearable placeholder="请输入身份证" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="queryParams.mobile" size="mini" clearable placeholder="请输入身份证" />
      </el-form-item>

      <el-form-item label="审核状态">
        <el-select v-model="queryParams.status" size="mini" placeholder="请选择状态">
          <el-option
            v-for="item in statues"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="审核人">
        <el-input v-model="queryParams.auditUserName" size="mini" clearable placeholder="请输入审核人" />
      </el-form-item>

      <el-form-item label="申请时间">
        <el-date-picker
          v-model="createDates"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择审核时间"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleCreateDateChange"
        />
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">搜索</el-button>
        <el-button size="mini" type="danger" @click="reset">清空</el-button>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="loading"
      :data="auths"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="照片">
        <template v-slot="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.photo"
            :preview-src-list="[scope.row.photo]"
            fit="fit"
          />
        </template>
      </el-table-column>

      <el-table-column label="身份证照片">
        <template v-slot="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.idCardPhotoBehind"
            :preview-src-list="[scope.row.idCardPhotoBehind]"
            fit="fit"
          />
        </template>
      </el-table-column>

      <el-table-column label="来源">
        <template v-slot="scope">
          <span>{{ sourceType[scope.row.sourceType] }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="number" label="身份证" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="sex" label="性别">
        <template v-slot="scope">
          <span>{{ scope.row.sex === 0 ? '女' : '男' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="createDateStr" label="申请时间" />
      <el-table-column prop="auditDateStr" label="审核时间" />

      <el-table-column prop="sex" label="审核状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status !== '1'" :type="statusTypes[scope.row.status]">
            {{ statues[scope.row.status] ? statues[scope.row.status].label : null }}
          </el-tag>
          <el-popover
            v-else
            placement="top-start"
            title="驳回原因"
            width="200"
            trigger="hover"
            :content="scope.row.remark"
          >
            <el-tag slot="reference" type="info">
              驳回
            </el-tag>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="auditUserName" label="审核人" />

      <el-table-column prop="createDateStr" label="创建时间" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.status === '0'"
            size="mini"
            type="text"
            @click="updateStatus(scope.row, '2')"
          >通过
          </el-button>
          <el-button
            v-if="scope.row.status === '0'"
            size="mini"
            type="text"
            @click="openAuditPage(scope.row, '1')"
          >驳回
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
      title="驳回认证"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="handleAuditClose"
    >
      <el-input v-model.trim="remark" placeholder="请输入驳回原因" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAuditClose">取 消</el-button>
        <el-button type="primary" @click="updateStatus(auth, status)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { audit, pageList } from '@/api/auth/userSeniorAuth'

export default {
  name: 'IdPhotoAuth',
  data() {
    return {
      auth: null,
      remark: null,
      dialogVisible: false,
      status: null,
      total: 0,
      loading: false,
      auths: [],
      sourceType: {
        alumniCard: '校友卡'
      },
      statues: [
        { label: '审核中', value: '0' },
        { label: '驳回', value: '1' },
        { label: '成功', value: '2' }
      ],
      statusTypes: ['success', 'info', 'warning'],
      createDates: [],
      queryParams: {
        page: 1,
        limit: 10,
        name: null,
        mobile: null,
        number: null,
        status: null,
        auditUserName: null,
        createStartDateStr: null,
        createEndDateStr: null
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    reset() {
      this.queryParams = {
        page: 1,
        limit: 10,
        name: null,
        mobile: null,
        number: null,
        status: null,
        auditUserName: null,
        createStartDateStr: null,
        createEndDateStr: null
      }
    },

    search() {
      this.queryParams.page = 1
      this.getList()
    },
    handleCreateDateChange() {
      const [startDate, endDate] = this.createDates
      this.queryParams.createStartDateStr = startDate
      this.queryParams.createEndDateStr = endDate
    },
    async updateStatus(data, status) {
      await this.$confirm(`确认${status === '1' ? '驳回' : '通过'}'${data.name}'认证吗?`, '警告')
      await audit({ id: data.id, status, remark: this.remark })
      this.$message.success('操作成功')
      await this.getList()
      this.handleAuditClose()
    },
    handleAuditClose() {
      this.remark = null
      this.dialogVisible = false
    },
    openAuditPage(data, status) {
      this.auth = { ...data }
      this.status = status
      this.dialogVisible = true
    },
    async getList() {
      try {
        this.loading = true

        const result = await pageList(this.queryParams)
        const { data, count } = result

        this.auths = data
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
