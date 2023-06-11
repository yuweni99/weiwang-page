<template>
  <div class="app-container">
    <el-form ref="form" :model="setting" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="允许关注">
            <el-select v-model="setting.allowAtt" placeholder="请选择是否允许关注">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否开启振动">
            <el-select v-model="setting.isVibration" placeholder="请选择是否开启振动">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="让对方知道正在输入">
            <el-select v-model="setting.isTyping" placeholder="请选择让对方知道正在输入">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="使用Google地图">
            <el-select v-model="setting.isUseGoogleMap" placeholder="请选择是否使用使用Google地图">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="允许打招呼">
            <el-select v-model="setting.allowGreet" placeholder="请选择是否使用允许打招呼">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="加好友需要验证">
            <el-select v-model="setting.friendsVerify" placeholder="请选择是否加好友需要验证">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否开启客服模式">
            <el-select v-model="setting.openService" placeholder="请选择是否开启客服模式">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="6">
          <el-form-item label="手机号搜索用户">
            <el-select v-model="setting.closeTelephoneFind" placeholder="请选择是否开启手机号搜索用户">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="聊天记录销毁时长">
            <el-select v-model="setting.chatRecordTimeOut" placeholder="请选择聊天记录销毁时长">
              <el-option
                v-for="item in chatRecordTimeOutTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="漫游时长">
            <el-select v-model="setting.openService" placeholder="请选择漫游时长">
              <el-option
                v-for="item in openServiceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否加密">
            <el-select v-model="setting.isEncrypt" placeholder="请选择是否加密">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="6">
          <el-form-item label="支持多点登录">
            <el-select v-model="setting.multipleDevices" placeholder="请选择是否开启支持多点登录">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="安卓保活">
            <el-select v-model="setting.isKeepalive" placeholder="请选择是否开启安卓保活">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="6">
          <el-form-item label="是否允许手机号搜索">
            <el-select v-model="setting.phoneSearch" placeholder="请选择是否允许手机号搜索">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否允许昵称号搜索">
            <el-select v-model="setting.nameSearch" placeholder="请选择是否允许昵称号搜索">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="显示上次上线时间">
            <el-select v-model="setting.showLastLoginTime" placeholder="请选择显示上次上线时间">
              <el-option
                v-for="item in showLastLoginTimeTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="显示我的手机号码">
            <el-select v-model="setting.showTelephone" placeholder="请选择显示我的手机号码">
              <el-option
                v-for="item in showTelephoneTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="6">
          <el-form-item label="通过什么方式添加我">
            <el-select v-model="friendFrom" multiple placeholder="请选择通过什么方式添加我">
              <el-option
                v-for="item in friendFromList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="授权开关">
            <el-select v-model="setting.authSwitch" placeholder="请选择授权开关">
              <el-option
                v-for="item in authSwitchTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="操作">
        <el-button type="primary" @click="setUserSetting">保存</el-button>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getUserSetting, setUserSetting } from '@/api/user'

export default {
  name: 'UserSetting',

  data() {
    return {
      friendFrom: [],
      setting: {
        allowAtt: null,
        friendFromList: null
      },
      authSwitchTypes: [
        { label: '需要授权', value: 0 },
        { label: '不需要授权', value: 1 }
      ],
      friendFromList: [
        { label: '系统添加好友', value: '0' },
        { label: '二维码', value: '1' },
        { label: '名片', value: '2' },
        { label: '群组', value: '3' },
        { label: '手机号搜索', value: '4' },
        { label: '昵称搜索', value: '5' }
      ],
      types: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      chatRecordTimeOutTypes: [
        { label: '永久', value: '-1' },
        { label: '一小时', value: '0.04' },
        { label: '1天', value: '1' },
        { label: '一周', value: '7' }
      ],
      openServiceTypes: [
        { label: '不漫游', value: -2 },
        { label: '永久', value: -1 },
        { label: '一小时', value: 0.04 },
        { label: '1天', value: 1 },
        { label: '一周', value: 7 }
      ],
      showLastLoginTimeTypes: [
        { label: '所有人不显示', value: -1 },
        { label: '所有人显示', value: 1 },
        { label: '所有好友显示', value: 2 },
        { label: '手机联系人显示', value: 3 }
      ],
      showTelephoneTypes: [
        { label: '所有人不显示', value: -1 },
        { label: '所有人显示', value: 1 },
        { label: '所有好友显示', value: 2 },
        { label: '手机联系人显示', value: 3 }
      ]
    }
  },
  mounted() {
    this.getUserSetting()
  },
  methods: {
    async getUserSetting() {
      const result = await getUserSetting(this.$route.query.userId)
      this.setting = result.data

      if (this.setting.friendFromList) {
        const friendFrom = this.setting.friendFromList.split(',')
        console.log(friendFrom)
        this.friendFrom = friendFrom
      }
    },
    async setUserSetting() {
      await this.$confirm(`确认保存设置吗`, '警告')

      this.setting.friendFromList = this.friendFrom.join(',')
      this.setting.userId = this.$route.query.userId

      await setUserSetting(this.setting)
      this.$message.success('保存成功')
      await this.getUserSetting()
    }

  }
}

</script>

<style scoped lang="scss">
.el-form {
  margin-top: 30px;
}
</style>
