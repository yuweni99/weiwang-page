<template>
  <div class="app-container">
    <div>
      <el-button type="primary" size="mini" @click="getList">刷新</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="messages"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="消息时间" prop="createDateStr" />
      <el-table-column label="单位名称" prop="companyName" />
      <el-table-column label="部门名称" prop="deptName" />
      <el-table-column label="有效期" prop="days" />
      <el-table-column label="开始日期" prop="startDateStr" />
      <el-table-column label="截止日期" prop="endDateStr" />
      <el-table-column label="负责人" prop="username" />
      <el-table-column label="联系电话" prop="mobile" />
      <el-table-column label="详情" prop="content" />
      <el-table-column label="操作" fixed="right" width="400">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.readStatus !== '1'"
            size="mini"
            @click="markRead(scope.row.id)"
          >已读
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

import { markRead, pageList } from '@/api/messageNotification/messageNotification'

export default {
  name: 'MessageNotification',
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 10
      },
      messages: [],
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true

        const result = await pageList(this.queryParams)
        const { data, count } = result

        this.messages = data
        this.total = count
      } finally {
        this.loading = false
      }
    },
    async markRead(id) {
      await markRead(id)
      this.$message.success('操作成功')
      this.getList()
    }
  }
}
</script>
<style scoped lang="scss">

</style>
