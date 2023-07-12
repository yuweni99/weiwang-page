<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">

      <el-form-item label="学校名称">
        <el-input v-model="queryParams.name" size="mini" placeholder="请输入学校名称" clearable />
      </el-form-item>

      <el-form-item label="标签">
        <el-select
          v-model="queryParams.tag"
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

      <el-form-item label="地区">
        <el-select
          v-model="queryParams.province"
          filterable
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择标签"
        >
          <el-option
            v-for="item in provinces"
            :key="item.ProID"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="创建年份">
        <el-input v-model="queryParams.createYear" clearable type="number" size="mini" placeholder="请输入创建年份" />
      </el-form-item>

      <el-form-item label="自然类型">
        <el-select
          v-model="queryParams.naturalType"
          clearable
          filterable
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择自然类型"
        >
          <el-option
            v-for="item in naturalTypes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="学校类型">
        <el-select
          v-model="queryParams.schoolType"
          clearable
          filterable
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择自然类型"
        >
          <el-option
            v-for="item in schoolTypes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="类别">
        <el-select
          v-model="queryParams.category"
          filterable
          clearable
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择类别"
        >
          <el-option
            v-for="item in categories"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否开启">
        <el-select
          v-model="queryParams.status"
          filterable
          clearable
          size="mini"
          allow-create
          default-first-option
          placeholder="请选择开启状态"
        >
          <el-option
            v-for="item in statues"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">搜索</el-button>
        <el-button size="mini" type="info" @click="reset">重置</el-button>
        <el-button size="mini" type="primary" @click="openSchoolPage()">添加学校</el-button>
        <el-button size="mini" type="primary" @click="openSuspensionSchoolPage()">停办学校</el-button>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="loading"
      :data="schoolInfos"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="是否认证">
        <template v-slot="scope">
          {{ scope.row.companyId ? '是' : '否' }}
        </template>
      </el-table-column>
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

      <el-table-column label="名字" prop="name">
        <template v-slot="scope">
          <span @click="openUpdateHistoryName(scope.row.id)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启状态" width="100px">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.status"
            style="display: block"
            active-color="#13ce66"
            active-value="1"
            inactive-value="0"
            inactive-color="#ff4949"
            @change="(e) => updateStatus(scope.row.id,e)"
          />
        </template>
      </el-table-column>
      <el-table-column label="简称" prop="shortName" />
      <el-table-column label="学校编码" prop="code" />
      <el-table-column label="排名" prop="ranking" />
      <el-table-column label="所在省" prop="province" />
      <el-table-column label="所在市区" prop="city" />

      <el-table-column label="操作" fixed="right" width="450">
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="openSchoolPage(scope.row.id, false)"
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
            @click="openSchoolPage(scope.row.id, true)"
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
      v-if="dialogVisible"
      :title="descFlag? '学校详情' : (schoolInfo.id ? '修改学校' : '新增学校')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <EditSchoolInfo :id="id" :handle-close="handleClose" :desc-flag="descFlag" />
      <span slot="footer" class="dialog-footer" />
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

    <el-dialog
      v-if="updateHistoryNameVisible"
      title="修改历史名称"
      :close-on-click-modal="false"
      :visible.sync="updateHistoryNameVisible"
      width="50%"
    >
      <school-history-name :id="id" :update-history-name-visible.sync="updateHistoryNameVisible" />
    </el-dialog>

    <el-dialog
      v-if="suspensionSchoolVisible"
      title="停办学校"
      :close-on-click-modal="false"
      :visible.sync="suspensionSchoolVisible"
    >
      <SuspensionSchool />
      <span slot="footer" class="dialog-footer">
        <el-button @click="suspensionSchoolVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  bindCompanyDeptInfo,
  deleteSchoolInfo,
  pageList,
  updateBindCompanyDeptInfo,
  updateStatus
} from '@/api/schoolInfo'
import { getCompanyList } from '@/api/company'
import { findCompanyFirstLevelDepts } from '@/api/dept'

import SchoolHistoryName from '@/views/schoolInfo/compoents/SchoolHistoryName.vue'
import EditSchoolInfo from '@/views/schoolInfo/compoents/EditSchoolInfo.vue'
import SuspensionSchool from '@/views/schoolInfo/compoents/SuspensionSchool.vue'

import provinces from '@/assets/provinces.json'

export default {
  name: 'SchoolInfo',
  components: {
    SchoolHistoryName,
    EditSchoolInfo,
    SuspensionSchool
  },
  data() {
    return {
      naturalTypes: [
        '成人高等学院独立学院高等学校分校',
        '大学',
        '高等职业技术学校',
        '高等职业技术学院',
        '高等专科学校',
        '高等专科学校 高等职业技术学院',
        '管理干部学院',
        '教育学院',
        '全日制公办普通高等职业院校',
        '学院'
      ],
      categories: ['本科', '专科'],
      schoolTypes: [
        '财经',
        '军事',
        '理工',
        '民族',
        '农林',
        '师范',
        '体育',
        '医药',
        '艺术',
        '语言',
        '政法',
        '综合',
        '其他'
      ],
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
      id: null,
      updateHistoryNameVisible: false,
      provinces,
      descFlag: false,
      suspensionSchoolVisible: false,
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
      statues: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      dialogVisible: false,
      schoolInfos: [],
      schoolInfo: {
        schoolMotto: null,
        naturalType: null,
        educationNature: null,
        unifiedCreditCode: null,
        address: null
      },
      loading: false,
      total: 0,
      queryParams: {
        schoolType: null,
        province: null,
        createYear: null,
        tag: null,
        page: 1,
        limit: 10,
        name: null,
        suspensionStatus: '0'
      },
      bindCompanyDeptRules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },

  methods: {
    openSuspensionSchoolPage() {
      this.suspensionSchoolVisible = true
    },
    openUpdateHistoryName(id) {
      this.id = id
      this.updateHistoryNameVisible = true
    },
    async updateStatus(id, status) {
      // await this.$confirm(`您确定${status === '1' ? '开启' : '关闭'} 学校数据吗`)
      await updateStatus({ id, status })
      this.$message.success('操作成功')
      this.getList()
    },
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
    openSchoolPage(id = null, flag = false) {
      if (id) {
        this.id = id
        this.descFlag = flag
      }

      this.dialogVisible = true
    },
    async deleteSchoolInfo(data) {
      await this.$confirm(`确认删除'${data.name}'学校吗?`, '警告')
      await deleteSchoolInfo(data.id)
      this.$message.success('操作成功')
      this.getList()
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleClose(refreshFlag = false) {
      this.dialogVisible = false
      this.id = null
      this.descFlag = false
      if (refreshFlag) {
        this.getList()
      }
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

<style scoped lang="scss"></style>
