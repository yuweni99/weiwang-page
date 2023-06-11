<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item label="类型">
        <el-select v-model="queryParams.type" size="mini" placeholder="请选择类型">
          <el-option
            v-for="item in operationTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="时间">

        <el-date-picker
          v-model="dates"
          size="mini"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择时间"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
        <el-button type="primary" size="mini" @click="reset">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="userBills"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="tradeNo" label="交易单号" />
      <el-table-column prop="money" label="金额" />
      <el-table-column prop="serviceCharge" label="手续费" />
      <el-table-column prop="operationAmount" label="实际金额" />
      <el-table-column prop="currentBalance" label="账户金额" />
      <el-table-column prop="time" label="交易时间">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="类型">
        <template v-slot="scope">
          <span>{{ types[scope.row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付方式">
        <template v-slot="scope">
          <span>{{ payTypes[scope.row.payType] ? payTypes[scope.row.payType] : '其他方式支付' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="openBillDescPagellPage(scope.row)">账单详情</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="findUserBill"
    />

    <div class="statistics-container">
      <span>总充值金额：{{ statistics.totalTecharge > 0 ? statistics.totalTecharge : 0 }} 元 </span>
      <span>总提现金额：{{ statistics.totalCash > 0 ? statistics.totalCash : 0 }} 元 </span>
      <span>发起转帐总额：{{ statistics.totalTransfer > 0 ? statistics.totalTransfer : 0 }} 元 </span>
      <span>接收转帐总额：{{ statistics.totalAccount > 0 ? statistics.totalAccount : 0 }} 元 </span>
      <span>总发送红包：{{ statistics.sendPacket > 0 ? statistics.sendPacket : 0 }} 元 </span>
      <span>总接收红包：{{ statistics.receivePacket > 0 ? statistics.receivePacket : 0 }} 元</span>
    </div>

    <el-dialog
      v-if="billDescDialogVisible"
      title="账单详情"
      :visible.sync="billDescDialogVisible"
      width="80%"
      append-to-body
      :before-close="handleBillDescClose"
    >
      <el-table
        v-loading="billDescLoading"
        :data="billDescs"
        row-key="id"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column prop="id" label="提现记录Id" />
        <el-table-column prop="tradeNo" label="交易单号" />
        <el-table-column prop="userId" label="用户Id" />
        <el-table-column prop="userName" label="用户昵称" />
        <el-table-column prop="money" label="提现金额" />
        <el-table-column prop="serviceCharge" label="手续费" />
        <el-table-column prop="operationAmount" label="实际金额" />
        <el-table-column prop="currentBalance" label="账户余额" />
        <el-table-column prop="desc" label="备注" />
        <el-table-column label="支付方式">
          <template v-slot="scope">
            <span>{{ payTypes[scope.row.payType] ? payTypes[scope.row.payType] : '其他方式支付' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="交易状态">
          <template v-slot="scope">
            <span>{{ descStatus[scope.row.status] ? descType[scope.row.status] : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template v-slot="scope">
            <span>{{ descType[scope.row.type] ? descType[scope.row.type] : '其他方式充值' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="提现时间">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.time) }}</span>
          </template>
        </el-table-column>

      </el-table>

      <pagination
        v-show="descTotal>0"
        :total="descTotal"
        :page.sync="descQueryParams.page"
        :limit.sync="descQueryParams.limit"
        @pagination="findUserBillDesc"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBillDescClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findUserBill, findUserBillDesc } from '@/api/user'
import { parseTime } from '@/utils/index.js'

export default {
  name: 'UserBill',
  props: {
    userId: {
      require: true,
      type: Number
    }
  },
  data() {
    return {
      billDescs: [],
      billDescDialogVisible: false,
      descType: {
        '1': 'APP充值',
        '2': '后台充值',
        '3': '用户提现',
        '16': '后台手工提现'
      },
      descStatus: {
        '0': '创建',
        '1': '支付完成',
        '2': '交易完成',
        '-1': '交易关闭'
      },
      types: {
        '1': '用户充值',
        '2': '用户提现',
        '3': '后台充值',
        '4': '发送红包',
        '5': '领取红包',
        '6': '红包退款',
        '7': '转账',
        '8': '接受转账',
        '9': '转账退回',
        '10': '付款码付款',
        '11': '付款码收款',
        '12': '二维码收款 付款方',
        '13': '二维码收款 收款方',
        '16': '后台手工提现'
      },
      payTypes: {
        '1': '支付宝支付',
        '2': '微信支付',
        '3': '余额支付',
        '4': '系统支付'
      },
      operationTypes: [
        { label: '用户充值', value: '1' },
        { label: '用户提现', value: '2' },
        { label: '后台充值', value: '3' },
        { label: '发送红包', value: '4' },
        { label: '领取红包', value: '5' },
        { label: '红包退款', value: '6' },
        { label: '转出', value: '7' },
        { label: '转入', value: '8' },
        { label: '转账退回', value: '9' },
        { label: '付款码付款', value: '10' },
        { label: '付款码到账', value: '11' },
        { label: '二维码付款', value: '12' },
        { label: '二维码到账', value: '13' },
        { label: '手工提现', value: '14' }
      ],
      queryParams: {
        page: 1,
        limit: 15,
        time: new Date().getTime() / 1000,
        type: null
      },
      descQueryParams: {
        page: 1,
        limit: 10
      },
      userBills: [],
      loading: false,
      total: 0,
      statistics: {
        totalTecharge: 0,
        totalCash: 0,
        totalTransfer: 0,
        totalAccount: 0,
        sendPacket: 0,
        receivePacket: 0
      },
      dates: [],
      billDescLoading: false,
      descTotal: 0
    }
  },
  mounted() {
    this.findUserBill()
  },
  methods: {
    async findUserBillDesc(bill) {
      try {
        this.billDescLoading = true
        const data = { tradeNo: bill.tradeNo }
        const result = await findUserBillDesc(data)
        this.billDescs = result.data
        this.descTotal = result.count
      } finally {
        this.billDescLoading = false
      }
    },
    async openBillDescPagellPage(bill) {
      await this.findUserBillDesc(bill)
      this.billDescDialogVisible = true
    },
    handleBillDescClose() {
      this.billDescDialogVisible = false
    },
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
    reset() {
      this.queryParams = {
        page: 1,
        limit: 15
      }
      this.dates = []
      this.findUserBill()
    },
    search() {
      this.queryParams.page = 1
      this.findUserBill()
    },
    parseTime,
    async findUserBill() {
      this.loading = true
      try {
        this.queryParams.userId = this.userId
        const result = await findUserBill(this.queryParams)
        this.userBills = result.data
        this.total = result.count

        this.statistics = JSON.parse(result.totalVo)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.statistics-container {
  margin-top: 30px;

  span {
    font-size: 20px;
    margin-left: 30px;
  }
}
</style>
