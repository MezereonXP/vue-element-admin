<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" disabled />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model.trim="user.phone_number" />
    </el-form-item>
    <el-form-item label="年龄">
      <el-input-number v-model="user.age" :min="0" :max="150" />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="user.sex" placeholder="Select sex">
        <el-option label="男" value="male" />
        <el-option label="女" value="female" />
        <el-option label="其他" value="other" />
      </el-select>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="user.address" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          email: '',
          phone_number: '',
          age: 0,
          sex: '',
          address: ''
        }
      }
    }
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch('user/updateProfile', this.user)
        this.$message({
          message: 'User information has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
      } catch (error) {
        this.$message({
          message: error.message || 'Failed to update user information',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
