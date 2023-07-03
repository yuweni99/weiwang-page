<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">

      <el-form-item label="学校名称">
        <el-input v-model="queryParams.name" size="mini" placeholder="请输入学校名称" clearable />
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">搜索</el-button>
        <el-button size="mini" type="info" @click="reset">重置</el-button>
        <el-button size="mini" type="primary" @click="openSchoolPage">添加学校</el-button>
      </el-form-item>

    </el-form>

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

      <el-table-column label="名字" prop="name" />
      <el-table-column label="绑定单位" prop="companyName" />
      <el-table-column label="绑定部门" prop="deptName" />
      <el-table-column label="简称" prop="shortName" />
      <el-table-column label="学校编码" prop="code" />
      <el-table-column label="排名" prop="ranking" />
      <el-table-column label="所在省" prop="province" />
      <el-table-column label="所在市区" prop="city" />

      <el-table-column label="操作" fixed="right" width="400">
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="getInfo(scope.row.id, false)"
          >修改
          </el-button>
          <el-button
            v-if="!scope.row.companyId"
            size="mini"
            @click="openBindCompanyDeptPage(scope.row, false)"
          >绑定单位
          </el-button>
          <el-button
            v-if="scope.row.companyId"
            size="mini"
            @click="openBindCompanyDeptPage(scope.row, true)"
          >修改绑定单位
          </el-button>
          <el-button
            size="mini"
            @click="getInfo(scope.row.id, true)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteSchoolInfo(scope.row)"
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

    <el-dialog
      :title="descFlag? '学校详情' : (schoolInfo.id ? '修改学校' : '新增学校')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form
        ref="schoolInfoForm"
        :disabled="descFlag"
        :rules="schoolInfoRules"
        :model="schoolInfo"
        label-width="80px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="学校名称" prop="name">
              <el-input v-model="schoolInfo.name" size="mini" placeholder="请输入学校名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="官网">
              <el-input
                v-model="schoolInfo.officialWebsite"
                size="mini"
                placeholder="请输入地址"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="logo地址" prop="logoUrl">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :data="{
                  'type': 'school-logo',
                  access_token: token,
                }"
                :on-success="handleLogoSuccess"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="schoolInfo.logoUrl" :src="schoolInfo.logoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>

            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="简单标签">
              <el-select
                v-model="selectTags"
                class="select-tag"
                multiple
                filterable
                size="mini"
                allow-create
                default-first-option
                placeholder="请选择标签"
              >
                <el-option
                  v-for="item in tags"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>

            </el-form-item>

          </el-col>

          <el-col :span="12">
            <el-form-item label="排名" prop="ranking">
              <el-input v-model="schoolInfo.ranking" type="number" size="mini" placeholder="请输入排名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校简称">
              <el-input v-model="schoolInfo.shortName" size="mini" placeholder="请输入学校简称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="英语名称">
              <el-input v-model="schoolInfo.englishName" size="mini" placeholder="请输入英语名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学校代码">
              <el-input v-model="schoolInfo.code" size="mini" placeholder="请输入学校代码" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="省份">
              <el-input v-model="schoolInfo.province" size="mini" placeholder="请输入省份" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="市">
              <el-input v-model="schoolInfo.city" size="mini" placeholder="请输入市" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建年份">
              <el-input v-model="schoolInfo.createYear" size="mini" placeholder="请输入创建年份市" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="自然类型">
              <el-input
                v-model="schoolInfo.naturalType"
                size="mini"
                placeholder="请输入自然类型"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学校类型">
              <el-input
                v-model="schoolInfo.type"
                size="mini"
                placeholder="请输入学校类型"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属机构">
              <el-input
                v-model="schoolInfo.affiliatedInstitution"
                size="mini"
                placeholder="请输入所属机构"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否私立">
              <el-select v-model="schoolInfo.privateStatus" placeholder="请选择是否私立">
                <el-option
                  v-for="item in statues"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="世界排名">
              <el-input
                v-model="schoolInfo.worldRankings"
                size="mini"
                placeholder="请输入简单标签"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="类别">
              <el-input
                v-model="schoolInfo.category"
                size="mini"
                placeholder="请输入类别"
                clearable
              />
            </el-form-item>

          </el-col>

          <el-col :span="12">
            <el-form-item label="地址">
              <el-input
                v-model="schoolInfo.address"
                size="mini"
                placeholder="请输入地址"
                clearable
              />
            </el-form-item>

          </el-col>

        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveSchoolInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="updateBindFlag ? '修改单位信息' : '绑定单位信息'"
      :visible.sync="bindCompanyDeptVisible"
      width="400px"
      :before-close="handleBindCompanyDeptClose"
    >
      <el-form
        ref="bindCompanyDeptForm"
        :rules="bindCompanyDeptRules"
        :model="companyDeptInfo"
        label-width="80px"
      >
        <el-form-item prop="companyId" label="单位">
          <el-select
            v-model="companyDeptInfo.companyId"
            filterable
            remote
            :remote-method="getCompanyList"
            placeholder="请输入单位名称进行搜索"
            @change="findCompanyFirstLevelDepts"
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="companyId" label="部门">
          <el-select
            v-model="companyDeptInfo.deptId"
            filterable
            :remote-method="getCompanyList"
            placeholder="请选择部门"
          >
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBindCompanyDeptClose">取 消</el-button>
        <el-button type="primary" @click="saveBindCompanyDept">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>

