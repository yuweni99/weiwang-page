<template>
  <div class="app-container">
    <el-table
      :key="id"
      v-loading="loading"
      :data="infos"
    >
      <el-table-column prop="type" label="参数说明" />
      <el-table-column prop="value" label="参数值" />
      <el-table-column prop="desc" label="参数描述" />

    </el-table>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import { parseTime } from '@/utils/index'

const infos = [
  { type: '用户唯一标识', varName: 'userKey', desc: '' },
  { type: '微网账号', varName: 'account', desc: '' },
  { type: '生日类别', varName: 'birthDateType', desc: '' },
  { type: '用户名', varName: 'username', desc: '' },
  { type: '用户id', varName: 'userId', desc: '' },
  { type: '消息免打扰', varName: 'username', desc: '1为开启 0为关闭' },
  { type: '昵称', varName: 'nickname', desc: '' },
  { type: '性别', varName: 'sex', desc: '0 女 1:男' },
  { type: '最后出现时间', varName: 'active', desc: '' },
  { type: '签名、说说、备注', varName: 'description', desc: '' },
  { type: '用户余额', varName: 'balance', desc: '' },
  { type: '未读消息数量', varName: 'msgNum', desc: '' },
  { type: '充值总金额', varName: 'totalRecharge', desc: '' },
  { type: '消费总金额', varName: 'totalConsume', desc: '' },
  { type: '好友数', varName: 'friendsCount', desc: '' },
  { type: '粉丝数', varName: 'fansCount', desc: '' },
  { type: '关注数', varName: 'attCount', desc: '' },
  { type: '注册时间', varName: 'createTime', desc: '', format: parseTime },
  { type: '更新时间', varName: 'modifyTime', desc: '', format: parseTime },
  { type: '朋友圈背景URL', varName: 'msgBackGroundUrl', desc: '' },
  { type: '状态', varName: 'status', desc: '1=正常, -1=禁用' },
  { type: '在线状态', varName: 'onlinestate', desc: '默认离线0 在线 1' },
  { type: '用户的地理位置', varName: 'area', desc: '默认离线0 在线 1' },
  { type: '锁定状态', varName: 'freezeStatus', desc: '0未锁定，1已锁定' },
  { type: '冻结时间', varName: 'freezeDate', desc: '默认离线0 在线 1' },
  { type: '在线状态', varName: 'onlinestate', desc: '默认离线0 在线 1' },
  { type: '认证状态', varName: 'authStatus', desc: '1认证，0未认证' },
  { type: '认证名称', varName: 'authName', desc: '' },
  { type: '认证身份证号码', varName: 'authIdCard', desc: '' },
  { type: '年龄', varName: 'age', desc: '' },
  { type: '籍贯', varName: 'origin', desc: '' },
  { type: '生日', varName: 'birthdayStr', desc: '' }
]
export default {
  name: 'UserInfo',
  props: {
    userId: Number
  },
  data() {
    return {
      infos: {},
      loading: false
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const result = await getInfo(this.userId)

      this.infos = infos.map((item, index) => ({
        ...item,
        value: item.format && typeof item.format === 'function' ? item.format(result.data[item.varName]) : result.data[item.varName],
        id: index
      }))
    }
  }
}
</script>

<style scoped lang="scss">

</style>
