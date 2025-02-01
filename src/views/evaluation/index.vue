<template>
  <div class="createPost-container">
    <h1 v-if="checkContent()" style="text-align: center; margin-top: 20px; color: red;">您尚未进行实习评价，请及时进行评价！</h1>
    <el-form v-if="checkRole()" ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
    <div v-else class="no-permission">
      <h1>您不是学生，无法进行评价</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import { getInfo, updateProfile } from '@/api/user'

const defaultForm = {
  content: '', // 文章内容
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0,
  author: {
    username: ''
  }
}

export default {
  name: 'Evaluation',
  components: { Tinymce, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        content: [{ validator: validateRequire }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'id'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getInfo().then(response => {
        this.postForm.content = response.internship_evaluation
        if (this.postForm.content === undefined) {
          this.postForm.content = ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      const title = '实习评价'
      document.title = `${title}`
    },
    submitForm() {
      if (this.postForm.content === '') {
        this.$message.error('请填写评价内容')
        return
      }
      this.loading = true
      updateProfile({ internship_evaluation: this.postForm.content, id: this.id }).then(() => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('提交失败')
        this.loading = false
      })
    },
    checkRole() {
      return this.roles.includes('user')
    },
    checkContent() {
      return this.postForm.content === undefined || this.postForm.content === ''
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
  .no-permission {
    text-align: center;
    margin-top: 20px;
  }
  </style>
