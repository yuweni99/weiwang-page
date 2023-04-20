<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="defaultDeptFlag"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
    >
      <el-table-column prop="id" label="id" width="260" />
      <el-table-column prop="type" label="是否官方" width="60">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.type === '1'" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="部门名称" width="100" />
      <el-table-column prop="officialAccountName" label="绑定公众号" width="100" />
      <el-table-column prop="managerUserName" label="管理员" width="100" />
      <el-table-column prop="managerUserId" label="管理员账号" width="100" />
      <el-table-column prop="managerUserMobile" label="管理员手机号" width="120" />
      <el-table-column prop="num" label="部门人数" width="80" />
      <el-table-column label="创建时间" align="center" prop="createTimeStr" width="140" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="defaultDeptFlag"
            size="mini"
            type="text"
            icon="el-icon-user"
          >人员列表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="defaultDeptFlag"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            v-if="!scope.row.children && scope.row.type !== '1'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="630px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col v-if="form.parentId !== '0'" :span="24">
            <el-form-item label="上级部门">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理员姓名" prop="managerUserName">
              <el-input v-model="form.managerUserName" disabled placeholder="管理员姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理员手机号" prop="managerUserMobile">
              <el-input
                v-model="form.managerUserMobile"
                maxlength="11"
                placeholder="请输入管理员手机号"
                @change="findInfoByMobile"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { findInfoByMobile } from '@/api/user'
import { addDept, delDept, findCompanyUserDeptTree, findInfo, updateDept } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Dept',
  components: { Treeselect },
  data() {
    return {
      userInfo: null,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      defaultDeptFlag: false,
      deptInfo: {},
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        managerUserName: [
          { required: true, message: '管理员姓名不能为空', trigger: 'blur' }
        ],
        managerUserMobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.findDeptInfo()
    this.getList()
  },
  computed: {
    ...mapGetters([
      'deptId'
    ])
  },
  methods: {
    async findDeptInfo() {
      const result = await findInfo(this.deptId)
      this.deptInfo = result.data

      this.defaultDeptFlag = this.deptInfo.type === '1'
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true
      findCompanyUserDeptTree({ deptId: this.deptId }).then(response => {
        const list = response.data
        list.sort((a, b) => a.createTime - b.createTime < 0 ? 1 : -1)
        this.deptList = list
        this.deptOptions = response.data
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }

      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: '0'
      }
      this.$refs.form && this.$refs.form.resetFields()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row !== undefined) {
        this.form.parentId = row.id
        this.form.level = row.level + 1
      } else {
        this.form.level = 1
        this.form.parentId = '0'
      }
      this.open = true
      this.title = '添加部门'
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.form.level = row.level + 1
      delete this.form.children
      this.open = true
      this.title = '修改部门'
      if (!this.deptOptions.length) {
        const noResultsOptions = { id: this.form.parentId, name: this.form.parentName, children: [] }
        this.deptOptions.push(noResultsOptions)
      }
    },
    async findInfoByMobile() {
      const pattern = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/

      this.$set(this.form, 'managerUserName', '')
      if (!pattern.test(this.form.managerUserMobile)) {
        return
      }

      const result = await findInfoByMobile({ mobile: this.form.managerUserMobile })
      this.userInfo = result.data

      if (this.userInfo == null) {
        return
      }

      if (this.userInfo.authStatus !== '1') {
        return
      }
      this.form.managerUserId = this.userInfo.userId
      this.$set(this.form, 'managerUserName', this.userInfo.authName)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            ...this.form,
            companyName: this.deptInfo.companyName,
            companyId: this.deptInfo.companyId
          }

          if (this.form.id) {
            updateDept(data).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDept(data).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(function() {
        return delDept(row.id)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      }).catch(() => {
      })
    }
  }
}
</script>
