<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="queryParams">
      <el-form-item>
        <el-form-item label="应用名字">
          <el-input v-model="queryParams.name" size="mini" placeholder="请输入应用名称" clearable />
        </el-form-item>

        <el-button size="mini" type="primary" @click="getList">搜索</el-button>
        <el-button size="mini" type="info" @click="reset">重置</el-button>
        <el-button size="mini" type="primary" @click="openEditClassifyDialog">添加</el-button>

      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="classifies"
      row-key="id"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="应用名称" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            @click="openEditClassifyDialog(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="deleteClassify(scope.row)"
          >删除
          </el-button>

        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="classifyForm.id ? '编辑应用分类' : '添加应用分类'"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      :before-close="handleClassifyClose"
    >
      <el-form ref="classifyForm" :rules="classifyFormRules" :model="classifyForm" label-width="80px">
        <el-form-item label="分类名字" prop="name">
          <el-input
            v-model="classifyForm.name"
            clearable
            placeholder="请输入分类名字"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="classifyForm.sort"
            clearable
            type="number"
            placeholder="请输入排序"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClassifyClose">取 消</el-button>
        <el-button type="primary" @click="saveClassify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addClassify, deleteClassify, pageList, updateClassify } from '@/api/application/classify'

export default {
  name: 'Classify',
  data() {
    return {
      codes: [
        { label: '校友卡', value: 'alumniCard' }
      ],
      classifies: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}/upload`,
      dialogVisible: false,
      loading: false,
      classifyForm: {
        id: null,
        name: null,
        sort: null
      },
      applications: [],
      queryParams: {
        name: null,
        page: 1,
        limit: 10
      },
      classifyFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    openEditClassifyDialog(data = {}) {
      this.classifyForm = { ...data }
      this.dialogVisible = true
    },
    saveClassify() {
      this.$refs.classifyForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        !this.classifyForm.id ? await addClassify(this.classifyForm) : await updateClassify(this.classifyForm)
        this.$message.success('操作成功')
        this.handleClassifyClose()
        await this.getList()
      })
    },
    handleClassifyClose() {
      this.dialogVisible = false
      this.classifyForm = {}
    },

    reset() {
      this.queryParams = {
        name: null,
        page: 1,
        limit: 10
      }
      this.getList()
    },
    async getList() {
      try {
        this.loading = true

        const result = await pageList(this.queryParams)
        const { data } = result

        this.classifies = data
      } finally {
        this.loading = false
      }
    },
    async deleteClassify(data) {
      await this.$confirm(`确认删除'${data.name}'分类吗?`, '警告')
      await deleteClassify(data.id)
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
