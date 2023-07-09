<template>
  <div>
    <el-form ref="form" :model="schoolInfo" :rules="schoolInfoRules" label-width="80px">
      <el-form-item v-for="(item,index) in schoolInfo.historyNames" :key="index" prop="historyName" label="学校名称">
        <el-input v-model="item.name" placeholder="请输入学校名称" />
        <el-input v-model="item.renamingDate" type="number" placeholder="更名时间" />

        <span class="el-icon-plus add-history" @click="schoolInfo.historyNames.push({})" />
        <span v-if="index !== 0" class="el-icon-minus" @click="schoolInfo.historyNames.splice(index, 1)" />
      </el-form-item>

      <el-form-item>
        <el-button type="danger" @click="close">取消</el-button>
        <el-button type="primary" @click="saveHistoryNames">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>

import { findHistoryNames, saveHistoryNames } from '@/api/schoolInfo'

export default {
  name: 'SchoolHistoryName',
  props: {
    id: {
      type: String,
      require: true
    },
    updateHistoryNameVisible: {
      type: Boolean,
      require: true
    }

  },
  data() {
    return {
      schoolInfo: {
        historyNames: [
          { name: null, renamingDate: null }
        ]
      },
      schoolInfoRules: {
        historyName: [{ validator: this.validateHistoryName, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findHistoryNames()
  },
  methods: {
    saveHistoryNames() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) {
          return false
        }

        await saveHistoryNames({ id: this.id, historyNames: this.schoolInfo.historyNames })
        this.$message.success('操作成功')
      })
    },
    async findHistoryNames() {
      const result = await findHistoryNames(this.id)
      const historyNames = result.data
      this.schoolInfo.historyNames = historyNames && historyNames.length ? historyNames : [{
        name: null,
        renamingDate: null
      }]
    },
    validateHistoryName(rule, value, callback) {
      if (!this.schoolInfo.historyNames || !this.schoolInfo.historyNames.length) {
        return callback()
      }

      let length = this.schoolInfo.historyNames.filter((item) => !item.name).length

      if (length) {
        return callback(new Error('名字不能为空'))
      }

      length = this.schoolInfo.historyNames.filter((item) => !item.renamingDate).length

      if (length) {
        return callback(new Error('更名时间不能为空'))
      }

      callback()
    },
    close() {
      this.$emit('update:updateHistoryNameVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.el-input {
  width: 300px;
  margin-right: 10px;
}

.add-history {
  margin-left: 10px;
  margin-right: 10px;
}

span {
  font-size: 20px;
}
</style>
