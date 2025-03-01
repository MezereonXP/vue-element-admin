<template>
  <div class="upload-container">
    <el-upload
      v-if="imageUrl.length === 0"
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :on-progress="handleProgress"
      :before-upload="beforeUpload"
      class="image-uploader"
      drag
      name="file"
      :headers="make_headers()"
      action="http://112.126.68.240:5000/upload/upload_img"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将图片拖到此处，或<em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png/gif文件，且不超过3MB</div>
    </el-upload>
    <div v-else class="image-preview image-app-preview">
      <div class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
          <i class="el-icon-download" style="margin-left: 30px;" @click="downloadImage" />
        </div>
      </div>
    </div>
    <!-- <div class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'SingleImageUpload3',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' },
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
      uploadProgress: 0
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    beforeUpload(file) {
      const isValidType = this.allowedTypes.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 3
      if (!isValidType) {
        this.$message.error('上传图片只能是JPG/PNG/GIF格式!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过3MB!')
        return false
      }
      return true
    },
    handleProgress(event, file) {
      this.$emit('progress', event)
    },
    handleImageSuccess(file) {
      if (file.code !== 20000) {
        this.$message.error(file.error)
        return
      }
      this.emitInput(file.img_url)
      // Reset progress when upload is complete
      this.$emit('progress', { loaded: 0, total: 1 })
    },
    make_headers() {
      return {
        'X-Token': getToken()
      }
    },
    downloadImage() {
      window.open(this.imageUrl, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;

  .image-uploader {
    width: 35%;
    float: left;
  }

  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;

      .el-icon-delete {
        font-size: 36px;
      }

      .el-icon-download {
        font-size: 36px;
        margin-left: 50px;
      }
    }

    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }

  .image-app-preview {
    width: auto;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;

    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
