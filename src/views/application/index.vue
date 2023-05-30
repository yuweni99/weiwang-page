<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item>
        <el-form-item label="应用名字">
          <el-input v-model="queryParams.name" size="mini" placeholder="请输入应用名称" clearable />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="queryParams.classifyId" size="mini" placeholder="请选择应用分类">
            <el-option
              v-for="item in classifies"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="试用状态">
          <el-select v-model="queryParams.trialStatus" size="mini" placeholder="请选择试用状态">
            <el-option
              v-for="item in trialStatues"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="getList">搜索</el-button>
          <el-button size="mini" type="info" @click="reset">重置</el-button>
          <el-button size="mini" type="primary" @click="openEditApplicationDialog">添加</el-button>

        </el-form-item>

      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="applications"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="图标">
        <template v-slot="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.iconUrl"
            :preview-src-list="[scope.row.iconUrl]"
            fit="fit"
          />
        </template>
      </el-table-column>
      <el-table-column prop="classifyName" label="分类" />
      <el-table-column prop="name" label="应用名称" />
      <el-table-column prop="code" label="应用编码" />
      <el-table-column prop="backgroundAddress" label="管理后台">
        <template v-slot="scope">
          <span
            v-if="scope.row.backgroundAddress"
            :style="scope.row.backgroundAddress ? 'color: blue': ''"
            @click="goToManagerBackstage(scope.row)"
          >点击跳转</span>
        </template>
      </el-table-column>

      <el-table-column prop="trialStatus" label="试用状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.trialStatus === '0' ? 'success':'info'">{{
            scope.row.trialStatus === '0' ? '未开启' : '已开启'
          }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="trialDays" label="试用天数" />

      <el-table-column prop="code" label="使用单位">
        <template v-slot="scope">
          <span
            :style="scope.row.number ? 'color: blue': ''"
            @click="goToDeptApplicationPage(scope.row)"
          >{{ scope.row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createDateStr" label="创建日期" />

      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            @click="openEditApplicationDialog(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="deleteApplication(scope.row)"
          >删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="applicationForm.id ? '编辑应用' : '添加应用'"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="handleApplicationClose"
    >
      <el-form ref="applicationForm" :rules="applicationFormRules" :model="applicationForm" label-width="80px">
        <el-form-item label="应用名字" prop="name">
          <el-input
            v-model="applicationForm.name"
            clearable
            placeholder="请输入应用名字"
          />
        </el-form-item>

        <el-form-item label="管理后台" prop="backgroundAddress">
          <el-input
            v-model="applicationForm.backgroundAddress"
            clearable
            placeholder="请输入管理后台地址(https:://www.baidu.com)"
          />
        </el-form-item>

        <el-form-item label="图标" prop="iconUrl">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :data="{
              'type': 'application-icon',
              access_token: token,
            }"
            :on-success="handleIconSuccess"
            :before-upload="beforeIconUpload"
          >
            <img v-if="applicationForm.iconUrl" :src="applicationForm.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="编码" prop="code">
          <el-select v-model="applicationForm.code" :disabled="applicationForm.id" placeholder="请选择编码">
            <el-option
              v-for="item in codes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="applicationForm.sort" type="number" placeholder="请输入排序" />
        </el-form-item>

        <el-form-item label="分类" prop="classifyId">
          <el-select v-model="applicationForm.classifyId" placeholder="请选择分类">
            <el-option
              v-for="item in classifies"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="关注公众号" prop="followOfficialAccountStatus">
          <el-switch
            v-model="applicationForm.followOfficialAccountStatus"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <el-form-item label="试用状态" prop="trialStatus">
          <el-switch
            v-model="applicationForm.trialStatus"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>

        <el-form-item label="试用天数" prop="trialDays">
          <el-input v-model="applicationForm.trialDays" type="number" placeholder="请输入试用天数" />
        </el-form-item>

        <el-form-item label="计费周期" prop="feeType">
          <el-select v-model="applicationForm.feeType" placeholder="请选择计费周期">
            <el-option
              v-for="item in feeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="服务费" prop="money">
          <el-input v-model.number="applicationForm.money" type="number" />
        </el-form-item>

        <el-form-item label="简介" prop="briefIntroduction">
          <el-input v-model="applicationForm.briefIntroduction" type="textarea" placeholder="请输入简介" />
        </el-form-item>

        <el-form-item label="大简介" prop="bigBriefIntroduction">
          <el-input v-model="applicationForm.bigBriefIntroduction" type="textarea" placeholder="请输入大简介" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApplicationClose">取 消</el-button>
        <el-button type="primary" @click="saveApplication">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addApplication, deleteApplication, list, updateApplication } from '@/api/application/application'
import { list as listClassify } from '@/api/application/classify'
import { mapGetters } from 'vuex'

export default {
  name: 'Application',
  data() {
    return {
      codes: [
        { label: '校友卡', value: 'alumniCard' }
      ],
      feeTypes: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' }
      ],
      trialStatues: [
        { label: '未开启', value: '0' },
        { label: '开启', value: '1' }
      ],
      classifies: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}/upload`,
      dialogVisible: false,
      loading: false,
      applicationForm: {
        id: null,
        name: null,
        code: null,
        classifyId: null,
        classifyName: null,
        trialStatus: null,
        trialDays: null,
        briefIntroduction: null,
        bigBriefIntroduction: null,
        iconUrl: null,
        backgroundAddress: null,
        feeType: null,
        feeTypeName: null,
        money: null,
        sort: null,
        followOfficialAccountStatus: null
      },
      applications: [],
      queryParams: {
        name: null,
        classifyId: this.$route.query.classifyId,
        trialStatus: null
      },
      applicationFormRules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        iconUrl: [
          { required: true, message: '请选择图标', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择编码', trigger: 'blur' }
        ],
        classifyId: [
          { required: true, message: '请输入分类', trigger: 'blur' }
        ],
        trialStatus: [
          { required: true, message: '请选择使用状态', trigger: 'blur' }
        ],
        followOfficialAccountStatus: [
          { required: true, message: '请选择关注状态', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        trialDays: [
          { validator: this.validateTrialDays, trigger: 'blur' }
        ],
        backgroundAddress: [
          { validator: this.validateBackgroundAddress, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    this.getList()
    this.getListClassify()
  },
  methods: {
    goToDeptApplicationPage(data) {
      if (!data.number) {
        return
      }

      this.$router.push({
        path: '/application/deptApplication',
        query: {
          applicationId: data.id
        }
      })
    },
    goToManagerBackstage(data) {
      if (!data.backgroundAddress) {
        return
      }
      window.open(data.backgroundAddress)
    },
    async getListClassify() {
      const result = await listClassify({})
      this.classifies = result.data
    },
    validateTrialDays(rule, value, callback) {
      if (this.applicationForm.trialStatus === '1' && !value) {
        callback(new Error('请输入试用天数'))
        return false
      }
      callback()
    },

    validateBackgroundAddress(rule, value, callback) {
      if (value) {
        const pattern = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/

        if (!pattern.test(value)) {
          callback(new Error('地址不合法'))
          return false
        }
      }

      callback()
    },
    openEditApplicationDialog(data = {}) {
      this.applicationForm = { ...data }
      this.dialogVisible = true
    },
    handleIconSuccess(res) {
      const { errno, data } = res

      if (errno === 1) {
        this.$message.error('上传失败')
        return
      }
      this.$set(this.applicationForm, 'iconUrl', data.url)
    },
    beforeIconUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    saveApplication() {
      this.$refs.applicationForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        this.applicationForm.classifyName = this.classifies.find(item => item.id === this.applicationForm.classifyId).name

        if (this.applicationForm.feeType) {
          this.applicationForm.feeTypeName = this.feeTypes.find(item => item.value === this.applicationForm.feeType).label
        }

        !this.applicationForm.id ? await addApplication(this.applicationForm) : await updateApplication(this.applicationForm)
        this.$message.success('操作成功')
        this.handleApplicationClose()
        await this.getList()
      })
    },
    handleApplicationClose() {
      this.dialogVisible = false
      this.applicationForm = {}
    },

    reset() {
      this.queryParams = {
        name: null,
        classifyId: null
      }
      this.getList()
    },
    async getList() {
      try {
        this.loading = true

        const result = await list(this.queryParams)
        const { data } = result

        this.applications = data
      } finally {
        this.loading = false
      }
    },
    async deleteApplication(data) {
      await this.$confirm(`确认删除'${data.name}'应用吗?`, '警告')
      await deleteApplication(data.id)
      this.$message.success('操作成功')
      await this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