import {
  addSchoolInfo,
  bindCompanyDeptInfo,
  deleteSchoolInfo,
  getInfo,
  pageList,
  updateBindCompanyDeptInfo,
  updateSchoolInfo
} from '@/api/schoolInfo'
import { mapGetters } from 'vuex'
import { getCompanyList } from '@/api/company'
import { findCompanyFirstLevelDepts } from '@/api/dept'

export default {
  name: 'SchoolInfo',
  data() {
    return {
      descFlag: false,
      uploadUrl: `${process.env.VUE_APP_BASE_API}/upload`,
      inputVisible: false,
      inputValue: '',
      bindCompanyDeptVisible: false,
      companyList: [],
      // 修改绑定标识
      updateBindFlag: false,
      companyDeptInfo: {
        id: null,
        companyId: null,
        deptId: null,
        companyName: null,
        deptName: null
      },
      deptList: [],
      tags: [
        '985',
        '211',
        '双一流',
        '艺术',
        '全国重点',
        '世界一流大学',
        '中国顶尖大学',
        '中国知名大学',
        '世界知名高水平大学',
        '区域高水平大学',
        '独立学院',
        '民办大学',
        '一流大学建设A类',
        '一流大学建设B类',
        '一流学科建设'
      ],
      statues: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      dialogVisible: false,
      schoolInfos: [],
      schoolInfo: {},
      selectTags: [],
      loading: false,
      total: 0,
      queryParams: {
        page: 1,
        limit: 10,
        name: null
      },
      bindCompanyDeptRules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择单位', trigger: 'blur' }

        ]
      },
      schoolInfoRules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请上传图标', trigger: 'blur' }
        ], ranking: [
          { required: true, message: '请输入排名', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    saveBindCompanyDept() {
      this.$refs.bindCompanyDeptForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        const deptName = this.deptList.find(item => item.id === this.companyDeptInfo.deptId).name
        const companyName = this.companyList.find(item => item.id === this.companyDeptInfo.companyId).name

        this.companyDeptInfo.companyName = companyName
        this.companyDeptInfo.deptName = deptName

        this.updateBindFlag ? await updateBindCompanyDeptInfo(this.companyDeptInfo) : await bindCompanyDeptInfo(this.companyDeptInfo)
        this.$message.success('操作成功')
        this.handleBindCompanyDeptClose()
        await this.getList()
      })
    },
    async findCompanyFirstLevelDepts() {
      if (!this.companyDeptInfo.companyId) {
        this.deptList = []
        return false
      }

      const result = await findCompanyFirstLevelDepts({ companyId: this.companyDeptInfo.companyId })
      this.deptList = result.data
    },
    async getCompanyList(name) {
      if (!name) {
        return
      }

      const data = {
        name,
        status: '3,4'
      }
      const result = await getCompanyList(data)
      this.companyList = result.data
    },
    openBindCompanyDeptPage(data, updateBindFlag) {
      this.companyDeptInfo.id = data.id
      this.updateBindFlag = updateBindFlag

      if (data.companyId) {
        this.companyList.push({ id: data.companyId, name: data.companyName })
        this.companyDeptInfo.deptId = data.deptId
        this.companyDeptInfo.companyId = data.companyId
        this.findCompanyFirstLevelDepts()
      }

      this.bindCompanyDeptVisible = true
    },
    handleBindCompanyDeptClose() {
      this.bindCompanyDeptVisible = false
      this.companyDeptInfo = {}
      this.companyList = []
      this.deptList = []
    },
    openSchoolPage() {
      this.schoolInfo = {}
      this.dialogVisible = true
    },
    async deleteSchoolInfo(data) {
      await this.$confirm(`确认删除'${data.name}'学校吗?`, '警告')
      await deleteSchoolInfo(data.id)
      this.$message.success('操作成功')
      this.getList()
    },
    saveSchoolInfo() {
      this.$refs.schoolInfoForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        this.schoolInfo.tag = this.selectTags.join(',')
        !this.schoolInfo.id ? await addSchoolInfo(this.schoolInfo) : await updateSchoolInfo(this.schoolInfo)
        this.$message.success('操作成功')
        this.handleClose()
        await this.getList()
      })
    },
    handleLogoSuccess(res) {
      const { errno, data } = res

      if (errno === 1) {
        this.$message.error('上传失败')
        return
      }
      this.$set(this.schoolInfo, 'logoUrl', data.url)
    },
    beforeLogoUpload(file) {
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

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleClose() {
      this.dialogVisible = false
      this.schoolInfo = {}
    },
    search() {
      this.queryParams.page = 1
      this.getList()
    },
    reset() {
      this.queryParams = {
        page: 1,
        limit: 10,
        name: null
      }

      this.getList()
    },
    async getInfo(id, descFlag) {
      const result = await getInfo(id)
      this.schoolInfo = result.data

      if (this.schoolInfo.tag) {
        this.selectTags = this.schoolInfo.tag.replaceAll(' ', ',').split(',').filter(item => item) || []
      }

      this.descFlag = descFlag
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
.select-tag {
  display: block;
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
