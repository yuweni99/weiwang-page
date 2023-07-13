<template>
  <div>
    <el-form
      ref="schoolInfoForm"
      :disabled="descFlag"
      :rules="schoolInfoRules"
      :model="schoolInfo"
      label-width="80px"
    >

      <el-row>
        <el-col :span="12">
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

        <el-col :span="12">
          <el-form-item label="排名" prop="ranking">
            <el-input v-model="schoolInfo.ranking" type="number" size="mini" placeholder="请输入排名" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="统一信用代码">
            <el-input
              v-model="schoolInfo.unifiedCreditCode"
              size="mini"
              placeholder="请输入统一信用代码码"
              clearable
            />
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
          <el-form-item label="学校标识码">
            <el-input v-model="schoolInfo.identifier" size="mini" placeholder="请输入学校标识码" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="院校代码">
            <el-input v-model="schoolInfo.code" size="mini" placeholder="请输入院校代码" clearable />
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
            <el-input
              v-model="schoolInfo.createYear"
              type="number"
              size="mini"
              placeholder="请输入创建年份市"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="校训">
            <el-input
              v-model="schoolInfo.schoolMotto"
              size="mini"
              placeholder="请输入校训"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学校类型">
            <el-select
              v-model="selectSchoolTypes"
              multiple
              style="width: 300px"
              size="mini"
              placeholder="请选择学校类型"
            >
              <el-option
                v-for="item in schoolTypes"
                :key="item"

                :label="item"
                :value="item"
              />
            </el-select>

          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="自然类型">
            <el-select
              v-model="selectNaturalTypes"
              multiple
              style="width: 300px"
              size="mini"
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
            <el-select v-model="schoolInfo.privateStatus" size="mini" placeholder="请选择是否私立">
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
          <el-form-item label="办学性质">
            <el-select
              v-model="selectEducationNatures"
              style="width: 300px"
              multiple
              filterable
              size="mini"
              allow-create
              default-first-option
              placeholder="请选择办学性质"
            >
              <el-option
                v-for="item in educationNatures"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>

          </el-form-item>

        </el-col>

        <el-col v-for="(item,index) in addresses" :ke="item.value" :span="24">
          <el-form-item class="address-container" label="地址">
            <el-input
              v-model="item.value"
              size="mini"
              placeholder="请输入地址"
              clearable
            />
            <i class="el-icon-plus" @click="addresses.push({value: ''})" />
            <i class="el-icon-minus" @click="addresses.splice(index, 1)" />
          </el-form-item>

        </el-col>

        <el-col :span="12">
          <el-form-item label="停办状态">
            <el-select v-model="schoolInfo.suspensionStatus" size="mini" placeholder="请选择是否停办">
              <el-option
                v-for="item in statues"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="schoolInfo.suspensionStatus === '1'" :span="12">
          <el-form-item label="停办年份">
            <el-input v-model="schoolInfo.suspensionYear" type="number" clearable size="mini" placeholder="停办年份" />
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
    <div class="operation-container">
      <span>操作</span>
      <el-button @click="handleClose(false)">取 消</el-button>
      <el-button type="primary" @click="saveSchoolInfo">确 定</el-button>
    </div>
  </div>
</template>

<script>

import { addSchoolInfo, getInfo, updateSchoolInfo } from '@/api/schoolInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'EditSchoolInfo',
  props: {
    descFlag: {
      type: Boolean,
      require: true
    },
    id: {
      type: String,
      require: true
    },
    handleClose: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/upload`,

      selectTags: [],
      selectSchoolTypes: [],
      addresses: [],
      selectNaturalTypes: [],
      selectEducationNatures: [],
      educationNatures: [
        '公立大学',
        '公办大学',
        '二级学院'
      ],
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
      categories: ['本科', '专科'],
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
      schoolInfo: {
        suspensionStatus: null,
        suspensionYear: null
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
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    if (this.id) {
      this.getInfo()
    } else {
      this.addresses = [{}]
    }
  },
  methods: {
    saveSchoolInfo() {
      this.$refs.schoolInfoForm.validate(async(valid) => {
        if (!valid) {
          return false
        }

        this.schoolInfo.tag = this.selectTags.join(',')
        this.schoolInfo.type = this.selectSchoolTypes.join(',')
        this.schoolInfo.naturalType = this.selectNaturalTypes.join(',')
        this.schoolInfo.educationNature = this.selectEducationNatures.join(',')
        this.schoolInfo.address = this.addresses.map(item => item.value).join(',')

        if (this.schoolInfo.suspensionStatus === '0') {
          this.schoolInfo.suspensionYear = null
        }

        !this.schoolInfo.id ? await addSchoolInfo(this.schoolInfo) : await updateSchoolInfo(this.schoolInfo)
        this.$message.success('操作成功')
        this.handleClose(true)
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
    async getInfo() {
      const result = await getInfo(this.id)
      this.schoolInfo = result.data

      if (this.schoolInfo.tag) {
        this.selectTags = this.schoolInfo.tag.replaceAll(' ', ',').split(',').filter(item => item) || []
      }

      if (this.schoolInfo.type) {
        this.selectSchoolTypes = this.schoolInfo.type.split(',').filter(item => item) || []
      }
      if (this.schoolInfo.naturalType) {
        this.selectNaturalTypes = this.schoolInfo.naturalType.split(',').filter(item => item) || []
      }
      if (this.schoolInfo.educationNature) {
        this.selectEducationNatures = this.schoolInfo.educationNature.split(',').filter(item => item) || []
      }
      if (this.schoolInfo.address) {
        this.addresses = this.schoolInfo.address.split(',').map(item => ({ value: item })) || [{}]
      } else {
        this.addresses = [{}]
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

.address-container {
  .el-input {
    width: 90%;
  }

  i {
    font-size: 20px;
    margin-left: 10px;
    //border: 1px solid #000000;
  }

}

.operation-container {
  span:nth-child(1) {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    margin-left: 30px;
    margin-right: 20px;

  }
}

</style>
