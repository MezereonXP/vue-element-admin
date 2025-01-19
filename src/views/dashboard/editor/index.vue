<template>
  <div class="dashboard-editor-container">
    <h1>个人信息</h1>
    <el-form>
      <el-form-item label="姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.school_class" />
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="form.nationality" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone_number" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProfile">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getInfo, updateProfile } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',
  components: { },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      form: {
        name: '',
        gender: '',
        age: '',
        schoolClass: '',
        nationality: '',
        phone_number: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then(response => {
        this.form = response
        if (response.code === 20000) {
          this.$message.success('获取成功')
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    updateProfile() {
      updateProfile(this.form).then(response => {
        if (response.code === 20000) {
          this.$message.success('更新成功')
        } else {
          this.$message.error('更新失败')
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
    .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
