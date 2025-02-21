<template>
  <div class="dashboard-editor-container">
    <h1>个人信息</h1>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="姓名">
        <span>{{ form.username }}</span>
        <!-- <el-input v-model="form.username" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="性别">
        <span>{{ form.sex === 'male' ? '男' : '女' }}</span>
        <!-- <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select> -->
      </el-descriptions-item>
      <el-descriptions-item label="年龄">
        <span>{{ form.age }}</span>
        <!-- <el-input v-model="form.age" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="班级">
        <span>{{ form.school_class }}</span>
        <!-- <el-input v-model="form.school_class" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="民族">
        <span>{{ form.nationality }}</span>
        <!-- <el-input v-model="form.nationality" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        <span>{{ form.phone_number }}</span>
        <!-- <el-input v-model="form.phone_number" /> -->
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        <span>{{ form.email }}</span>
        <!-- <el-input v-model="form.email" /> -->
      </el-descriptions-item>
    </el-descriptions>
    <!-- <el-button type="primary" @click="updateProfile" style="margin-top: 20px;">保存</el-button> -->
    <el-button type="primary" style="margin-top: 20px;" @click="changePassword">修改密码</el-button>
    <el-tag type="danger" style="margin-top: 20px; margin-left: 20px;">如需要修改个人信息请联系管理员</el-tag>
    <el-dialog :visible.sync="showUpdatePassword" title="修改密码" width="20%">
      <el-form ref="updatePasswordForm" :model="updatePasswordForm" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="updatePasswordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" @change="checkPassword">
          <el-input v-model="updatePasswordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" @change="checkPassword">
          <el-input v-model="updatePasswordForm.confirmPassword" type="password" />
          <el-tag v-if="updatePasswordForm.newPassword !== updatePasswordForm.confirmPassword" type="danger" style="margin-top: 10px;">两次密码不一致</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpdatePassword = false">取消</el-button>
        <el-button type="primary" @click="updatePassword">确认</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getInfo, updateProfile, updatePassword } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',
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
      },
      showUpdatePassword: false,
      updatePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
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
    },
    changePassword() {
      this.showUpdatePassword = true
      this.updatePasswordForm.oldPassword = ''
      this.updatePasswordForm.newPassword = ''
      this.updatePasswordForm.confirmPassword = ''
    },
    checkPassword() {
      if (this.updatePasswordForm.newPassword !== this.updatePasswordForm.confirmPassword) {
        this.$message.error('两次密码不一致')
      }
    },
    updatePassword() {
      if (this.updatePasswordForm.newPassword !== this.updatePasswordForm.confirmPassword) {
        this.$message.error('两次密码不一致')
        return
      }
      updatePassword(this.updatePasswordForm).then(response => {
        if (response.code === 20000) {
          this.$message.success('更新成功')
        } else {
          this.$message.error('更新失败 ' + response.error)
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
    .el-descriptions {
      margin-top: 20px;
      width: 50%;
      .el-descriptions-item__label {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>
