<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <!-- <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false" @click="uploadAvatar">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb> -->
        <!-- <img :src="user.avatar" alt="avatar" style="width: 100px; height: 100px; border-radius: 50%;"> -->
        <!-- <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange"
          :auto-upload="false">
        </el-upload> -->
        <img v-if="user.avatar" :src="user.avatar" class="avatar">
        <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        <!-- </el-upload> -->
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Introduction</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.introduction }}
          </div>
        </div>
      </div>

      <!-- <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Introduction</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div> -->
    </div>
  </el-card>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import { uploadAvatar } from '@/api/user'
// import user from 'mock/user';

export default {
  components: { },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: '',
          address: '',
          introduction: ''
        }
      }
    },
    handleAvatarSuccess(res, file) {
      this.user.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.user.avatar = URL.createObjectURL(file.raw)
      return isJPG || isPNG && isLt2M
    },
    handleAvatarChange(file) {
      console.log('change!')
      uploadAvatar(file).then(res => {
        this.user.avatar = res.data.avatar_url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
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
  border-radius: 50%;
  display: block;
}
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
