<template>
  <el-descriptions :column="1" border class="profile-descriptions">
    <el-descriptions-item label="姓名">
      <!-- <el-input v-model.trim="user.name" disabled /> -->
      <p class="content">{{ user.name }}</p>
    </el-descriptions-item>
    <el-descriptions-item label="邮箱">
      <p class="content">{{ user.email }}</p>
    </el-descriptions-item>
    <el-descriptions-item label="手机号码">
      <p class="content">{{ user.phone_number }}</p>
    </el-descriptions-item>
    <el-descriptions-item label="年龄">
      <p class="content">{{ user.age }}</p>
    </el-descriptions-item>
    <el-descriptions-item label="性别">
      <p class="content">{{ user.sex === 'male' ? '男' : '女' }}</p>
    </el-descriptions-item>
    <el-descriptions-item label="地址">
      <p class="content">{{ user.address }}</p>
    </el-descriptions-item>
    <!-- <el-descriptions-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-descriptions-item> -->
  </el-descriptions>
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

<style scoped>
.profile-descriptions {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin: 20px 0;
  width: 100%;
  overflow: hidden;
  /* Prevent content overflow */
  position: relative;
  /* Establish positioning context */
}

/* Targeting Element UI's description classes for customization */
.profile-descriptions :deep(.el-descriptions__header) {
  margin-bottom: 20px;
}

.profile-descriptions :deep(.el-descriptions__body) {
  width: 100%;
}

.profile-descriptions :deep(.el-descriptions-item__label) {
  font-weight: 600;
  color: #333;
  background-color: #f5f7fa;
  padding: 16px;
  font-size: 14px;
  width: 120px;
  box-sizing: border-box;
}

.profile-descriptions :deep(.el-descriptions-item__content) {
  padding: 16px 24px;
  background-color: #fff;
}

.profile-descriptions :deep(.el-descriptions-item__container) {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #EBEEF5;
}

.profile-descriptions :deep(.el-descriptions-item__container:last-child) {
  border-bottom: none;
}

.content {
  font-size: 15px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

/* Hover effect for rows */
.profile-descriptions :deep(.el-descriptions-item) {
  transition: background-color 0.3s ease;
  width: 100%;
  display: flex;
}

.profile-descriptions :deep(.el-descriptions-item):hover {
  background-color: #f9fafc;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .profile-descriptions :deep(.el-descriptions-item__label) {
    width: 100px;
    padding: 12px;
  }

  .profile-descriptions :deep(.el-descriptions-item__content) {
    padding: 12px;
  }

  .content {
    font-size: 14px;
  }
}
</style>
