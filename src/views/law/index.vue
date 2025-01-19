<template>
  <div class="container">
    <el-button v-if="isAdmin" type="primary" icon="el-icon-edit" @click="openEditor">编辑</el-button>
    <div v-loading="loading" style="height: 90%;" v-html="content" />
    <p style="margin-top: 20px; color: #999; font-size: 14px; margin-top: 100px; width: 100%; text-align: right;">更新时间: {{ updatedAt }}</p>
    <!-- Button visible only for admin role using Element UI -->

    <!-- Modal for TinyMCE editor -->
    <el-dialog :visible.sync="editorVisible" title="Edit Content">
      <!-- <tinymce-editor v-model="editorContent" /> -->
      <!-- <Tinymce ref="editor" v-model="editorContent" :height="400" /> -->
      <!-- <el-form-item style="margin-bottom: 30px;"> -->
      <Tinymce ref="editor" v-model="editorContent" :height="400" />
      <!-- </el-form-item> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveContent">保存</el-button>
        <el-button @click="editorVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLaw, updateLaw } from '@/api/common'
import moment from 'moment'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Law',
  components: { Tinymce },
  data() {
    return {
      content: '',
      updatedAt: '',
      isAdmin: false,
      loading: false,
      editorVisible: false, // Track modal visibility
      editorContent: '' // Content for the TinyMCE editor
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
    this.fetchLawData()
    this.checkUserRole()
  },
  methods: {
    async fetchLawData() {
      try {
        this.loading = true
        const response = await getLaw()
        this.content = response.data.content
        this.updatedAt = moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')
        this.loading = false
      } catch (error) {
        console.error('Error fetching law data:', error)
        this.loading = false
      }
    },
    checkUserRole() {
      if (this.roles !== undefined) {
        this.isAdmin = this.roles.includes('admin')
        console.log(this.roles)
      }
    },
    openEditor() {
      this.editorContent = this.content // Load current content into the editor
      this.editorVisible = true // Show the editor modal
    },
    async saveContent() {
      try {
        await updateLaw({ content: this.editorContent }) // Save the updated content
        this.content = this.editorContent // Update the displayed content
        this.editorVisible = false // Close the modal
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

  <style scoped>
  .container {
    margin: 20px;
  }
  </style>
